import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Trade from '@/lib/models/Trade';
import Portfolio from '@/lib/models/Portfolio';
import Strategy from '@/lib/models/Strategy';
import { calculateTradeMetrics } from '@/lib/utils/tradeCalculations';
import { authOptions } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  // Optional: Check session for ownership (could be used for UI purposes later like "Edit" button visibility)
  // const session = await getServerSession(authOptions);

  try {
    await dbConnect();
    // Force model registration
    Portfolio.init();
    Strategy.init();
    
    // Allow fetching by ID without user constraint to enable sharing
    const trade = await Trade.findOne({ _id: id })
    .populate('strategyId', 'name isTemplate')
    .populate('portfolioId', 'name accountType');

    if (!trade) {
      return NextResponse.json({ message: 'Trade not found' }, { status: 404 });
    }

    return NextResponse.json(trade);
  } catch (error) {
    console.error('Fetch trade error:', error);
    return NextResponse.json({ message: 'Error fetching trade' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    await dbConnect();

    // Calculate derived fields
    const updateData = { ...body };
    
    // Recalculate metrics if sufficient data is provided
    if (updateData.entryPrice && updateData.quantity) {
      try {
        const metrics = calculateTradeMetrics({
          entryPrice: updateData.entryPrice,
          exitPrice: updateData.exitPrice,
          stopLoss: updateData.stopLoss,
          takeProfit: updateData.takeProfit,
          quantity: updateData.quantity,
          direction: updateData.direction || 'long',
          portfolioBalance: updateData.portfolioBalance || 10000,
          fees: updateData.fees || 0,
          assetType: updateData.assetType || 'forex',
          symbol: updateData.symbol || '',
        });

        // Update derived fields
        updateData.pnl = metrics.netPnl;
        updateData.grossPnl = metrics.grossPnl;
        updateData.rMultiple = metrics.rMultiple;
        updateData.riskAmount = metrics.riskAmount;
        updateData.accountRisk = metrics.accountRisk;
        updateData.targetRR = metrics.targetRR;
        updateData.actualRR = metrics.actualRR;
      } catch (e) {
        console.error("Error recalculating metrics during update:", e);
      }
    }

    const trade = await Trade.findById(id);
    if (!trade) {
      return NextResponse.json({ message: 'Trade not found' }, { status: 404 });
    }

    // Capture old state for balance adjustment
    const oldPortfolioId = trade.portfolioId?.toString();
    const oldPnL = trade.pnl || 0;

    // Apply updates
    Object.assign(trade, updateData);

    const updatedTrade = await trade.save();
    
    // Sync Portfolio Balance
    const newPortfolioId = updatedTrade.portfolioId?.toString();
    const newPnL = updatedTrade.pnl || 0;

    if (oldPortfolioId && newPortfolioId) {
      if (oldPortfolioId === newPortfolioId) {
        // Same portfolio, adjust by difference
        const pnlDiff = newPnL - oldPnL;
        if (pnlDiff !== 0) {
          await Portfolio.findByIdAndUpdate(oldPortfolioId, {
            $inc: { currentBalance: pnlDiff }
          });
        }
      } else {
        // Portfolio changed
        // 1. Revert old PnL from old portfolio
        await Portfolio.findByIdAndUpdate(oldPortfolioId, {
          $inc: { currentBalance: -oldPnL }
        });
        // 2. Add new PnL to new portfolio
        await Portfolio.findByIdAndUpdate(newPortfolioId, {
          $inc: { currentBalance: newPnL }
        });
      }
    } else if (newPortfolioId) {
       // Added to a portfolio (was null before)
       await Portfolio.findByIdAndUpdate(newPortfolioId, {
          $inc: { currentBalance: newPnL }
       });
    } else if (oldPortfolioId) {
       // Removed from a portfolio (now null)
       await Portfolio.findByIdAndUpdate(oldPortfolioId, {
          $inc: { currentBalance: -oldPnL }
       });
    }

    // Re-populate for response
    await updatedTrade.populate('strategyId', 'name isTemplate');
    await updatedTrade.populate('portfolioId', 'name accountType');

    return NextResponse.json(updatedTrade);
  } catch (error) {
    console.error('Update trade error:', error);
    return NextResponse.json({ message: 'Error updating trade' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    await dbConnect();
    
    const trade = await Trade.findOne({ 
      _id: id, 
      // @ts-ignore
      userId: session.user.id 
    });

    if (!trade) {
      return NextResponse.json({ message: 'Trade not found' }, { status: 404 });
    }

    // Revert Portfolio Balance
    if (trade.portfolioId && trade.pnl !== null && trade.pnl !== undefined) {
       await Portfolio.findByIdAndUpdate(trade.portfolioId, {
          $inc: { currentBalance: -trade.pnl }
       });
    }

    await trade.deleteOne();

    return NextResponse.json({ message: 'Trade deleted successfully' });
  } catch (error) {
    console.error('Delete trade error:', error);
    return NextResponse.json({ message: 'Error deleting trade' }, { status: 500 });
  }
}