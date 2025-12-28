
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PROMPTS, queryAI } from '@/lib/ai';
import dbConnect from '@/lib/db';
import Strategy from '@/lib/models/Strategy';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { strategyId, metrics } = await req.json();
    if (!strategyId || !metrics) {
      return NextResponse.json({ message: 'Strategy ID and metrics are required' }, { status: 400 });
    }

    // Convert metrics object to readable string
    const metricsStr = JSON.stringify(metrics);

    const prompt = PROMPTS.EVALUATE_STRATEGY(metricsStr);
    const aiResponseStr = await queryAI(prompt);
    
    let aiData = { score: 0, analysis: "AI analysis unavailable." };
    if (aiResponseStr) {
        try {
            const cleanStr = aiResponseStr.replace(/```json\n|\n```/g, "").trim();
            aiData = JSON.parse(cleanStr);
        } catch (e) {
            console.error("Failed to parse AI JSON", e);
        }
    }

    // Save report to Strategy model
    await dbConnect();
    await Strategy.findByIdAndUpdate(strategyId, { aiReport: aiData });

    return NextResponse.json(aiData);
  } catch (error) {
    console.error('Error evaluating strategy:', error);
    return NextResponse.json({ message: 'Failed to evaluate strategy' }, { status: 500 });
  }
}
