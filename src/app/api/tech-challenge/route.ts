import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export const dynamic = 'force-dynamic';

const MONGODB_URI     = process.env.MONGODB_URI!;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME!;
const COLLECTION      = 'techChallenge';

if (!MONGODB_URI)     throw new Error('Missing MONGODB_URI');
if (!MONGODB_DB_NAME) throw new Error('Missing MONGODB_DB_NAME');

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

async function getCol() {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(MONGODB_URI);
    global._mongoClientPromise = client.connect();
  }
  const client = await global._mongoClientPromise;
  return client.db(MONGODB_DB_NAME).collection(COLLECTION);
}

// GET — /api/tech-challenge?uid=<uid>
export async function GET(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get('uid');
  if (!uid) return NextResponse.json({ error: 'uid is required' }, { status: 400 });

  try {
    const col = await getCol();
    const doc = await col.findOne({ uid });

    if (!doc) return NextResponse.json({ uid, items: {} });

    return NextResponse.json({
      uid:       doc.uid,
      createdAt: doc.createdAt ?? null,
      updatedAt: doc.updatedAt ?? null,
      items:     doc.items    ?? {},
    });
  } catch (err) {
    console.error('GET /api/tech-challenge', err);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

// POST — initialise doc for a user
// Body: { uid, totalItems }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { uid?: string; totalItems?: number };
    if (!body.uid) return NextResponse.json({ error: 'uid is required' }, { status: 400 });

    const col   = await getCol();
    const total = body.totalItems ?? 48;
    const items: Record<string, { done: boolean; completedAt: null }> = {};
    for (let i = 1; i <= total; i++) {
      items[String(i)] = { done: false, completedAt: null };
    }

    const now = new Date();
    await col.updateOne(
      { uid: body.uid },
      { $setOnInsert: { uid: body.uid, items, createdAt: now, updatedAt: now } },
      { upsert: true },
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('POST /api/tech-challenge', err);
    return NextResponse.json({ error: 'Failed to initialise' }, { status: 500 });
  }
}

// PATCH — mark an item done or undone
// Body: { uid, itemId, done }
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json() as { uid?: string; itemId?: number; done?: boolean };
    if (!body.uid)                      return NextResponse.json({ error: 'uid is required' },    { status: 400 });
    if (body.itemId == null)            return NextResponse.json({ error: 'itemId is required' }, { status: 400 });
    if (typeof body.done !== 'boolean') return NextResponse.json({ error: 'done is required' },   { status: 400 });

    const col         = await getCol();
    const completedAt = body.done ? new Date() : null;

    await col.updateOne(
      { uid: body.uid },
      {
        $set: {
          [`items.${body.itemId}.done`]:        body.done,
          [`items.${body.itemId}.completedAt`]: completedAt,
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    );

    return NextResponse.json({ ok: true, itemId: body.itemId, done: body.done, completedAt });
  } catch (err) {
    console.error('PATCH /api/tech-challenge', err);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
