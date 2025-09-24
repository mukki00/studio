import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export const dynamic = 'force-dynamic';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

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

// Helper function to create collection name from project title
function getCollectionName(projectTitle: string): string {
  // Convert project title to a safe collection name: "Project Name" -> "project_name_clicks"
  return projectTitle.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_') + '_clicks';
}

export async function POST(request: NextRequest) {
  try {
    const { projectTitle } = await request.json();

    if (!projectTitle) {
      return NextResponse.json({ error: 'Project title is required' }, { status: 400 });
    }

    const client = await getClient();
    const db = client.db(MONGODB_DB_NAME);
    const collectionName = getCollectionName(projectTitle);
    const clicksCollection = db.collection(collectionName);

    // Use project title as document ID for easy querying
    const result = await clicksCollection.updateOne(
      { _id: projectTitle },
      { 
        $inc: { clickCount: 1 },
        $set: { 
          projectTitle,
          lastClicked: new Date()
        },
        $setOnInsert: { 
          firstClicked: new Date()
        }
      },
      { upsert: true }
    );

    // Get the updated document to return current count
    const updatedDoc = await clicksCollection.findOne({ _id: projectTitle });
    const clickCount = updatedDoc?.clickCount || 1;

    return NextResponse.json({ success: true, clickCount });
  } catch (error) {
    console.error('Error updating click count:', error);
    return NextResponse.json({ error: 'Failed to update click count' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await getClient();
    const db = client.db(MONGODB_DB_NAME);
    
    // Get all collections that end with '_clicks'
    const collections = await db.listCollections().toArray();
    const clickCollections = collections.filter(col => col.name.endsWith('_clicks'));
    
    const clickCounts: Record<string, number> = {};
    
    // Fetch click counts from all project collections
    for (const collection of clickCollections) {
      const clicksCollection = db.collection(collection.name);
      const docs = await clicksCollection.find({}).toArray();
      
      docs.forEach(doc => {
        if (doc.projectTitle && doc.clickCount) {
          clickCounts[doc.projectTitle] = doc.clickCount;
        }
      });
    }

    return NextResponse.json({ clickCounts });
  } catch (error) {
    console.error('Error fetching click counts:', error);
    return NextResponse.json({ error: 'Failed to fetch click counts' }, { status: 500 });
  }
}