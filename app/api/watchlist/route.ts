import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Watchlist from '@/lib/models/Watchlist';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await dbConnect();
    // @ts-ignore
    const watchlist = await Watchlist.find({ userId: session.user.id }).sort({ createdAt: -1 });

    return NextResponse.json(watchlist);
  } catch (error) {
    console.error('[WATCHLIST_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { symbol, type } = await req.json();

    if (!symbol || !type) {
      return new NextResponse('Missing fields', { status: 400 });
    }

    await dbConnect();

    // Check if limits reached?? Maybe later.

    const watchlistItem = await Watchlist.create({
      // @ts-ignore
      userId: session.user.id,
      symbol,
      type
    });

    return NextResponse.json(watchlistItem);
  } catch (error: any) {
    if (error.code === 11000) {
      return new NextResponse('Already in watchlist', { status: 409 });
    }
    console.error('[WATCHLIST_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const symbol = searchParams.get('symbol');

    await dbConnect();

    if (id) {
       // @ts-ignore
      await Watchlist.findOneAndDelete({ _id: id, userId: session.user.id });
    } else if (symbol) {
       // @ts-ignore
      await Watchlist.findOneAndDelete({ symbol, userId: session.user.id });
    } else {
        return new NextResponse('Missing id or symbol', { status: 400 });
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('[WATCHLIST_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
