import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Post from '@/lib/models/Post';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id: postId } = await params;
    const { content } = await req.json();
    await dbConnect();
    
    // @ts-ignore
    const userId = session.user.id;
    const post = await Post.findById(postId);

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    if (post.userId.toString() !== userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    post.content = content;
    await post.save();

    return NextResponse.json(post);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id: postId } = await params;
    await dbConnect();
    // @ts-ignore
    const userId = session.user.id;
    const post = await Post.findById(postId);

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    if (post.userId.toString() !== userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await Post.findByIdAndDelete(postId);
    return NextResponse.json({ message: 'Post deleted' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
