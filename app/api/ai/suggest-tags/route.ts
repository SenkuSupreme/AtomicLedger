
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { queryAI, PROMPTS } from '@/lib/ai';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { notes } = await req.json();
    if (!notes) {
      return NextResponse.json({ message: 'Notes are required' }, { status: 400 });
    }

    const prompt = PROMPTS.SUGGEST_TAGS(notes);
    const response = await queryAI(prompt);

    if (!response) {
      return NextResponse.json({ tags: [] }); // AI failed or disabled
    }

    // Try to parse JSON array from response
    let tags = [];
    try {
      // Basic cleanup if AI returns formatted code block
      const cleanJson = response.replace(/```json/g, '').replace(/```/g, '').trim();
      const rawTags = JSON.parse(cleanJson);
      
      // Backward compatibility: handle if AI returns string array by mistake
      tags = rawTags.map((t: any) => typeof t === 'string' ? { tag: t, confidence: 0.8 } : t);
    } catch (e) {
      console.error('Failed to parse AI response', response);
      tags = [];
    }

    return NextResponse.json({ tags });
  } catch (error) {
    console.error('AI Suggest Tags Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
