
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Trade from '@/lib/models/Trade';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const sort = searchParams.get('sort') || 'timestampEntry'; // default sort field
  const order = searchParams.get('order') === 'ask' ? 1 : -1; // default desc
  const symbol = searchParams.get('symbol');
  const status = searchParams.get('status'); // 'win' or 'loss'
  const portfolioId = searchParams.get('portfolioId');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  // Build Filter
  const filter: any = { 
      // @ts-ignore
      userId: session.user.id,
      inBacktest: type === 'backtest' ? true : { $ne: true } 
  };
  
  if (symbol) {
      filter.symbol = { $regex: symbol, $options: 'i' };
  }

  if (status === 'win') {
      filter.pnl = { $gt: 0 };
  } else if (status === 'loss') {
      filter.pnl = { $lt: 0 };
  }

  if (portfolioId && portfolioId !== 'all') {
      filter.portfolioId = portfolioId;
  }

  if (startDate && endDate) {
      filter.timestampEntry = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
      };
  }

  // Calculate Skip
  const skip = (page - 1) * limit;

  await dbConnect();
  
  // Fetch Trades with Pagination
  const trades = await Trade.find(filter)
    .sort({ [sort]: order })
    .skip(skip)
    .limit(limit)
    .lean();
    
  // Get Total Count for Pagination UI
  const total = await Trade.countDocuments(filter);
  
  return NextResponse.json({
      trades,
      pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
      }
  });

}


export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    await dbConnect();

    // Handle stringified tags in case it comes from input as string
    let tags = body.tags;
    if (typeof tags === 'string') {
        tags = tags.split(',').map((t: string) => t.trim()).filter((t: string) => t);
    }

    const trade = await Trade.create({
      ...body,
      tags,
      // @ts-ignore
      userId: session.user.id,
    });

    return NextResponse.json(trade, { status: 201 });
  } catch (error) {
    console.error('Create trade error:', error);
    return NextResponse.json({ message: 'Error creating trade' }, { status: 500 });
  }
}
