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
        id:        t._id.toString(),
        text:      t.text as string,
        done:      t.done as boolean,
        createdAt: t.createdAt ?? null,
      })),
    );
  } catch (err) {
    console.error('GET /api/workload', err);
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
  }
}

// POST — create a new todo  { text: string }
export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json() as { text?: string };
    if (!text?.trim()) {
      return NextResponse.json({ error: 'text is required' }, { status: 400 });
    }
    const col    = await getDb();
    const result = await col.insertOne({ text: text.trim(), done: false, createdAt: new Date() });
    return NextResponse.json({ id: result.insertedId.toString(), text: text.trim(), done: false });
  } catch (err) {
    console.error('POST /api/workload', err);
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
  }
}

// PATCH — toggle done  { id: string }
export async function PATCH(req: NextRequest) {
  try {
    const { id, done } = await req.json() as { id?: string; done?: boolean };
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    const col = await getDb();
    await col.updateOne({ _id: new ObjectId(id) }, { $set: { done: !!done } });
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
