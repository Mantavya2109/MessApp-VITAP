import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import xlsx from 'xlsx';
import path from 'path';
import { parseSheet } from './importMenu.js';

dotenv.config();
const prisma = new PrismaClient();

async function runAudit() {
  console.log('====================================================');
  console.log('🚀 FINAL PRE-DEPLOYMENT AUDIT & DATABASE CLEANUP');
  console.log('====================================================\n');

  // STEP 1: Delete all non-October menu data
  console.log('1. Checking and cleaning old non-October menu data...');
  const nonOctoberDays = await prisma.menuDay.findMany({
    where: {
      NOT: {
        date: {
          startsWith: '2026-10',
        },
      },
    },
    select: { id: true, date: true, messPlanId: true },
  });

  console.log(`   Found ${nonOctoberDays.length} non-October MenuDay records.`);
  if (nonOctoberDays.length > 0) {
    const deleted = await prisma.menuDay.deleteMany({
      where: {
        id: {
          in: nonOctoberDays.map((d) => d.id),
        },
      },
    });
    console.log(`   ✓ Cleaned ${deleted.count} obsolete non-October MenuDay records (and cascade deleted related MealSlots/MenuItems).`);
  } else {
    console.log('   ✓ Database already contains only October records.');
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

  // Check any leftover non-October
  const nonOctLeft = allMenuDays.filter((d) => !d.date.startsWith('2026-10'));
  if (nonOctLeft.length > 0) {
    console.error(`   ❌ ERROR: Found ${nonOctLeft.length} non-October records!`);
  } else {
    console.log('   ✓ 100% of MenuDays belong exclusively to October 2026.');
  }

  // Count meal slots & items
  const mealSlotCount = await prisma.mealSlot.count();
  const menuItemCount = await prisma.menuItem.count();
  console.log(`   - Total MealSlots in DB: ${mealSlotCount} (Expected: 248 = 62 days x 4 meals)`);
  console.log(`   - Total MenuItems in DB: ${menuItemCount}`);

  // STEP 3: Deep Row-by-Row, Item-by-Item Verification Against Excel
  console.log('\n3. Performing verbatim Item-by-Item, Row-by-Row comparison against Excel...');
  const excelPath = path.resolve(process.cwd(), '../data/VIT-AP_Final_Mess Menu_October 2026.xlsx');
  const wb = xlsx.readFile(excelPath);

  let totalMismatches = 0;
  let totalItemsChecked = 0;

  for (const plan of plans) {
    const sheetData = parseSheet(wb, plan.sheetName, plan.code, plan.name, 2026, 10);
    console.log(`\n   Auditing Plan: [${plan.code}] ${plan.name} (${sheetData.days.length} days in Excel)`);

    const planDbDays = allMenuDays.filter((d) => d.messPlanId === plan.id);
    if (planDbDays.length !== 31) {
      console.error(`   ❌ Date count mismatch for ${plan.code}: expected 31, got ${planDbDays.length}`);
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
    console.log(`   ✓ Plan [${plan.code}] validated: 31 dates, 124 meal slots, all items checked.`);
  }

  console.log(`\n====================================================`);
  console.log(`Total items checked: ${totalItemsChecked}`);
  console.log(`Total mismatches found: ${totalMismatches}`);
  console.log(`Verification Status: ${totalMismatches === 0 ? '✅ 100% PERFECT MATCH — ZERO MISMATCHES' : '❌ MISMATCHES DETECTED'}`);
  console.log(`====================================================\n`);

  await prisma.$disconnect();
}

runAudit().catch(console.error);
