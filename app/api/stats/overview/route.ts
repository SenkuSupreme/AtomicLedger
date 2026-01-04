import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Strategy from '@/lib/models/Strategy';
import Trade from '@/lib/models/Trade';
import Note from '@/lib/models/Note';
import Goal from '@/lib/models/Goal';
import Task from '@/lib/models/Task';
import Habit from '@/lib/models/Habit';
import mongoose from 'mongoose';

// Ensure Checklist model is registered
const ChecklistSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, default: "" },
  strategy: { type: String, required: true },
  items: [mongoose.Schema.Types.Mixed],
  isActive: { type: Boolean, default: false },
  completionRate: { type: Number, default: 0 },
  timesUsed: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const Checklist = mongoose.models.Checklist || mongoose.model("Checklist", ChecklistSchema);

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const userId = (session.user as any).id;
    // For Checklist, userId is stored as email sometimes? In checklist route: userId: session.user.email
    // I need to check how userId is stored. In Note/Trade it is ObjectId usually.
    // In Checklist route: `items: session.user.email` ?? No, `userId: session.user.email`.
    // I should check the User model or how other models use userId.
    // In this file: `const userId = (session.user as any).id;` is used for Strategy, Trade, Note.
    // But Checklist route uses `session.user.email`. This is an inconsistency in the app.
    // I'll query Checklist with BOTH or check email.
    const userEmail = session.user.email;

    const [strategies, journalEntries, tasks, goals, habits, notebook, notesDetailed, checklists] = await Promise.all([
      Strategy.countDocuments({ userId }),
      Trade.countDocuments({ userId }), // Journal Entries
      Task.countDocuments({ userId }),
      Goal.countDocuments({ userId }),
      Habit.countDocuments({ userId }),
      Note.countDocuments({ userId, isDetailed: false }), // Notebook
      Note.countDocuments({ userId, isDetailed: true }), // Notes (Detailed)
      Checklist.countDocuments({ userId: userEmail }), // Checklist uses email
    ]);

    return NextResponse.json({
      strategies,
      journalEntries,
      tasks,
      goals,
      habits,
      notebook,
      notesDetailed,
      checklists
    });

  } catch (error) {
    console.error('Stats overview error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
