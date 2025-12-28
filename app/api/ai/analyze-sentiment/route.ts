
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
    const { note } = await req.json();
    if (!note) {
      return NextResponse.json({ message: 'Note is required' }, { status: 400 });
    }

    const prompt = PROMPTS.ANALYZE_SENTIMENT(note);
    const aiResponseStr = await queryAI(prompt);
    
    // Parse JSON response safely
    let aiData = { sentiment: 'neutral', keywords: [] };
    if (aiResponseStr) {
        try {
            // Attempt to clean markdown code blocks if present
            const cleanStr = aiResponseStr.replace(/```json\n|\n```/g, "").trim();
            aiData = JSON.parse(cleanStr);
        } catch (e) {
            console.error("Failed to parse AI JSON", e);
        }
    }

    return NextResponse.json(aiData);
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return NextResponse.json({ message: 'Failed to analyze sentiment' }, { status: 500 });
  }
}
