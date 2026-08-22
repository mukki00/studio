import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getDb } from '@/lib/mongodb';
import { contactFormSchema } from '@/lib/schemas';

const MONGODB_CONTACT_COLLECTION = process.env.MONGODB_CONTACT_COLLECTION || 'contacts';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.errors.map((e) => e.message).join(', ') },
        { status: 400 },
      );
    }

    const db = await getDb();
    const contacts = db.collection(MONGODB_CONTACT_COLLECTION);
    await contacts.insertOne({ ...parsed.data, submittedAt: new Date() });

    return NextResponse.json({ success: true, message: 'Thank you for your message! I will get back to you soon.' });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again later.' },
      { status: 500 },
    );
  }
}
