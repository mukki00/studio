import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;
const MONGODB_COUNTERS_COLLECTION = process.env.MONGODB_COUNTERS_COLLECTION || 'counters';

if (!MONGODB_URI) throw new Error('Please define the MONGODB_URI environment variable');
if (!MONGODB_DB_NAME) throw new Error('Please define the MONGODB_DB_NAME environment variable');

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

async function getClient(): Promise<MongoClient> {
  if (global._mongoClientPromise) {
    return global._mongoClientPromise;
  }

  const client = new MongoClient(MONGODB_URI!);
  global._mongoClientPromise = client.connect();
  return global._mongoClientPromise;
}

const COUNTER_ID = 'cv';

export async function GET() {
  try {
    const client = await getClient();
  const db = client.db(MONGODB_DB_NAME);
  const counters = db.collection<any>(MONGODB_COUNTERS_COLLECTION);
  const counter = await counters.findOne({ _id: COUNTER_ID as any });
    const count = counter ? counter.count : 0;
    return NextResponse.json({ count });
  } catch (error) {
    console.error('GET /api/cv error', error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}

export async function POST() {
  try {
    const client = await getClient();
    const db = client.db(MONGODB_DB_NAME);
    const counters = db.collection(MONGODB_COUNTERS_COLLECTION);

  await counters.updateOne({ _id: COUNTER_ID as any }, { $inc: { count: 1 } }, { upsert: true });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('POST /api/cv error', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
