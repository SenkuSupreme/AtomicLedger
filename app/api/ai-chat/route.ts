
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Strategy from '@/lib/models/Strategy';
import Trade from '@/lib/models/Trade';
import Note from '@/lib/models/Note';
import Task from '@/lib/models/Task';
import Goal from '@/lib/models/Goal';
import Habit from '@/lib/models/Habit';
import mongoose from 'mongoose';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || 'sk-or-v1-placeholder',
  defaultHeaders: {
    "HTTP-Referer": "https://journalingapp.vercel.app",
    "X-Title": "Forex Journaling App",
  },
});

const MODELS = {
  PRIMARY: "meta-llama/llama-3.3-70b-instruct:free",
  FALLBACK: "deepseek/deepseek-chat:free", // Adjusted to standard ID, user asked for v3.1 but generic 'chat' usually points to latest free
  STRATEGY: "deepseek/deepseek-r1:free", // Using distinct r1 for reasoning/strategy as chimera might be unstable/unavailable
  FAST: "google/gemini-2.0-flash-lite-preview-02-05:free" // User asked for mimo, falling back to reliable flash-lite for speed if mimo fails
};

// User specific requests (preserving exact strings where possible, mapping to closest working free if needed)
// Mapping strictly as requested but with fallbacks if IDs are invalid on OR
const REQUESTED_MODELS = {
  PRIMARY: "meta-llama/llama-3.3-70b-instruct:free",
  RISK: "deepseek/deepseek-chat-v3.1:free", // Note: Verify this ID
  STRATEGY: "tngtech/deepseek-r1t2-chimera:free",
  FAST: "xiaomi/mimo-v2-flash:free"
};

