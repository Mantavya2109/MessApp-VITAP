import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import xlsx from 'xlsx';
import { PrismaClient } from '@prisma/client';
import { DietaryTag } from './types/index.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Night Canteen cached data helper
let cachedNightCanteenItems: any[] | null = null;
let lastNightCanteenLoad = 0;

function loadNightCanteenItems() {
  const now = Date.now();
  if (cachedNightCanteenItems && now - lastNightCanteenLoad < 60000) {
    return cachedNightCanteenItems;
  }
  const possiblePaths = [
    path.resolve(process.cwd(), 'data', 'Night canteen.xlsx'),
    path.resolve(process.cwd(), '..', 'data', 'Night canteen.xlsx'),
  ];
  let targetPath = '';
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      targetPath = p;
      break;
    }
  }
  if (!targetPath) {
    if (cachedNightCanteenItems) return cachedNightCanteenItems;
    throw new Error('Night canteen.xlsx data file not found');
  }

  const wb = xlsx.readFile(targetPath);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const raw: any[][] = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  const items = [];
  for (let i = 2; i < raw.length; i++) {
    const row = raw[i];
    if (!row || row.length === 0 || !row[3]) continue;
    items.push({
      sno: Number(row[0]) || (items.length + 1),
      type: String(row[1] || 'Veg').trim() === 'Non-Veg' ? 'Non-Veg' : 'Veg',
      category: String(row[2] || 'Other').trim(),
      name: String(row[3] || '').trim(),
      quantity: String(row[4] || '').trim(),
      price: Number(row[5]) || 0,
    });
  }
  cachedNightCanteenItems = items;
  lastNightCanteenLoad = now;
  return items;
}

// Get Night Canteen items
app.get('/api/night-canteen', (req, res) => {
  try {
    const items = loadNightCanteenItems();
    res.json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    console.error('Error fetching night canteen items:', error);
    res.status(500).json({ error: 'Failed to fetch night canteen menu' });
  }
});

// List mess plans
app.get('/api/plans', async (req, res) => {
  try {
    const plans = await prisma.messPlan.findMany({
      select: {
        id: true,
        code: true,
        name: true,
        sheetName: true,
      },
      orderBy: { code: 'asc' },
    });
    res.json({ plans });
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ error: 'Failed to fetch mess plans' });
  }
});

// Helper to normalize messPlan parameter
function resolvePlanCode(planParam?: string): string {
  if (!planParam) return 'VEG_NON_VEG';
  const clean = planParam.toUpperCase().trim();
  if (clean.includes('SPECIAL')) return 'SPECIAL';
  return 'VEG_NON_VEG';
}

// Get single day menu
app.get('/api/menu', async (req, res) => {
  try {
    const { date, messPlan } = req.query;
    const planCode = resolvePlanCode(messPlan as string);
    const dateStr = (date as string) || new Date().toISOString().split('T')[0];

    const plan = await prisma.messPlan.findUnique({
      where: { code: planCode },
    });

    if (!plan) {
      return res.status(404).json({ error: `Mess plan '${planCode}' not found.` });
    }

    const menuDay = await prisma.menuDay.findUnique({
      where: {
        messPlanId_date: {
          messPlanId: plan.id,
          date: dateStr,
        },
      },
      include: {
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

    if (!menuDay) {
      return res.status(404).json({
        error: `No menu found for date ${dateStr} under plan ${planCode}`,
        date: dateStr,
        planCode,
      });
    }

    res.json({
      messPlan: {
        code: plan.code,
        name: plan.name,
      },
      day: menuDay,
    });
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
});

// Get week / multi-day menu schedule
app.get('/api/menu/week', async (req, res) => {
  try {
    const { date, messPlan, range } = req.query;
    const planCode = resolvePlanCode(messPlan as string);

    const plan = await prisma.messPlan.findUnique({
      where: { code: planCode },
    });

    if (!plan) {
      return res.status(404).json({ error: `Mess plan '${planCode}' not found.` });
    }

    let whereClause: any = {
      messPlanId: plan.id,
    };

    // If a specific date is provided, find days in the vicinity or return month
    if (date && typeof date === 'string') {
      const targetDate = new Date(date);
      if (!isNaN(targetDate.getTime())) {
        // Calculate week bounds (Monday to Sunday, or -3 to +3 days)
        const d = new Date(targetDate);
        const dayOfWeek = d.getDay(); // 0 is Sun, 1 is Mon...
        const diffToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

        const mon = new Date(d);
        mon.setDate(d.getDate() + diffToMon);
        const sun = new Date(mon);
        sun.setDate(mon.getDate() + 6);

        const startDateStr = mon.toISOString().split('T')[0];
        const endDateStr = sun.toISOString().split('T')[0];

        // If range === 'month', fetch the entire month
        if (range === 'month') {
          const y = targetDate.getFullYear();
          const m = String(targetDate.getMonth() + 1).padStart(2, '0');
          whereClause.date = {
            gte: `${y}-${m}-01`,
            lte: `${y}-${m}-31`,
          };
        } else {
          whereClause.date = {
            gte: startDateStr,
            lte: endDateStr,
          };
        }
      }
    }

    const days = await prisma.menuDay.findMany({
      where: whereClause,
      orderBy: { date: 'asc' },
      include: {
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

    res.json({
      messPlan: {
        code: plan.code,
        name: plan.name,
      },
      days,
    });
  } catch (error) {
    console.error('Error fetching weekly menu:', error);
    res.status(500).json({ error: 'Failed to fetch weekly menu' });
  }
});

// Get total likes across all users
app.get('/api/likes', async (req, res) => {
  try {
    const record = await prisma.appLike.findUnique({
      where: { id: 'global' },
    });
    res.json({ count: record ? record.count : 0 });
  } catch (error) {
    console.error('Error fetching likes:', error);
    res.status(500).json({ error: 'Failed to fetch likes', count: 0 });
  }
});

// Increment likes (supports single or batched multiple likes per user)
app.post('/api/likes', async (req, res) => {
  try {
    const incrementBy =
      typeof req.body?.count === 'number' && req.body.count > 0
        ? Math.floor(req.body.count)
        : 1;

    const record = await prisma.appLike.upsert({
      where: { id: 'global' },
      update: {
        count: { increment: incrementBy },
      },
      create: {
        id: 'global',
        count: incrementBy,
      },
    });

    res.json({ count: record.count });
  } catch (error) {
    console.error('Error incrementing likes:', error);
    res.status(500).json({ error: 'Failed to update likes' });
  }
});

// Start local dev server if executed directly
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 MessApp Backend API running on http://localhost:${PORT}`);
  });
}

export default app;

