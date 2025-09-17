
'use server';

import { MongoClient } from 'mongodb';
import { contactFormSchema } from '@/lib/schemas';
import type { ContactFormState } from '@/lib/schemas';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;
const MONGODB_COUNTERS_COLLECTION = process.env.MONGODB_COUNTERS_COLLECTION || 'counters';
const MONGODB_CONTACT_COLLECTION = process.env.MONGODB_CONTACT_COLLECTION || 'contacts';


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

const COUNTER_ID = 'cv';

export async function getDownloadCount(): Promise<number> {
  try {
    const db = await getDb();
    const counters = db.collection(MONGODB_COUNTERS_COLLECTION);

    const counter = await counters.findOne({ _id: COUNTER_ID });
    
    return counter ? counter.count : 0;
  } catch (error) {
    console.error('Error fetching download count:', error);
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

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
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
    await contacts.insertOne({
      name,
      email,
      message,
      submittedAt: new Date(),
    });

    return { success: true, message: 'Thank you for your message! I will get back to you soon.' };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return { success: false, message: 'Something went wrong. Please try again later.' };
  }
}
