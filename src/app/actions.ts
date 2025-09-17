
'use server';

import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;
const MONGODB_COUNTERS_COLLECTION = process.env.MONGODB_COUNTERS_COLLECTION || 'counters';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}
if (!MONGODB_DB_NAME) {
  throw new Error('Please define the MONGODB_DB_NAME environment variable');
}

let cachedClient: MongoClient | null = null;

async function getDb() {
  if (cachedClient) {
    return cachedClient.db(MONGODB_DB_NAME);
  }
  
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  cachedClient = client;
  return client.db(MONGODB_DB_NAME);
}

const COUNTER_ID = 'cvDownloads';

export async function getDownloadCount(): Promise<number> {
  try {
    const db = await getDb();
    const counters = db.collection(MONGODB_COUNTERS_COLLECTION);

    const counter = await counters.findOne({ _id: COUNTER_ID });
    
    return counter ? counter.count : 0;
  } catch (error) {
    console.error('Error fetching download count:', error);
    // Return 0 if there's an error so the page can still render.
    return 0;
  }
}

export async function incrementDownloadCount(): Promise<void> {
   try {
    const db = await getDb();
    const counters = db.collection(MONGODB_COUNTERS_COLLECTION);
    
    await counters.updateOne(
        { _id: COUNTER_ID },
        { $inc: { count: 1 } },
        { upsert: true }
    );
  } catch (error) {
    console.error('Error incrementing download count:', error);
  }
}
