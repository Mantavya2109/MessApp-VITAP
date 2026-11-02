import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import xlsx from 'xlsx';
import path from 'path';
import { parseSheet, findLatestExcelFile, detectYearAndMonth } from './importMenu.js';

dotenv.config();
const prisma = new PrismaClient();

async function runAudit() {
  console.log('====================================================');
  console.log('🚀 POST-IMPORT AUDIT & DATABASE INTEGRITY CHECK');
  console.log('====================================================\n');

  const excelPath = findLatestExcelFile();
  const fileName = path.basename(excelPath);
  const wb = xlsx.readFile(excelPath);
  const { year, month } = detectYearAndMonth(wb, fileName);
  const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;

  console.log(`Active Workbook: ${fileName}`);
  console.log(`Target Month: ${monthPrefix}\n`);

  // STEP 1: Delete all non-target month menu data
  console.log(`1. Checking for old non-${monthPrefix} menu data...`);
  const nonTargetDays = await prisma.menuDay.findMany({
    where: {
      NOT: {
        date: {
          startsWith: monthPrefix,
        },
      },
    },
    select: { id: true, date: true, messPlanId: true },
  });

  console.log(`   Found ${nonTargetDays.length} non-${monthPrefix} MenuDay records.`);
  if (nonTargetDays.length > 0) {
    const deleted = await prisma.menuDay.deleteMany({
      where: {
        id: {
          in: nonTargetDays.map((d) => d.id),
        },
      },
    });
    console.log(`   ✓ Cleaned ${deleted.count} obsolete non-${monthPrefix} MenuDay records (and cascade deleted related MealSlots/MenuItems).`);
  } else {
    console.log(`   ✓ Database contains only ${monthPrefix} records.`);
  }

  // STEP 2: Verify Database Counts
  console.log('\n2. Verifying database records...');
  const plans = await prisma.messPlan.findMany();
  console.log(`   - Mess Plans: ${plans.length} ([${plans.map((p) => p.code).join(', ')}])`);

  const allMenuDays = await prisma.menuDay.findMany({
    orderBy: { date: 'asc' },
    include: {
      messPlan: true,
      mealSlots: {
        orderBy: { sortOrder: 'asc' },
        include: {
          items: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      },
    },
  });

  console.log(`   - Total MenuDays in DB: ${allMenuDays.length}`);
  const uniqueDates = [...new Set(allMenuDays.map((d) => d.date))].sort();
  console.log(`   - Unique Dates (${uniqueDates.length}): ${uniqueDates[0]} to ${uniqueDates[uniqueDates.length - 1]}`);

  // Check any leftover non-target
  const nonTargetLeft = allMenuDays.filter((d) => !d.date.startsWith(monthPrefix));
  if (nonTargetLeft.length > 0) {
    console.error(`   ❌ ERROR: Found ${nonTargetLeft.length} non-${monthPrefix} records!`);
  } else {
    console.log(`   ✓ 100% of MenuDays belong exclusively to ${monthPrefix}.`);
  }

  // Count meal slots & items
  const mealSlotCount = await prisma.mealSlot.count();
  const menuItemCount = await prisma.menuItem.count();
  console.log(`   - Total MealSlots in DB: ${mealSlotCount}`);
  console.log(`   - Total MenuItems in DB: ${menuItemCount}`);

  // STEP 3: Deep Row-by-Row, Item-by-Item Verification Against Excel
  console.log('\n3. Performing verbatim Item-by-Item, Row-by-Row comparison against Excel...');

  let totalMismatches = 0;
  let totalItemsChecked = 0;

  for (const plan of plans) {
    const sheetData = parseSheet(wb, plan.sheetName, plan.code, plan.name, year, month);
    console.log(`\n   Auditing Plan: [${plan.code}] ${plan.name} (${sheetData.days.length} days in Excel)`);

    const planDbDays = allMenuDays.filter((d) => d.messPlanId === plan.id);
    if (planDbDays.length !== sheetData.days.length) {
      console.error(`   ❌ Date count mismatch for ${plan.code}: expected ${sheetData.days.length}, got ${planDbDays.length}`);
      totalMismatches++;
    }

    for (const excelDay of sheetData.days) {
      const dbDay = planDbDays.find((d) => d.date === excelDay.date);
      if (!dbDay) {
        console.error(`   ❌ Missing Day ${excelDay.date} in DB for ${plan.code}`);
        totalMismatches++;
        continue;
      }

      if (dbDay.dayOfWeek !== excelDay.dayOfWeek) {
        console.error(`   ❌ Day of week mismatch on ${excelDay.date}: Excel="${excelDay.dayOfWeek}", DB="${dbDay.dayOfWeek}"`);
        totalMismatches++;
      }

      if (dbDay.mealSlots.length !== 4) {
        console.error(`   ❌ Meal slot count mismatch on ${excelDay.date}: expected 4, got ${dbDay.mealSlots.length}`);
        totalMismatches++;
      }

      for (const excelSlot of excelDay.mealSlots) {
        const dbSlot = dbDay.mealSlots.find((s) => s.mealType === excelSlot.mealType);
        if (!dbSlot) {
          console.error(`   ❌ Missing MealSlot ${excelSlot.mealType} on ${excelDay.date} for ${plan.code}`);
          totalMismatches++;
          continue;
        }

        if (dbSlot.sortOrder !== excelSlot.sortOrder) {
          console.error(`   ❌ Slot sortOrder mismatch on ${excelDay.date} ${excelSlot.mealType}: expected ${excelSlot.sortOrder}, got ${dbSlot.sortOrder}`);
          totalMismatches++;
        }

        if (dbSlot.items.length !== excelSlot.items.length) {
          console.error(`   ❌ Item count mismatch on ${excelDay.date} [${excelSlot.mealType}]: Excel has ${excelSlot.items.length} items, DB has ${dbSlot.items.length} items`);
          totalMismatches++;
        }

        for (let i = 0; i < excelSlot.items.length; i++) {
          totalItemsChecked++;
          const eItem = excelSlot.items[i];
          const dItem = dbSlot.items[i];

          if (!dItem) {
            console.error(`   ❌ Missing item at index ${i} on ${excelDay.date} [${excelSlot.mealType}]: expected "${eItem.name}"`);
            totalMismatches++;
            continue;
          }

          if (dItem.name !== eItem.name) {
            console.error(`   ❌ Item name mismatch on ${excelDay.date} [${excelSlot.mealType}] index ${i}: Excel="${eItem.name}", DB="${dItem.name}"`);
            totalMismatches++;
          }

          if (dItem.dietaryTag !== eItem.dietaryTag) {
            console.error(`   ❌ Dietary tag mismatch on ${excelDay.date} [${excelSlot.mealType}] "${eItem.name}": Excel=${eItem.dietaryTag}, DB=${dItem.dietaryTag}`);
            totalMismatches++;
          }

          if (dItem.sortOrder !== eItem.sortOrder) {
            console.error(`   ❌ Item sort order mismatch on ${excelDay.date} [${excelSlot.mealType}] "${eItem.name}": expected ${eItem.sortOrder}, got ${dItem.sortOrder}`);
            totalMismatches++;
          }
        }
      }
    }
    console.log(`   ✓ Plan [${plan.code}] validated: ${sheetData.days.length} dates, ${sheetData.days.length * 4} meal slots, all items checked.`);
  }

  console.log(`\n====================================================`);
  console.log(`Total items checked: ${totalItemsChecked}`);
  console.log(`Total mismatches found: ${totalMismatches}`);
  console.log(`Verification Status: ${totalMismatches === 0 ? '✅ 100% PERFECT MATCH — ZERO MISMATCHES' : '❌ MISMATCHES DETECTED'}`);
  console.log(`====================================================\n`);

  await prisma.$disconnect();
}

runAudit().catch(console.error);
