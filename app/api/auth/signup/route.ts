import { NextResponse } from 'next/server';

import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import { sendEmail } from '@/lib/email';


export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      email,
      name,
      password: hashedPassword,
    });

    try {
      await sendEmail({
        to: email,
        subject: 'Welcome to ApexLedger',
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h1>Welcome to ApexLedger, ${name}!</h1>
            <p>We're excited to help you master your trading psychology.</p>
            <p>Start by logging your first trade in the Journal.</p>
            <br/>
            <a href="${process.env.NEXTAUTH_URL}/dashboard" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Dashboard</a>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the signup just because email failed
    }

    return NextResponse.json({ message: 'User created' }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
