import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export const dynamic = 'force-dynamic';

const MONGODB_URI     = process.env.MONGODB_URI!;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME!;
const COLLECTION      = 'completedSurahs';

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

// GET — fetch the challenge doc for a given uid
// /api/quran-challenge?uid=<uid>
export async function GET(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get('uid');
  if (!uid) return NextResponse.json({ error: 'uid is required' }, { status: 400 });

  try {
    const col  = await getCol();
    const doc  = await col.findOne({ uid });

    if (!doc) {
      // Return an empty challenge — client will call POST to initialise
      return NextResponse.json({ uid, surahs: {} });
    }

    return NextResponse.json({
      uid:       doc.uid,
      createdAt: doc.createdAt ?? null,
      updatedAt: doc.updatedAt ?? null,
      surahs:    doc.surahs   ?? {},
    });
  } catch (err) {
    console.error('GET /api/quran-challenge', err);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

// POST — create/initialise the challenge doc for a user (114 surahs, all not done)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { uid?: string };
    if (!body.uid) return NextResponse.json({ error: 'uid is required' }, { status: 400 });

    const col = await getCol();

    // Build initial surahs map
    const surahs: Record<string, { done: boolean; completedAt: null }> = {};
    for (let i = 1; i <= 114; i++) {
      surahs[String(i)] = { done: false, completedAt: null };
    }

    const now = new Date();
    await col.updateOne(
      { uid: body.uid },
      { $setOnInsert: { uid: body.uid, surahs, createdAt: now, updatedAt: now } },
      { upsert: true },
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('POST /api/quran-challenge', err);
    return NextResponse.json({ error: 'Failed to initialise' }, { status: 500 });
  }
}

// PATCH — mark a surah done or undone
// Body: { uid, surahNum, done }
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json() as { uid?: string; surahNum?: number; done?: boolean };
    if (!body.uid)                  return NextResponse.json({ error: 'uid is required' },      { status: 400 });
    if (body.surahNum == null)      return NextResponse.json({ error: 'surahNum is required' }, { status: 400 });
    if (typeof body.done !== 'boolean') return NextResponse.json({ error: 'done is required' }, { status: 400 });

    const col = await getCol();
    const completedAt = body.done ? new Date() : null;

    await col.updateOne(
      { uid: body.uid },
      {
        $set: {
          [`surahs.${body.surahNum}.done`]:        body.done,
          [`surahs.${body.surahNum}.completedAt`]: completedAt,
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    );

    return NextResponse.json({ ok: true, surahNum: body.surahNum, done: body.done, completedAt });
  } catch (err) {
    console.error('PATCH /api/quran-challenge', err);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
