import { MongoClient, Db, Collection, Document } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

if (!MONGODB_URI) throw new Error('Missing MONGODB_URI environment variable');
if (!MONGODB_DB_NAME) throw new Error('Missing MONGODB_DB_NAME environment variable');

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(MONGODB_URI!);
    global._mongoClientPromise = client.connect();
  }
  return global._mongoClientPromise;
}

export async function getClient(): Promise<MongoClient> {
  return getClientPromise();
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(MONGODB_DB_NAME);
}

export async function getCollection<T extends Document = Document>(
  collectionName: string,
): Promise<Collection<T>> {
  const db = await getDb();
  return db.collection<T>(collectionName);
}
