import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import CustomTradeOption from '@/lib/models/CustomTradeOption';

// GET - Fetch all custom options for the current user
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const fieldName = searchParams.get('fieldName');

    const query: any = { userId };
    if (fieldName) {
      query.fieldName = fieldName;
    }

    const options = await CustomTradeOption.find(query).sort({ createdAt: -1 });

    // Group by fieldName for easier consumption
    const grouped: Record<string, string[]> = {};
    options.forEach(opt => {
      if (!grouped[opt.fieldName]) {
        grouped[opt.fieldName] = [];
      }
      grouped[opt.fieldName].push(opt.value);
    });

    return NextResponse.json({ options: grouped });
  } catch (error) {
    console.error('Error fetching custom trade options:', error);
    return NextResponse.json({ error: 'Failed to fetch custom options' }, { status: 500 });
  }
}

// POST - Add a new custom option
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { fieldName, value } = await req.json();

    if (!fieldName || !value) {
      return NextResponse.json({ error: 'fieldName and value are required' }, { status: 400 });
    }

    // Check if already exists
    const existing = await CustomTradeOption.findOne({
      userId,
      fieldName,
      value
    });

    if (existing) {
      return NextResponse.json({ message: 'Option already exists', option: existing });
    }

    const option = await CustomTradeOption.create({
      userId,
      fieldName,
      value
    });

    return NextResponse.json({ message: 'Option created', option }, { status: 201 });
  } catch (error: any) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json({ message: 'Option already exists' }, { status: 200 });
    }
    console.error('Error creating custom trade option:', error);
    return NextResponse.json({ error: 'Failed to create custom option' }, { status: 500 });
  }
}

// DELETE - Remove a custom option
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const fieldName = searchParams.get('fieldName');
    const value = searchParams.get('value');

    if (!fieldName || !value) {
      return NextResponse.json({ error: 'fieldName and value are required' }, { status: 400 });
    }

    await CustomTradeOption.deleteOne({
      userId,
      fieldName,
      value
    });

    return NextResponse.json({ message: 'Option deleted' });
  } catch (error) {
    console.error('Error deleting custom trade option:', error);
    return NextResponse.json({ error: 'Failed to delete custom option' }, { status: 500 });
  }
}
