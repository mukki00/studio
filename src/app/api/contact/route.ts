import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { MongoClient } from 'mongodb';
import { contactFormSchema } from '@/lib/schemas';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;
const MONGODB_CONTACT_COLLECTION = process.env.MONGODB_CONTACT_COLLECTION || 'contacts';

if (!MONGODB_URI) throw new Error('Please define the MONGODB_URI environment variable');
if (!MONGODB_DB_NAME) throw new Error('Please define the MONGODB_DB_NAME environment variable');

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

async function getClient(): Promise<MongoClient> {
  if (global._mongoClientPromise) return global._mongoClientPromise;
  const client = new MongoClient(MONGODB_URI!);
  global._mongoClientPromise = client.connect();
  return global._mongoClientPromise;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: parsed.error.errors.map(e => e.message).join(', ') }, { status: 400 });
    }

    const client = await getClient();
    const db = client.db(MONGODB_DB_NAME);
    const contacts = db.collection(MONGODB_CONTACT_COLLECTION);

    await contacts.insertOne({ ...parsed.data, submittedAt: new Date() });

    return NextResponse.json({ success: true, message: 'Thank you for your message! I will get back to you soon.' });
  } catch (error) {
    console.error('POST /api/contact error', error);
    return NextResponse.json({ success: false, message: 'Something went wrong. Please try again later.' }, { status: 500 });
  }
}
