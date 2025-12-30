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

  const { id: postId } = await params;
  // @ts-ignore
  const userId = session.user.id;

  try {
    await dbConnect();
    
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    const hasLiked = post.likes.includes(userId);
    
    if (hasLiked) {
      // Unlike
      post.likes = post.likes.filter((id: any) => id.toString() !== userId);
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();
    return NextResponse.json({ likes: post.likes });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
