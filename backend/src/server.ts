import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { DietaryTag } from './types/index.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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

export default app;

// Start the server only when running locally
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 MessApp Backend API running on port ${PORT}`);
  });
}
