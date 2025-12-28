
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Portfolio from '@/lib/models/Portfolio';
import Trade from '@/lib/models/Trade';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  // @ts-ignore
  const userId = session.user.id;

  const portfolios = await Portfolio.find({ userId }).sort({ createdAt: 1 });

  return NextResponse.json(portfolios);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { 
    name, 
    description, 
    accountType, 
    initialBalance, 
    currentBalance, 
    goal, 
    deposits, 
    withdrawals 
  } = await req.json();

  if (!name) {
    return NextResponse.json({ message: 'Name is required' }, { status: 400 });
  }

  await dbConnect();
  // @ts-ignore
  const userId = session.user.id;

  try {
      const portfolio = await Portfolio.create({
        userId,
        name,
        description,
        accountType,
        initialBalance: Number(initialBalance) || 0,
        currentBalance: Number(currentBalance) || 0,
        goal: Number(goal) || 0,
        deposits: Number(deposits) || 0,
        withdrawals: Number(withdrawals) || 0,
        isDefault: false,
      });

      return NextResponse.json(portfolio);
  } catch (error: any) {
      if (error.code === 11000) {
          return NextResponse.json({ message: 'Portfolio name already exists' }, { status: 400 });
      }
      return NextResponse.json({ message: 'Error creating portfolio' }, { status: 500 });
  }
}
