
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
    const { trades } = await req.json();
    if (!trades || !Array.isArray(trades)) {
      return NextResponse.json({ message: 'Trades array is required' }, { status: 400 });
    }

    // Limit to last 20 trades to avoid token limits
    const tradeSummary = JSON.stringify(trades.slice(0, 20).map((t: any) => ({
        symbol: t.symbol,
        pnl: t.pnl,
        direction: t.direction,
        notes: t.notes
    })));

    const prompt = PROMPTS.ANALYZE_PATTERNS(tradeSummary);
    const aiResponseStr = await queryAI(prompt);
    
    let aiData = { patterns: [], issues: [], fixes: [] };
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
    console.error('Error analyzing patterns:', error);
    return NextResponse.json({ message: 'Failed to analyze patterns' }, { status: 500 });
  }
}
