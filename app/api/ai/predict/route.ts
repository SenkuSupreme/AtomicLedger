
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PROMPTS, queryAI } from '@/lib/ai';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { context } = await req.json();
    if (!context || context.trim().length < 3) {
      return NextResponse.json({ completion: '' });
    }

    const prompt = PROMPTS.PREDICT_CONTENT(context);
    const completion = await queryAI(prompt, 'openai/gpt-3.5-turbo');
    
    return NextResponse.json({ completion: completion?.trim() || '' });
  } catch (error) {
    console.error('Prediction error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
