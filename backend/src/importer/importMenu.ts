import xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import { DietaryTag, MealType } from '../types/index.js';

export interface ImportOptions {
  filePath?: string;
  year?: number;
  month?: number; // 1-12
  dryRun?: boolean;
}

export interface ParsedItem {
  name: string;
  dietaryTag: DietaryTag | null;
  sortOrder: number;
}

export interface ParsedMealSlot {
  mealType: MealType;
  sortOrder: number;
  items: ParsedItem[];
}

export interface ParsedMenuDay {
  date: string; // YYYY-MM-DD
  dayOfWeek: string;
  mealSlots: ParsedMealSlot[];
}

export interface ParsedSheetData {
  planCode: string;
  planName: string;
  sheetName: string;
  days: ParsedMenuDay[];
}

const MONTH_NAMES: Record<string, number> = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
};

const DAY_NAME_MAP: Record<string, string> = {
  sat: 'Saturday',
  sun: 'Sunday',
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
};

export function extractExplicitDietaryTag(dishName: string): DietaryTag | null {
  const lower = dishName.toLowerCase();

  // Explicit Veg
  if (lower.includes('(veg)') || lower.includes('[veg]')) {
    return DietaryTag.VEG;
  }

  // Explicit Non-Veg
  if (
    lower.includes('(non-veg)') ||
    lower.includes('(non veg)') ||
    lower.includes('[non-veg]') ||
    lower.includes('[non veg]') ||
    lower.includes('(nonveg)') ||
    lower.includes('(nv)')
  ) {
    return DietaryTag.NON_VEG;
  }

  // Explicit Egg Less
  if (
    lower.includes('(egg less)') ||
    lower.includes('(eggless)') ||
    lower.includes('[egg less]') ||
    lower.includes('[eggless]')
  ) {
    return DietaryTag.EGG_LESS;
  }

  return null;
}

export function detectYearAndMonth(workbook: xlsx.WorkBook, fileName: string): { year: number; month: number } {
  // Check filename first (e.g. "VIT-AP_Final Mess Menu_September 2026.xlsx")
  const fileLower = fileName.toLowerCase();
  let detectedMonth: number | null = null;
  let detectedYear: number | null = null;

  for (const [name, m] of Object.entries(MONTH_NAMES)) {
    if (fileLower.includes(name)) {
      detectedMonth = m;
      break;
    }
  }

  const yearMatch = fileLower.match(/\b(202\d)\b/);
  if (yearMatch) {
    detectedYear = parseInt(yearMatch[1], 10);
  }

  // If not found in filename, check sheet headers
  if (!detectedMonth || !detectedYear) {
    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const rawData: any[][] = xlsx.utils.sheet_to_json(sheet, { header: 1 });
      for (let r = 0; r < Math.min(5, rawData.length); r++) {
        const rowText = (rawData[r] || []).join(' ').toLowerCase();
        for (const [name, m] of Object.entries(MONTH_NAMES)) {
          if (rowText.includes(name)) {
            detectedMonth = m;
          }
        }
        const yMatch = rowText.match(/\b(202\d)\b/);
        if (yMatch) {
          detectedYear = parseInt(yMatch[1], 10);
        }
      }
    }
  }

  return {
    year: detectedYear || 2026,
    month: detectedMonth || 9, // default to September if unresolved
  };
}

export function parseDayHeader(cellValue: string, year: number, month: number): { dayOfWeek: string; dates: string[] } | null {
  const text = cellValue.replace(/\r?\n/g, ' ').trim();
  // e.g. "Tue 1, 15, 29" or "Thu 3, 17"
  const match = text.match(/^([A-Za-z]+)\s+([\d,\s]+)$/);
  if (!match) return null;

  const prefix = match[1].toLowerCase().slice(0, 3);
  const dayOfWeek = DAY_NAME_MAP[prefix] || match[1];
  const dateNumbers = match[2]
    .split(',')
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !isNaN(n) && n >= 1 && n <= 31);

  if (dateNumbers.length === 0) return null;

  const dates = dateNumbers.map((d) => {
    const yStr = String(year);
    const mStr = String(month).padStart(2, '0');
    const dStr = String(d).padStart(2, '0');
    return `${yStr}-${mStr}-${dStr}`;
  });

  return { dayOfWeek, dates };
}

