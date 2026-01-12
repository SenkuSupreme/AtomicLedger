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
import { neuralCompletion, FALLBACK_MODELS } from '@/lib/ai';

const REQUESTED_MODELS = {
  PRIMARY: "meta-llama/llama-3.3-70b-instruct:free",
  RISK: "deepseek/deepseek-chat:free", 
  STRATEGY: "deepseek/deepseek-r1:free",
  FAST: "google/gemini-2.0-flash-exp:free"
};

const determineModel = (content: string): string => {
  const lower = content.toLowerCase();
  if (lower.includes('quick') || lower.includes('check') || lower.includes('ui') || lower.includes('task')) return REQUESTED_MODELS.FAST;
  if (lower.includes('strategy') || lower.includes('review') || lower.includes('journal') || lower.includes('analysis')) return REQUESTED_MODELS.STRATEGY;
  if (lower.includes('risk') || lower.includes('validate') || lower.includes('safe') || lower.includes('stop')) return REQUESTED_MODELS.RISK;
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
    const searchTerms = latestMessage.split(' ')
      .filter((word: string) => word.length > 3 && !['what', 'when', 'where', 'which', 'who', 'show', 'tell', 'about'].includes(word.toLowerCase()))
      .map((word: string) => word.replace(/[^a-zA-Z0-9]/g, ''));
    
    const searchRegex = searchTerms.length > 0 ? new RegExp(searchTerms.join('|'), 'i') : null;

    // -- Strategies --
    const relevantStrategies = searchRegex ? await Strategy.find({
      userId: (session.user as any).id,
      $or: [
        { name: { $regex: searchRegex } },
        { 'setup.setupName': { $regex: searchRegex } },
        { 'blocks.content': { $regex: searchRegex } }
      ]
    })
    .limit(3)
    .select('name coreInfo setup execution risk blocks additionals')
    .lean() : [];

    const recentStrategies = await Strategy.find({ userId: (session.user as any).id })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('name coreInfo setup execution risk blocks additionals')
      .lean();

    const strategiesMap = new Map();
    [...relevantStrategies, ...recentStrategies].forEach((s: any) => strategiesMap.set(s._id.toString(), s));
    const strategies = Array.from(strategiesMap.values());

    // -- Trades --
    const trades = await Trade.find({ userId: (session.user as any).id })
      .sort({ timestampEntry: -1 })
      .limit(10)
      .select('symbol direction entryPrice exitPrice pnl pnlUnit outcome setupGrade strategyId')
      .populate('strategyId', 'name')
      .lean();

    // -- Journal Entries --
    const relevantJournalEntries = searchRegex ? await Note.find({ 
      userId: (session.user as any).id, 
      isDetailed: true,
      $or: [
        { title: { $regex: searchRegex } },
        { 'blocks.content': { $regex: searchRegex } }
      ]
    })
    .sort({ updatedAt: -1 })
    .limit(5)
    .select('title blocks updatedAt')
    .lean() : [];

    const recentJournalEntries = await Note.find({ userId: (session.user as any).id, isDetailed: true })
      .sort({ updatedAt: -1 })
      .limit(10)
      .select('title blocks updatedAt')
      .lean();

    const journalEntriesMap = new Map();
    [...relevantJournalEntries, ...recentJournalEntries].forEach((entry: any) => {
      journalEntriesMap.set(entry._id.toString(), entry);
    });
    const journalEntries = Array.from(journalEntriesMap.values());

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

    const ChecklistSchema = new mongoose.Schema({
        userId: { type: String, required: true },
        name: { type: String, required: true },
        items: [mongoose.Schema.Types.Mixed],
        isActive: { type: Boolean, default: false },
        completionRate: { type: Number, default: 0 }
    });
    const Checklist = mongoose.models.Checklist || mongoose.model('Checklist', ChecklistSchema);

    const checklists = await Checklist.find({ userId: session.user.email, isActive: true })
      .select('name items completionRate')
      .lean();

    // 2. Construct Context String
    const strategyContext = strategies.map(s => {
      const contentPreview = s.blocks && Array.isArray(s.blocks) 
        ? s.blocks.map((b: any) => b.content || '').join(' ').substring(0, 500) 
        : '';
      const additionalNotes = s.additionals?.notes ? `\n  Notes: ${s.additionals.notes.substring(0, 300)}` : '';
      
      return `- Strategy: ${s.name}
  Timeframe: ${s.coreInfo?.executionTimeframe || 'N/A'}
  Setup: ${s.setup?.setupName || 'N/A'}
  Entry: ${s.setup?.entrySignal || 'N/A'}
  Risk: ${s.risk?.riskStrategy || 'N/A'}
  Content: ${contentPreview}...${additionalNotes}`;
    }).join('\n\n');

    const tradeContext = trades.map(t => 
      `- ${t.symbol} ${t.direction} (${new Date(t.timestampEntry).toLocaleDateString()}). Result: ${t.outcome || 'Pending'} (${t.pnl}${t.pnlUnit || '$'}). Grade: ${t.setupGrade}/5.`
    ).join('\n');

    const journalContext = journalEntries.map(j => {
      const contentPreview = j.blocks && Array.isArray(j.blocks) 
        ? j.blocks.map((b: any) => {
            if (b.type === 'image') return '[Image]';
            if (b.type === 'todo') return `[ ] ${b.content}`;
             if (['h1', 'h2', 'h3'].includes(b.type)) return `\n# ${b.content}\n`;
            return b.content || '';
          }).join('\n').substring(0, 5000) 
        : 'No content';
      return `- Journal: ${j.title} (${new Date(j.updatedAt).toLocaleDateString()})\n  Content:\n${contentPreview}...`;
    }).join('\n\n');

    const taskContext = tasks.map(t => `- [${t.status.toUpperCase()}] ${t.title} (Priority: ${t.priority})`).join('\n');
    const goalContext = goals.map(g => `- Goal: ${g.title} (${g.progress}%) - Target: ${g.target}`).join('\n');
    const habitContext = habitDocs.map(h => `- Habit: ${h.title} (Streak: ${h.streak} ${h.frequency})`).join('\n');
    const notebookContext = notebookNotes.map(n => `- Note: ${n.title || 'Untitled'} - "${n.content?.substring(0, 1000)}..."`).join('\n');
    const checklistContext = checklists.map((c: any) => `- Active Protocol: ${c.name} (Completion: ${c.completionRate}%)`).join('\n');

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
2. USE THE DATA above to personalize your answers.
3. Keep responses concise and actionable.
4. Use formatting (bullet points, bold text).
`;

    // 3. Call Neural Nexus with Model Selection & Resilient Fallback
    const targetModel = determineModel(latestMessage);
    
    try {
      const { content: aiResponse, model: usedModel } = await neuralCompletion({
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((m: any) => ({ 
              role: m.role === 'ai' ? 'assistant' : 'user', 
              content: m.content 
          }))
        ],
        model: targetModel,
        temperature: 0.7,
        max_tokens: 1000,
      });

      return NextResponse.json({ 
          role: 'ai', 
          content: aiResponse,
          model: usedModel,
          timestamp: new Date()
      });
    } catch (nexusError) {
      console.error('Neural Nexus Blackout:', nexusError);
      return NextResponse.json(
        { error: 'Neural nexus encountered a blackout. No operational nodes available.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('AI Chat Error:', error);
    return NextResponse.json(
      { error: 'Failed to process neural transmission.' }, 
      { status: 500 }
    );
  }
}
