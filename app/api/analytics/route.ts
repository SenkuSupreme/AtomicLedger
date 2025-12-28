
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Trade from '@/lib/models/Trade';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const portfolioId = searchParams.get('portfolioId');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  await dbConnect();
  
  // @ts-ignore
  const query: any = { userId: session.user.id };

  if (portfolioId && portfolioId !== 'all') {
      query.portfolioId = portfolioId;
  }

  if (startDate && endDate) {
      query.timestampEntry = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
      };
  }
  
  // If requesting a specific portfolio but it has no ID (legacy/orphan check?), 
  // actually portfolioId field is new so we might miss old trades if we strictly filter.
  // But the GET /portfolios endpoint runs a migration to fix this.
  // So we can assume trades have portfolioId if they visited the dashboard.

  // Use .lean() to skip Mongoose hydration for massive speed gains in analytical processing
  // @ts-ignore
  const trades = await Trade.find(query).sort({ timestampEntry: 1 }).lean(); 

  // Compute Metrics
  let totalPnl = 0;
  let wins = 0;
  let losses = 0;
  let totalTrades = trades.length;
  let totalR = 0;
  let totalWinPnl = 0;
  let totalLossPnl = 0;
  
  const heatmapData: Record<string, any> = {};
  
  // For Drawdown Calc
  let peakEquity = 0;
  let maxDrawdown = 0;
  let currentEquity = 0;

  const equityCurve = trades.map((t: any) => {
    const pnl = t.pnl || 0;
    totalPnl += pnl;
    currentEquity += pnl;

    if (pnl > 0) {
        wins++;
        totalWinPnl += pnl;
    }
    if (pnl < 0) {
        losses++;
        totalLossPnl += Math.abs(pnl);
    }

    if (t.rMultiple) totalR += t.rMultiple;

    // Drawdown Logic
    if (currentEquity > peakEquity) {
        peakEquity = currentEquity;
    }
    const drawdown = peakEquity - currentEquity;
    if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
    }

    const dateStr = new Date(t.timestampEntry).toISOString().split('T')[0];
    if (!heatmapData[dateStr]) heatmapData[dateStr] = { date: dateStr, count: 0, pnl: 0 };
    heatmapData[dateStr].count++;
    heatmapData[dateStr].pnl += pnl;

    return { name: new Date(t.timestampEntry).toLocaleDateString(), value: totalPnl };
  });

  const heatmap = Object.values(heatmapData);
  
  // Find Best/Worst Day
  let bestDay = { date: '', pnl: -Infinity };
  let worstDay = { date: '', pnl: Infinity };
  
  heatmap.forEach((day: any) => {
      if (day.pnl > bestDay.pnl) bestDay = day;
      if (day.pnl < worstDay.pnl) worstDay = day;
  });

  const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
  const avgWin = wins > 0 ? totalWinPnl / wins : 0;
  const avgLoss = losses > 0 ? totalLossPnl / losses : 0;
  
  // Calculate Profit Factor
  const profitFactor = totalLossPnl === 0 ? totalWinPnl : totalWinPnl / totalLossPnl;

  // Expectancy = (Win % * Avg Win) - (Loss % * Avg Loss)
  const expectancy = totalTrades > 0 ? ((wins/totalTrades) * avgWin) - ((losses/totalTrades) * avgLoss) : 0;
  
  const averageR = totalTrades > 0 ? totalR / totalTrades : 0;

  const stats = {
    totalPnl,
    winRate: winRate.toFixed(1),
    profitFactor: profitFactor.toFixed(2),
    totalTrades,
    averageR: averageR.toFixed(2),
    maxDrawdown: maxDrawdown.toFixed(2),
    expectancy: expectancy.toFixed(2),
    bestDay: bestDay.pnl !== -Infinity ? bestDay : null,
    worstDay: worstDay.pnl !== Infinity ? worstDay : null,

    equityCurve,
    wins,
    losses,
    heatmap
  };

  return NextResponse.json(stats);
}
