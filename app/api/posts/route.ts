import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Post from '@/lib/models/Post';
import User from '@/lib/models/User';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Fetch posts with user details populated
    // Note: We're using .populate() which is standard Mongoose
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('userId', 'username name image')
      .populate('comments.userId', 'username name image');

    return NextResponse.json(posts);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { content, type, tradeId } = await req.json();
    
    if (!content) {
      return NextResponse.json({ message: 'Content is required' }, { status: 400 });
    }

    await dbConnect();
    
    // @ts-ignore
    const userId = session.user.id;
    
    const newPost = await Post.create({
      userId,
      content,
      type: type || 'text',
      tradeId: tradeId || null,
    });

    const populatedPost = await Post.findById(newPost._id).populate('userId', 'username name image');

    return NextResponse.json(populatedPost);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
