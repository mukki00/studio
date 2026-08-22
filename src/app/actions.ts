
'use server';

import { getDb } from '@/lib/mongodb';
import { contactFormSchema } from '@/lib/schemas';
import type { ContactFormState } from '@/lib/schemas';

const MONGODB_COUNTERS_COLLECTION = process.env.MONGODB_COUNTERS_COLLECTION || 'counters';
const MONGODB_CONTACT_COLLECTION = process.env.MONGODB_CONTACT_COLLECTION || 'contacts';

const COUNTER_ID = 'cv';

export async function getDownloadCount(): Promise<number> {
  try {
    const db = await getDb();
    const counters = db.collection<{ _id: string; count: number }>(MONGODB_COUNTERS_COLLECTION);
    const counter = await counters.findOne({ _id: COUNTER_ID });
    return counter ? counter.count : 0;
  } catch {
    return 0;
  }
}

export async function incrementDownloadCount(): Promise<void> {
  try {
    const db = await getDb();
    const counters = db.collection<{ _id: string; count: number }>(MONGODB_COUNTERS_COLLECTION);
    await counters.updateOne(
      { _id: COUNTER_ID },
      { $inc: { count: 1 } },
      { upsert: true },
    );
  } catch {
    // silent — non-critical
  }
}

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const validatedFields = contactFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.errors.map((e) => e.message).join(', '),
    };
  }

  const { name, email, message } = validatedFields.data;

  try {
    const db = await getDb();
    const contacts = db.collection(MONGODB_CONTACT_COLLECTION);
    await contacts.insertOne({ name, email, message, submittedAt: new Date() });
    return { success: true, message: 'Thank you for your message! I will get back to you soon.' };
  } catch {
    return { success: false, message: 'Something went wrong. Please try again later.' };
  }
}
