import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

const COLLECTION = 'completedSurahs';

// GET — fetch the challenge doc for a given uid
// /api/quran-challenge?uid=<uid>
export async function GET(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get('uid');
  if (!uid) return NextResponse.json({ error: 'uid is required' }, { status: 400 });

  try {
    const col = await getCollection(COLLECTION);
    const doc = await col.findOne({ uid });

    if (!doc) return NextResponse.json({ uid, surahs: {} });

    return NextResponse.json({
      uid:       doc.uid,
      createdAt: doc.createdAt ?? null,
      updatedAt: doc.updatedAt ?? null,
      surahs:    doc.surahs   ?? {},
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

// POST — create/initialise the challenge doc for a user (114 surahs, all not done)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { uid?: string };
    if (!body.uid) return NextResponse.json({ error: 'uid is required' }, { status: 400 });

    const col = await getCollection(COLLECTION);

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
  } catch {
    return NextResponse.json({ error: 'Failed to initialise' }, { status: 500 });
  }
}

// PATCH — mark a surah done or undone
// Body: { uid, surahNum, done }
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json() as { uid?: string; surahNum?: number; done?: boolean };
    if (!body.uid)                      return NextResponse.json({ error: 'uid is required' },      { status: 400 });
    if (body.surahNum == null)          return NextResponse.json({ error: 'surahNum is required' }, { status: 400 });
    if (typeof body.done !== 'boolean') return NextResponse.json({ error: 'done is required' },     { status: 400 });

    const col         = await getCollection(COLLECTION);
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
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

