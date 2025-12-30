import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Post from '@/lib/models/Post';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id: postId, commentId } = await params;
    const { text } = await req.json();
    
    if (!text) {
      return NextResponse.json({ message: 'Text required' }, { status: 400 });
    }

    await dbConnect();
    // @ts-ignore
    const userId = session.user.id;
    
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return NextResponse.json({ message: 'Comment not found' }, { status: 404 });
    }

    if (comment.userId.toString() !== userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    comment.text = text;
    await post.save();

    const updatedPost = await Post.findById(postId)
      .populate('userId', 'username name image')
      .populate('comments.userId', 'username name image');

    return NextResponse.json(updatedPost);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id: postId, commentId } = await params;
    await dbConnect();
    // @ts-ignore
    const userId = session.user.id;
    
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return NextResponse.json({ message: 'Comment not found' }, { status: 404 });
    }

    if (comment.userId.toString() !== userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    post.comments.pull(commentId);
    await post.save();

    const updatedPost = await Post.findById(postId)
      .populate('userId', 'username name image')
      .populate('comments.userId', 'username name image');

    return NextResponse.json(updatedPost);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
