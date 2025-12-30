import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import Trade from '@/lib/models/Trade';
import Portfolio from '@/lib/models/Portfolio';
import Strategy from '@/lib/models/Strategy';
import Backtest from '@/lib/models/Backtest';
import Note from '@/lib/models/Note';
import Tag from '@/lib/models/Tag';
import Goal from '@/lib/models/Goal';
import Habit from '@/lib/models/Habit';
import Task from '@/lib/models/Task';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { password } = await req.json();
  if (!password) {
    return NextResponse.json({ message: 'Password is required' }, { status: 400 });
  }

  await dbConnect();

  try {
    // @ts-ignore
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Verify password before deletion
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Incorrect password' }, { status: 400 });
    }

    // @ts-ignore
    const userId = session.user.id;

    // Perform cascade deletion
    await Promise.all([
      Trade.deleteMany({ userId }),
      Portfolio.deleteMany({ userId }),
      Strategy.deleteMany({ userId }),
      Backtest.deleteMany({ userId }),
      Note.deleteMany({ userId }),
      Tag.deleteMany({ userId }),
      Goal.deleteMany({ userId }),
      Habit.deleteMany({ userId }),
      Task.deleteMany({ userId }),
      User.findByIdAndDelete(userId),
    ]);

    return NextResponse.json({ message: 'Account and all related data deleted successfully' });
  } catch (error: any) {
    console.error('Account deletion error:', error);
    return NextResponse.json({ message: error.message || 'Failed to delete account' }, { status: 500 });
  }
}
