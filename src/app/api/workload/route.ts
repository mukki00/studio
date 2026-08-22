import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getCollection } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

const COLLECTION = 'myWorkload';

async function getCol() {
  return getCollection(COLLECTION);
}

// GET — fetch all todos ordered by createdAt
export async function GET() {
  try {
    const col   = await getCol();
    const todos = await col.find({}).sort({ createdAt: 1 }).toArray();
    return NextResponse.json(
      todos.map((t) => ({
        id:             t._id.toString(),
        text:           t.text           as string,
        done:           t.done           as boolean,
        startDate:      (t.startDate ?? t.date) ?? null,
        assignee:       t.assignee       ?? null,
        budget:         t.budget         ?? null,
        budgetCurrency: (t.budgetCurrency as string) ?? 'USD',
        estimatedHours: t.estimatedHours ?? null,
        estimatedUnit:  t.estimatedUnit  ?? 'hrs',
        subtasks:       (t.subtasks      ?? []) as { text: string; done: boolean; startDate: string | null; assignee: string | null; budget: number | null; estimatedHours: number | null; progress: number | null }[],
        createdAt:      t.createdAt      ?? null,
        progress:       t.progress       ?? null,
        priority:       t.priority        ?? null,
        recurring:      t.recurring       ?? null,
      })),
    );
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
  }
}

// POST — create a new todo
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      text?: string;
      startDate?: string | null;
      assignee?: string | null;
      budget?: number | null;
      budgetCurrency?: string | null;
      estimatedHours?: number | null;
      estimatedUnit?: string | null;
      priority?: string | null;
      recurring?: string | null;
      subtasks?: { text: string; done: boolean; date?: string | null; assignee?: string | null; budget?: number | null; estimatedHours?: number | null }[];
    };
    if (!body.text?.trim()) {
      return NextResponse.json({ error: 'text is required' }, { status: 400 });
    }
    const doc = {
      text:           body.text.trim(),
      done:           false,
      startDate:      body.startDate      ?? null,
      assignee:       body.assignee       ?? null,
      budget:         body.budget         ?? null,
      budgetCurrency: body.budgetCurrency ?? 'USD',
      estimatedHours: body.estimatedHours ?? null,
      estimatedUnit:  body.estimatedUnit  ?? 'hrs',
      subtasks:       body.subtasks       ?? [],
      priority:       body.priority        ?? null,
      recurring:      body.recurring       ?? null,
      createdAt:      new Date(),
    };
    const col    = await getCol();
    const result = await col.insertOne(doc);
    return NextResponse.json({ id: result.insertedId.toString(), ...doc });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
  }
}

// PATCH — toggle done | toggle subtask done | add subtask | edit task | edit subtask
// { id, done }                                            → toggle main task done
// { id, subtaskIndex, done }                             → toggle subtask done
// { id, addSubtask: {...} }                              → push new subtask
// { id, updateTask: { text, startDate, assignee, … } }       → update task fields
// { id, subtaskIndex, updateSubtask: {...} }             → replace subtask at index
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json() as {
      id?: string;
      done?: boolean;
      progress?: number;
      subProgress?: number;
      subtaskIndex?: number;
      deleteSubtaskIndex?: number;
      addSubtask?: { text: string; done: boolean; startDate?: string | null; assignee?: string | null; budget?: number | null; estimatedHours?: number | null };
      updateTask?: { text: string; startDate: string | null; assignee: string | null; budget: number | null; budgetCurrency: string; estimatedHours: number | null; estimatedUnit: string; priority: string | null; recurring: string | null };
      updateSubtask?: { text: string; done: boolean; startDate: string | null; assignee: string | null; budget: number | null; estimatedHours: number | null; progress: number | null };
    };
    if (!body.id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    const col = await getCol();
    if (body.addSubtask) {
      await col.updateOne(
        { _id: new ObjectId(body.id) },
        { $push: { subtasks: body.addSubtask } } as never,
      );
    } else if (body.subtaskIndex !== undefined && body.updateSubtask) {
      await col.updateOne(
        { _id: new ObjectId(body.id) },
        { $set: { [`subtasks.${body.subtaskIndex}`]: body.updateSubtask } },
      );
    } else if (body.subtaskIndex !== undefined && body.subProgress !== undefined) {
      const p = Math.max(0, Math.min(100, Math.round(body.subProgress)));
      await col.updateOne(
        { _id: new ObjectId(body.id) },
        { $set: { [`subtasks.${body.subtaskIndex}.progress`]: p, ...(p === 100 ? { [`subtasks.${body.subtaskIndex}.done`]: true } : {}) } },
      );
    } else if (body.subtaskIndex !== undefined) {
      await col.updateOne(
        { _id: new ObjectId(body.id) },
        { $set: { [`subtasks.${body.subtaskIndex}.done`]: !!body.done, ...(body.done ? { [`subtasks.${body.subtaskIndex}.progress`]: 100 } : {}) } },
      );
    } else if (body.updateTask) {
      const { text, startDate, assignee, budget, budgetCurrency, estimatedHours, estimatedUnit, priority, recurring } = body.updateTask;
      await col.updateOne(
        { _id: new ObjectId(body.id) },
        { $set: { text, startDate, assignee, budget, budgetCurrency, estimatedHours, estimatedUnit, priority, recurring } },
      );
    } else if (body.deleteSubtaskIndex !== undefined) {
      // $unset sets the element to null, then $pull removes all nulls
      await col.updateOne(
        { _id: new ObjectId(body.id) },
        { $unset: { [`subtasks.${body.deleteSubtaskIndex}`]: 1 } } as never,
      );
      await col.updateOne(
        { _id: new ObjectId(body.id) },
        { $pull: { subtasks: null } } as never,
      );
    } else if (body.progress !== undefined) {
      const p = Math.max(0, Math.min(100, Math.round(body.progress)));
      await col.updateOne(
        { _id: new ObjectId(body.id) },
        { $set: { progress: p, ...(p === 100 ? { done: true } : {}) } },
      );
    } else {
      await col.updateOne(
        { _id: new ObjectId(body.id) },
        { $set: { done: !!body.done } },
      );
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 });
  }
}

// DELETE — remove a todo  { id: string }
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json() as { id?: string };
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    const col = await getCol();
    await col.deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
  }
}


