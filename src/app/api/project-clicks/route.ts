import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

function getCollectionName(projectTitle: string): string {
  return projectTitle.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_') + '_clicks';
}

export async function POST(request: NextRequest) {
  try {
    const { projectTitle } = await request.json();

    if (!projectTitle) {
      return NextResponse.json({ error: 'Project title is required' }, { status: 400 });
    }

    const db = await getDb();
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
  } catch {
    return NextResponse.json({ error: 'Failed to update click count' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = await getDb();
    const collections = await db.listCollections().toArray();
    const clickCollections = collections.filter((col) => col.name.endsWith('_clicks'));

    const clickCounts: Record<string, number> = {};
    for (const collection of clickCollections) {
      const docs = await db.collection(collection.name).find({}).toArray();
      docs.forEach((doc) => {
        if (doc.projectTitle && doc.clickCount) {
          clickCounts[doc.projectTitle] = doc.clickCount;
        }
      });
    }

    return NextResponse.json({ clickCounts });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch click counts' }, { status: 500 });
  }
}