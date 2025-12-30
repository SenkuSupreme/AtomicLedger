import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  // @ts-ignore
  const userId = session.user.id;
  const user = await User.findById(userId).select('-password');
  
  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { username, image, name } = await req.json();
  // @ts-ignore
  const userId = session.user.id;
  console.log(`PATCH /api/profile: User ${userId} attempting to update profile with data:`, { username, image, name });

  await dbConnect();

  try {
    // Check if username is already taken by another user
    if (username) {
      const existingUser = await User.findOne({ 
        username, 
        // Explicitly cast userId to ObjectId for comparison
        _id: { $ne: new mongoose.Types.ObjectId(userId) } 
      });
      if (existingUser) {
        console.warn(`PATCH /api/profile: Username '${username}' already taken by another user.`);
        return NextResponse.json({ message: 'Username already taken' }, { status: 400 });
      }
    }

    const user = await User.findById(userId);

    if (!user) {
      console.error(`PATCH /api/profile: User not found for userId: ${userId} during update.`);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const updates: any = { image, name };

    // Enforce 14-day rule for username changes
    if (username && username !== user.username) {
      if (user.lastUsernameChange) {
        const fourteenDays = 14 * 24 * 60 * 60 * 1000;
        const timeSinceLastChange = Date.now() - new Date(user.lastUsernameChange).getTime();
        
        if (timeSinceLastChange < fourteenDays) {
          const daysLeft = Math.ceil((fourteenDays - timeSinceLastChange) / (24 * 60 * 60 * 1000));
          return NextResponse.json({ 
            message: `Terminal handle is locked. You can change it in ${daysLeft} days.` 
          }, { status: 403 });
        }
      }
      updates.username = username;
      updates.lastUsernameChange = new Date();
    }

    // Direct update with explicit verification of the return
    const updatedRecord = await User.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(userId) },
      { $set: updates },
      { new: true, runValidators: true }
    ).select('username name image email lastUsernameChange').lean();

    if (!updatedRecord) {
      console.error(`PATCH /api/profile: Identity document recovery failed for ID: ${userId}`);
      return NextResponse.json({ message: 'Identity recovery failed' }, { status: 500 });
    }

    return NextResponse.json(updatedRecord);
  } catch (error: any) {
    console.error("Profile Update Handshake Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
