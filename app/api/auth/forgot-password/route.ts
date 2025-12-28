
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

import User from '@/lib/models/User';
import crypto from 'crypto';
import { sendEmail } from '@/lib/email';


export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      // Return 200 even if user not found to prevent enumeration
      return NextResponse.json({ message: 'If that email exists, a reset link has been sent.' });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');


    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password/${token}`;
    
    await sendEmail({
      to: email,
      subject: 'Reset your ApexLedger Password',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h1>Password Reset Request</h1>
          <p>You requested a password reset for your ApexLedger account.</p>
          <p>Click the link below to set a new password:</p>
          <br/>
          <a href="${resetUrl}" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <br/><br/>
          <p>If you didn't request this, you can ignore this email.</p>
          <p>Link expires in 1 hour.</p>
        </div>
      `
    });

    return NextResponse.json({ message: 'If that email exists, a reset link has been sent.' });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
