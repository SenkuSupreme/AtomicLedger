import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Post from '@/lib/models/Post';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id: postId } = await params;
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json({ message: 'Comment text required' }, { status: 400 });
    }

    await dbConnect();
    // @ts-ignore
    const userId = session.user.id;
    
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    post.comments.push({
      userId,
      text,
      createdAt: new Date()
    });

    await post.save();
    
    // Return the post with populated comments
    const updatedPost = await Post.findById(postId)
      .populate('userId', 'username name image')
      .populate('comments.userId', 'username name image');

    return NextResponse.json(updatedPost);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