export function parseSheet(workbook: xlsx.WorkBook, sheetName: string, planCode: string, planName: string, year: number, month: number): ParsedSheetData {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found in workbook.`);
  }

  const rawData: any[][] = xlsx.utils.sheet_to_json(sheet, { header: 1, raw: false });

  // Locate header row
  let headerRowIndex = -1;
  for (let r = 0; r < rawData.length; r++) {
    const row = rawData[r];
    if (row && row.some((c) => typeof c === 'string' && c.trim().toLowerCase() === 'day')) {
      headerRowIndex = r;
      break;
    }
  }

  if (headerRowIndex === -1) {
    headerRowIndex = 2;
  }

  interface GroupBlock {
    dayOfWeek: string;
    dates: string[];
    breakfastLines: string[];
    lunchLines: string[];
    snacksLines: string[];
    dinnerLines: string[];
  }

  const groups: GroupBlock[] = [];
  let currentGroup: GroupBlock | null = null;

  for (let r = headerRowIndex + 1; r < rawData.length; r++) {
    const row = rawData[r];
    if (!row || row.length === 0) continue;

    const rowText = (row || []).map((c: any) => (c != null ? String(c).trim() : '')).join(' ').toLowerCase();

    // Stop at footnotes/terms/instructions in ANY column
    if (
      rowText.includes('mess service instructions') ||
      rowText.includes('service instructions') ||
      rowText.includes('thick curd must be served') ||
      rowText.includes('instructions') ||
      rowText.includes('strictly') ||
      rowText.includes('contract') ||
      rowText.includes('caterer') ||
      rowText.startsWith('*')
    ) {
      break;
    }

    const col0 = row[0] != null ? String(row[0]).trim() : '';

    const headerMatch = parseDayHeader(col0, year, month);
    if (headerMatch) {
      if (currentGroup) {
        groups.push(currentGroup);
      }
      currentGroup = {
        dayOfWeek: headerMatch.dayOfWeek,
        dates: headerMatch.dates,
        breakfastLines: [],
        lunchLines: [],
        snacksLines: [],
        dinnerLines: [],
      };
    }

    if (!currentGroup) continue;

    const bVal = row[1] != null ? String(row[1]) : '';
    const lVal = row[2] != null ? String(row[2]) : '';
    const sVal = row[3] != null ? String(row[3]) : '';
    const dVal = row[4] != null ? String(row[4]) : '';

    const addLines = (text: string, target: string[]) => {
      const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
      for (const line of lines) {
        target.push(line);
      }
    };

    addLines(bVal, currentGroup.breakfastLines);
    addLines(lVal, currentGroup.lunchLines);
    addLines(sVal, currentGroup.snacksLines);
    addLines(dVal, currentGroup.dinnerLines);
  }

  if (currentGroup) {
    groups.push(currentGroup);
  }

  // Expand grouped dates into individual MenuDay records
  const dayMap: Map<string, ParsedMenuDay> = new Map();

  const mealDefinitions: { type: MealType; sortOrder: number; key: keyof Pick<GroupBlock, 'breakfastLines' | 'lunchLines' | 'snacksLines' | 'dinnerLines'> }[] = [
    { type: MealType.BREAKFAST, sortOrder: 1, key: 'breakfastLines' },
    { type: MealType.LUNCH, sortOrder: 2, key: 'lunchLines' },
    { type: MealType.SNACKS, sortOrder: 3, key: 'snacksLines' },
    { type: MealType.DINNER, sortOrder: 4, key: 'dinnerLines' },
  ];

  for (const g of groups) {
    for (const date of g.dates) {
      const mealSlots: ParsedMealSlot[] = mealDefinitions.map((def) => {
        const lines = g[def.key];
        const items: ParsedItem[] = lines.map((name, idx) => ({
          name,
          dietaryTag: extractExplicitDietaryTag(name),
          sortOrder: idx + 1,
        }));
        return {
          mealType: def.type,
          sortOrder: def.sortOrder,
          items,
        };
      });

      dayMap.set(date, {
        date,
        dayOfWeek: g.dayOfWeek,
        mealSlots,
      });
    }
  }

  const sortedDays = Array.from(dayMap.values()).sort((a, b) => a.date.localeCompare(b.date));

  return {
    planCode,
    planName,
    sheetName,
    days: sortedDays,
  };
}

export function findLatestExcelFile(): string {
  const dataDir = path.resolve(process.cwd(), '../data');
  if (!fs.existsSync(dataDir)) {
    throw new Error(`Data directory not found at ${dataDir}`);
  }

  const files = fs.readdirSync(dataDir).filter((f) => f.endsWith('.xlsx') && !f.startsWith('~$'));
  if (files.length === 0) {
    throw new Error('No .xlsx files found in data directory');
  }

  // Prioritize September if present, or sort by name
  const sept = files.find((f) => f.toLowerCase().includes('september'));
  if (sept) {
    return path.join(dataDir, sept);
  }

  return path.join(dataDir, files[files.length - 1]);
}

export async function importExcelMenu(options: ImportOptions = {}) {
  const resolvedPath = options.filePath || findLatestExcelFile();
  const fileName = path.basename(resolvedPath);
  const dryRun = options.dryRun || false;

  const workbook = xlsx.readFile(resolvedPath);
  const { year, month } = detectYearAndMonth(workbook, fileName);

  console.log(`\n========================================`);
  console.log(`📊 Mess Menu Excel Importer`);
  console.log(`Workbook: ${fileName}`);
  console.log(`Detected Month/Year: ${year}-${String(month).padStart(2, '0')}`);
  console.log(`Mode: ${dryRun ? 'DRY-RUN (Validation only)' : 'DATABASE IMPORT'}`);
  console.log(`========================================\n`);

  const sheetsToImport = [
    { sheetName: 'Veg & Non-Veg', planCode: 'VEG_NON_VEG', planName: 'Veg & Non-Veg Mess' },
    { sheetName: 'Special', planCode: 'SPECIAL', planName: 'Special Mess' },
  ];

  const parsedSheets: ParsedSheetData[] = [];

  for (const s of sheetsToImport) {
    console.log(`Parsing sheet "${s.sheetName}" for Plan "${s.planName}"...`);
    const parsed = parseSheet(workbook, s.sheetName, s.planCode, s.planName, year, month);
    parsedSheets.push(parsed);

    let totalItems = 0;
    let vegCount = 0;
    let nonVegCount = 0;
    let eggLessCount = 0;
    let untaggedCount = 0;

    for (const day of parsed.days) {
      for (const slot of day.mealSlots) {
        for (const it of slot.items) {
          totalItems++;
          if (it.dietaryTag === DietaryTag.VEG) vegCount++;
          else if (it.dietaryTag === DietaryTag.NON_VEG) nonVegCount++;
          else if (it.dietaryTag === DietaryTag.EGG_LESS) eggLessCount++;
          else untaggedCount++;
        }
      }
    }

    console.log(`  ✓ Days expanded: ${parsed.days.length} (from ${parsed.days[0]?.date} to ${parsed.days[parsed.days.length - 1]?.date})`);
    console.log(`  ✓ Total menu items: ${totalItems}`);
    console.log(`  ✓ Explicit tags breakdown: VEG=${vegCount}, NON_VEG=${nonVegCount}, EGG_LESS=${eggLessCount}, UNTAGGED=${untaggedCount}`);
  }

  if (dryRun) {
    console.log(`\n[DRY RUN COMPLETE] Validation succeeded. 0 database modifications made.`);
    return { success: true, parsedSheets, year, month, fileName };
  }

  const prisma = new PrismaClient();

  try {
    console.log(`\nImporting into PostgreSQL...`);
    for (const sheetData of parsedSheets) {
      // 1. Upsert MessPlan
      const messPlan = await prisma.messPlan.upsert({
        where: { code: sheetData.planCode },
        update: {
          name: sheetData.planName,
          sheetName: sheetData.sheetName,
        },
        create: {
          code: sheetData.planCode,
          name: sheetData.planName,
          sheetName: sheetData.sheetName,
        },
      });

      console.log(`  Upserted MessPlan: ${messPlan.code} (${messPlan.name})`);

      // Clean existing days for this plan in one fast query
      await prisma.menuDay.deleteMany({
        where: { messPlanId: messPlan.id },
      });

      // Insert days in fast parallel batches of 5
      const BATCH_SIZE = 5;
      for (let i = 0; i < sheetData.days.length; i += BATCH_SIZE) {
        const batch = sheetData.days.slice(i, i + BATCH_SIZE);
        await Promise.all(
          batch.map((day) =>
            prisma.menuDay.create({
              data: {
                messPlanId: messPlan.id,
                date: day.date,
                dayOfWeek: day.dayOfWeek,
                mealSlots: {
                  create: day.mealSlots.map((slot) => ({
                    mealType: slot.mealType,
                    sortOrder: slot.sortOrder,
                    items: {
                      create: slot.items.map((item) => ({
                        name: item.name,
                        dietaryTag: item.dietaryTag,
                        sortOrder: item.sortOrder,
                      })),
                    },
                  })),
                },
              },
            })
          )
        );
      }
      console.log(`  ✓ Successfully imported ${sheetData.days.length} days for ${sheetData.planCode}`);
    }

    console.log(`\n✅ Database import completed successfully!`);
    return { success: true, parsedSheets, year, month, fileName };
  } catch (error) {
    console.error(`❌ Database import failed:`, error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// CLI direct execution
if (process.argv[1]?.endsWith('importMenu.ts') || process.argv[1]?.endsWith('importMenu.js')) {
  const isDryRun = process.argv.includes('--dry-run');
  importExcelMenu({ dryRun: isDryRun }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
