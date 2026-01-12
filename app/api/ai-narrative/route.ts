
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import dbConnect from '@/lib/db';
import Forecast from '@/lib/models/Forecast';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

import { neuralCompletion, FALLBACK_MODELS } from '@/lib/ai';

interface MarketContext {
  symbol: string;
  currentPrice: number;
  methodology: string;
  bias: string;
  timeframeContext: string;
  orderBlockHigh?: number;
  orderBlockLow?: number;
  fvgHigh?: number;
  fvgLow?: number;
  liquiditySweep?: { type: string; level: number };
  entryPrice: number;
  stopLoss: number;
  tp1: number;
  tp2: number;
  killZoneActive?: boolean;
  session?: string;
  confluenceScore?: number;
  htfTrend?: string;
  ltfTrend?: string;
  methodologyConfluences?: {
    SMC: string;
    ICT: string;
    ORB: string;
    CRT: string;
  };
}

export async function POST(req: Request) {
  try {
    const context: MarketContext = await req.json();

    const systemPrompt = `
You are an elite institutional trading "Neural Narrative Processor". Your role is to produce deep-dive, forensic-grade structured execution protocols. 

Operating Principle: Behave as a senior fund manager reviewing a high-conviction setup for a multi-million dollar desk. Focus on directional integrity, liquidity engineering, and multi-methodology confluence.

STRUCTURE REQUIREMENTS:
1. **Title**: Methodology name + execution protocol (e.g., SMC Sweep & Reverse Protocol Execution Protocol).
2. **Market Context & Institutional Narrative**: A deep-dive paragraph (8-12 sentences) explaining the high-level institutional mechanics, "Power of 3" (AMD), liquidity engineering, and current delivery state. You MUST explain how the primary methodology (${context.methodology}) is cross-validated by the other provided methodology confluences. Reference the SPECIFIC price levels provided.
3. **Validation Logic**: A granular technical breakdown explaining exactly WHY the entry signal was generated. Reference specific price levels (Order Blocks, FVGs, Sweeps). Use technical reasoning (e.g., "Price accepting value above the 15M opening range confirmed institutional acceptance...").
4. **Tactical Profile**:
   - **Target Objective**: Specific targets (TP1, TP2) with institutional justification (e.g., "Opposing BSL at X level", "HTF Discount FVG at Y level").
   - **Invalidation Profile**: Specific high/low levels and the forensic logic for why the setup fails (e.g., "Structural breach of the anchor candle low at X level signals a loss of institutional sponsorship").
   - **Controlling Timeframes**: Detailed HTF Bias vs LTF Execution alignment.
   - **Convergence Index**: A percentage based on the provided confluence score.
5. **Algorithmic Confidence**: Final forensic note on the integrity of the neural engine's validation.

STYLE:
- Professional, clinical, and institutional.
- Reference SPECIFIC price levels for every section.
- Use Markdown formatting (headers, bolding, lists).
- Minimal fluff, maximum technical precision.
- Do NOT repeat the input labels. Integrate the data into flowing analysis.
`;

    const userPrompt = `
Generate a forensic institutional protocol for the following setup:

SYMBOL: ${context.symbol}
CURRENT PRICE: ${context.currentPrice}
METHODOLOGY: ${context.methodology}
DIRECTIONAL BIAS: ${context.bias}

KEY TECHNICAL DATA:
- Order Block Zone: ${context.orderBlockLow ? `${context.orderBlockLow} - ${context.orderBlockHigh}` : 'Not identified'}
- Fair Value Gap: ${context.fvgLow ? `${context.fvgLow} - ${context.fvgHigh}` : 'Not identified'}
- Liquidity Sweep: ${context.liquiditySweep ? `${context.liquiditySweep.type} at ${context.liquiditySweep.level}` : 'Pending'}

CROSS-METHODOLOGY CONFLUENCE:
- SMC Data: ${context.methodologyConfluences?.SMC || 'N/A'}
- ICT Data: ${context.methodologyConfluences?.ICT || 'N/A'}
- ORB Data: ${context.methodologyConfluences?.ORB || 'N/A'}
- CRT Data: ${context.methodologyConfluences?.CRT || 'N/A'}

EXECUTION PARAMETERS:
- Entry Price Point: ${context.entryPrice}
- Stop Loss Alpha: ${context.stopLoss}
- Exit Target 1: ${context.tp1}
- Exit Target 2: ${context.tp2}

CONFLUENCE TELEMETRY:
- HTF Trend: ${context.htfTrend || 'N/A'}
- LTF Trend: ${context.ltfTrend || 'N/A'}
- Kill Zone Active: ${context.killZoneActive ? 'Yes' : 'No'}
- Active Session: ${context.session || 'N/A'}
- Confluence Score: ${context.confluenceScore || 'N/A'}%
- Contextual Timeframes: ${context.timeframeContext}

Generate the forensic structured deep-dive protocol now:
`;

    // Call Neural Nexus with Resilient Fallback
    const { content: narrative, model: successModel } = await neuralCompletion({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      model: FALLBACK_MODELS[0],
      temperature: 0.75,
      max_tokens: 1000,
    });

    // --- SAVE TO DATABASE ---
    try {
      const session = await getServerSession(authOptions);
      if (session && session.user) {
        await dbConnect();
        const existing = await Forecast.findOne({ symbol: context.symbol.toUpperCase() });
        if (existing && existing.analysis && existing.analysis.smc_advanced) {
          const strategies = existing.analysis.smc_advanced.strategies;
          const strategyIdx = strategies.findIndex((s: any) => s.methodology === context.methodology);
          
          if (strategyIdx !== -1) {
            strategies[strategyIdx].explanation.narrative = narrative.trim();
            existing.markModified('analysis.smc_advanced.strategies');
            await existing.save();
          }
        }
      }
    } catch (dbError) {
      console.error('Failed to save narrative to DB:', dbError);
    }

    return NextResponse.json({ 
      narrative: narrative.trim(),
      model: successModel,
      generated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Narrative Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate neural narrative.' }, 
      { status: 500 }
    );
  }
}
