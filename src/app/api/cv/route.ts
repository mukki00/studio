import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getCollection } from '@/lib/mongodb';

const MONGODB_COUNTERS_COLLECTION = process.env.MONGODB_COUNTERS_COLLECTION || 'counters';
const COUNTER_ID = 'cv';

type CounterDoc = { _id: string; count: number };

export async function GET() {
  try {
    const counters = await getCollection<CounterDoc>(MONGODB_COUNTERS_COLLECTION);
    const counter = await counters.findOne({ _id: COUNTER_ID });
    return NextResponse.json({ count: counter ? counter.count : 0 });
  } catch {
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}

export async function POST() {
  try {
    const counters = await getCollection<CounterDoc>(MONGODB_COUNTERS_COLLECTION);
    await counters.updateOne({ _id: COUNTER_ID }, { $inc: { count: 1 } }, { upsert: true });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
