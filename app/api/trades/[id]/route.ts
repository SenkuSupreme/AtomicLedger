
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Trade from '@/lib/models/Trade';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  await dbConnect();
  
  // @ts-ignore
  const trade = await Trade.findOne({ _id: id, userId: session.user.id });
  
  if (!trade) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  
  return NextResponse.json(trade);
}
