
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
    const { asset, timeframe, priceHistory } = await req.json();
    if (!asset || !priceHistory) {
      return NextResponse.json({ message: 'Asset and Price History are required' }, { status: 400 });
    }

    const prompt = PROMPTS.SUGGEST_ENTRY_EXIT(asset, timeframe || 'Daily', priceHistory);
    const aiResponseStr = await queryAI(prompt);
    
    let aiData = { entry: "N/A", exit: "N/A", rationale: "AI Analysis unavailable." };
    if (aiResponseStr) {
        try {
            const cleanStr = aiResponseStr.replace(/```json\n|\n```/g, "").trim();
            aiData = JSON.parse(cleanStr);
        } catch (e) {
            console.error("Failed to parse AI JSON", e);
        }
    }

    return NextResponse.json(aiData);
  } catch (error) {
    console.error('Error suggesting entry/exit:', error);
    return NextResponse.json({ message: 'Failed to suggest entry/exit' }, { status: 500 });
  }
}
