import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

const MONGODB_URI      = process.env.MONGODB_URI!;
const MONGODB_DB_NAME  = process.env.MONGODB_DB_NAME!;
const COLLECTION       = 'myWorkload';

if (!MONGODB_URI)     throw new Error('Missing MONGODB_URI');
if (!MONGODB_DB_NAME) throw new Error('Missing MONGODB_DB_NAME');

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

async function getDb() {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(MONGODB_URI);
    global._mongoClientPromise = client.connect();
  }
  const client = await global._mongoClientPromise;
  return client.db(MONGODB_DB_NAME).collection(COLLECTION);
}

// GET — fetch all todos ordered by createdAt
export async function GET() {
  try {
    const col   = await getDb();
    const todos = await col.find({}).sort({ createdAt: 1 }).toArray();
    return NextResponse.json(
      todos.map((t) => ({
        id:             t._id.toString(),
        text:           t.text           as string,
        done:           t.done           as boolean,
        date:           t.date           ?? null,
        assignee:       t.assignee       ?? null,
        budget:         t.budget         ?? null,
        budgetCurrency: (t.budgetCurrency as string) ?? 'USD',
        estimatedHours: t.estimatedHours ?? null,
        estimatedUnit:  t.estimatedUnit  ?? 'hrs',
        subtasks:       (t.subtasks      ?? []) as { text: string; done: boolean; date: string | null; assignee: string | null; budget: number | null; estimatedHours: number | null; progress: number | null }[],
        createdAt:      t.createdAt      ?? null,
        progress:       t.progress       ?? null,
      })),
    );
  } catch (err) {
    console.error('GET /api/workload', err);
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
  }
}

// POST — create a new todo
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      text?: string;
      date?: string | null;
      assignee?: string | null;
      budget?: number | null;
      budgetCurrency?: string | null;
      estimatedHours?: number | null;
      estimatedUnit?: string | null;
      subtasks?: { text: string; done: boolean; date?: string | null; assignee?: string | null; budget?: number | null; estimatedHours?: number | null }[];
    };
    if (!body.text?.trim()) {
      return NextResponse.json({ error: 'text is required' }, { status: 400 });
    }
    const doc = {
      text:           body.text.trim(),
      done:           false,
      date:           body.date           ?? null,
      assignee:       body.assignee       ?? null,
      budget:         body.budget         ?? null,
      budgetCurrency: body.budgetCurrency ?? 'USD',
      estimatedHours: body.estimatedHours ?? null,
      estimatedUnit:  body.estimatedUnit  ?? 'hrs',
      subtasks:       body.subtasks       ?? [],
      createdAt:      new Date(),
    };
    const col    = await getDb();
    const result = await col.insertOne(doc);
    return NextResponse.json({ id: result.insertedId.toString(), ...doc });
  } catch (err) {
    console.error('POST /api/workload', err);
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
  }
}

// PATCH — toggle done | toggle subtask done | add subtask | edit task | edit subtask
// { id, done }                                            → toggle main task done
// { id, subtaskIndex, done }                             → toggle subtask done
// { id, addSubtask: {...} }                              → push new subtask
// { id, updateTask: { text, date, assignee, … } }       → update task fields
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
      addSubtask?: { text: string; done: boolean; date?: string | null; assignee?: string | null; budget?: number | null; estimatedHours?: number | null };
      updateTask?: { text: string; date: string | null; assignee: string | null; budget: number | null; budgetCurrency: string; estimatedHours: number | null; estimatedUnit: string };
      updateSubtask?: { text: string; done: boolean; date: string | null; assignee: string | null; budget: number | null; estimatedHours: number | null; progress: number | null };
    };
    if (!body.id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    const col = await getDb();
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
      const { text, date, assignee, budget, budgetCurrency, estimatedHours, estimatedUnit } = body.updateTask;
      await col.updateOne(
        { _id: new ObjectId(body.id) },
        { $set: { text, date, assignee, budget, budgetCurrency, estimatedHours, estimatedUnit } },
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
    console.error('PATCH /api/workload', err);
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 });
  }
}

// DELETE — remove a todo  { id: string }
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json() as { id?: string };
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    const col = await getDb();
    await col.deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/workload', err);
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
  }
}