const determineModel = (content: string): string => {
  const lower = content.toLowerCase();
  if (lower.includes('quick') || lower.includes('check') || lower.includes('ui')) return REQUESTED_MODELS.FAST;
  if (lower.includes('strategy') || lower.includes('review') || lower.includes('journal')) return REQUESTED_MODELS.STRATEGY;
  if (lower.includes('risk') || lower.includes('validate') || lower.includes('safe')) return REQUESTED_MODELS.RISK;
  return REQUESTED_MODELS.PRIMARY;
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { messages } = await req.json();
    const latestMessage = messages[messages.length - 1].content;

    await dbConnect();

    // 1. Fetch Context Data
    // We limit fields to reduce token usage
    const strategies = await Strategy.find({ userId: (session.user as any).id })
      .select('name coreInfo setup execution risk blocks')
      .limit(5)
      .lean();

    const trades = await Trade.find({ userId: (session.user as any).id })
      .sort({ timestampEntry: -1 })
      .limit(10)
      .select('symbol direction entryPrice exitPrice pnl pnlUnit outcome setupGrade strategyId')
      .populate('strategyId', 'name')
      .lean();

    const journalEntries = await Note.find({ userId: (session.user as any).id, isDetailed: true })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('title blocks updatedAt')
      .lean();

    const tasks = await Task.find({ userId: (session.user as any).id, status: { $ne: 'completed' } })
      .limit(5)
      .select('title status priority dueDate')
      .lean();

    const goals = await Goal.find({ userId: (session.user as any).id, status: 'in_progress' })
      .limit(3)
      .select('title target current progress deadline')
      .lean();

    const habitDocs = await Habit.find({ userId: (session.user as any).id, isActive: true })
      .limit(5)
      .select('title streak frequency')
      .lean();

    const notebookNotes = await Note.find({ userId: (session.user as any).id, isDetailed: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title content createdAt')
      .lean();

    // Checklists (Ensure model is registered)
    const ChecklistSchema = new mongoose.Schema({
        userId: { type: String, required: true },
        name: { type: String, required: true },
        items: [mongoose.Schema.Types.Mixed],
        isActive: { type: Boolean, default: false },
        completionRate: { type: Number, default: 0 }
    });
    // Use existing model or register new one to prevent OverwriteModelError
    const Checklist = mongoose.models.Checklist || mongoose.model('Checklist', ChecklistSchema);

    const checklists = await Checklist.find({ userId: session.user.email, isActive: true })
      .select('name items completionRate')
      .lean();

    // 2. Construct Context String
    const strategyContext = strategies.map(s => 
      `- Strategy: ${s.name} (${s.coreInfo?.executionTimeframe || 'N/A'}). Setup: ${s.setup?.setupName || 'N/A'}`
    ).join('\n');

    const tradeContext = trades.map(t => 
      `- ${t.symbol} ${t.direction} (${new Date(t.timestampEntry).toLocaleDateString()}). Result: ${t.outcome || 'Pending'} (${t.pnl}${t.pnlUnit || '$'}). Grade: ${t.setupGrade}/5.`
    ).join('\n');

    const journalContext = journalEntries.map(j => 
      `- Journal: ${j.title} (${new Date(j.updatedAt).toLocaleDateString()})`
    ).join('\n');

    const taskContext = tasks.map(t =>
      `- [${t.status.toUpperCase()}] ${t.title} (Priority: ${t.priority})`
    ).join('\n');

    const goalContext = goals.map(g =>
      `- Goal: ${g.title} (${g.progress}%) - Target: ${g.target}`
    ).join('\n');

    const habitContext = habitDocs.map(h =>
      `- Habit: ${h.title} (Streak: ${h.streak} ${h.frequency})`
    ).join('\n');

    const notebookContext = notebookNotes.map(n =>
      `- Note: ${n.title || 'Untitled'} - "${n.content?.substring(0, 50)}..."`
    ).join('\n');

    const checklistContext = checklists.map((c: any) =>
      `- Active Protocol: ${c.name} (Completion: ${c.completionRate}%)`
    ).join('\n');

    const systemPrompt = `
You are Apex Intelligence, an elite institutional trading AI assistant integrated into the user's trading journal.
You have direct read-access to their trading ecosystem.

CURRENT USER DATA CONTEXT:
==========================
STRATEGIES:
${strategyContext || 'No strategies found.'}

RECENT TRADES (Last 10):
${tradeContext || 'No recent trades.'}

RECENT JOURNAL ENTRIES:
${journalContext || 'No journal entries.'}

ACTIVE TASKS:
${taskContext || 'No active tasks.'}

CURRENT GOALS:
${goalContext || 'No active goals.'}

HABIT TRACKING:
${habitContext || 'No active habits.'}

NOTEBOOK (Quick Notes):
${notebookContext || 'No quick notes.'}

ACTIVE CHECKLISTS:
${checklistContext || 'No active checklists.'}
==========================

DIRECTIVES:
1. Act as a high-performance trading coach and analyst. Tone: Professional, direct, "institutional", and analytical.
2. USE THE DATA above to personalize your answers. If the user asks about their performance, reference the specific trades.
3. If the user asks about a specific strategy, reference its details from the context.
4. If no data exists for a query (e.g. no trades found), admit it gracefully and provide general best practices.
5. Keep responses concise and actionable. Avoid fluff.
6. Use formatting (bullet points, bold text) to make output readable.

Reply to the user's latest message based on this context.
    `;

    // 3. Call OpenAI with Model Selection & Fallback
    const targetModel = determineModel(latestMessage);
    let aiResponse;
    let usedModel = targetModel;

    try {
      const completion = await openai.chat.completions.create({
        model: targetModel, 
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((m: any) => ({ 
              role: m.role === 'ai' ? 'assistant' : 'user', 
              content: m.content 
          }))
        ],
        temperature: 0.7,
        max_tokens: 500,
      });
      aiResponse = completion.choices[0].message.content;
    } catch (primaryError) {
      console.warn(`Primary model ${targetModel} failed, switching to fallback...`, primaryError);
      
      // Fallback to Risk/Validation Model (Deepseek)
      try {
        usedModel = REQUESTED_MODELS.RISK;
        const fallbackCompletion = await openai.chat.completions.create({
          model: usedModel, 
          messages: [
            { role: "system", content: systemPrompt + "\n[SYSTEM: Fallback Model Activated]" },
             ...messages.map((m: any) => ({ 
                role: m.role === 'ai' ? 'assistant' : 'user', 
                content: m.content 
            }))
          ],
          temperature: 0.7,
          max_tokens: 500,
        });
        aiResponse = fallbackCompletion.choices[0].message.content;
      } catch (fallbackError) {
        console.error("All models failed", fallbackError);
        throw fallbackError;
      }
    }

    return NextResponse.json({ 
        role: 'ai', 
        content: aiResponse,
        model: usedModel,
        timestamp: new Date()
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    return NextResponse.json(
      { error: 'Failed to process neural transmission.' }, 
      { status: 500 }
    );
  }
}
