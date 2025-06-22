
'use server';

import { z } from 'zod';
import { MongoClient, ServerApiVersion } from 'mongodb';

const ContactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long." }),
  email: z.string().email({ message: "Invalid email address." }),
  phoneNumber: z.string().optional().refine(value => !value || /^\+?[1-9]\d{1,14}$/.test(value), {
    message: "Invalid phone number format."
  }),
  message: z.string().min(10, { message: "Message must be at least 10 characters long." }).max(500, { message: "Message cannot exceed 500 characters." }),
});

export type ContactFormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  success: boolean;
};

// --- MongoDB Client Singleton ---
let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

function getMongoClient(): Promise<MongoClient> {
  if (clientPromise) {
    return clientPromise;
  }
  
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    // This is a critical server configuration error.
    throw new Error('FATAL: MONGODB_URI environment variable is not defined. The application cannot connect to the database.');
  }

  client = new MongoClient(MONGODB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  clientPromise = client.connect();
  return clientPromise;
}

// --- Helper function to check environment variables ---
function checkEnvVars(requiredVars: string[]): { missing: string[], values: Record<string, string> } {
  const values: Record<string, string> = {};
  const missing: string[] = [];

  for (const v of requiredVars) {
    const value = process.env[v];
    if (value) {
      values[v] = value;
    } else {
      missing.push(v);
    }
  }
  return { missing, values };
}

// --- Server Actions ---

export async function submitContactForm(
  prevState: ContactFormState,
  data: FormData
): Promise<ContactFormState> {
  const formData = Object.fromEntries(data);
  const parsed = ContactFormSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      message: 'Invalid form data.',
      fields: formData as Record<string, string>,
      issues: parsed.error.issues.map((issue) => issue.message),
      success: false,
    };
  }

  const { missing, values } = checkEnvVars(['MONGODB_DB_NAME', 'MONGODB_CONTACT_COLLECTION']);
  if (missing.length > 0) {
    const errorMsg = `Server Configuration Error: The following environment variables are missing: ${missing.join(', ')}. Contact form cannot be submitted.`;
    console.error(errorMsg);
    return {
      message: "Server configuration error prevents saving your message. Please contact support.",
      success: false,
    };
  }
  const { MONGODB_DB_NAME, MONGODB_CONTACT_COLLECTION } = values;

  try {
    const mongoClient = await getMongoClient();
    const db = mongoClient.db(MONGODB_DB_NAME);
    const collection = db.collection(MONGODB_CONTACT_COLLECTION);

    await collection.insertOne({ ...parsed.data, submittedAt: new Date() });

    return {
      message: 'Your message is in my inbox — thanks for contacting me! Expect a reply soon.',
      success: true,
    };
  } catch (error) {
    console.error('Failed to submit contact form to MongoDB:', error);
    return {
      message: "An unexpected error occurred while sending your message. Please try again later.",
      success: false,
    };
  }
}

export async function getCvDownloads(): Promise<number> {
  const { missing, values } = checkEnvVars(['MONGODB_DB_NAME', 'MONGODB_COUNTERS_COLLECTION']);
  if (missing.length > 0) {
    console.error(`Server Configuration Error for getCvDownloads: Missing environment variables: ${missing.join(', ')}. Returning 0.`);
    return 0;
  }
  const { MONGODB_DB_NAME, MONGODB_COUNTERS_COLLECTION } = values;

  try {
    const mongoClient = await getMongoClient();
    const db = mongoClient.db(MONGODB_DB_NAME);
    const collection = db.collection(MONGODB_COUNTERS_COLLECTION);
    const counter = await collection.findOne({ _id: 'cv' });
    return counter ? counter.count : 0;
  } catch (error) {
    console.error('Failed to get CV download count:', error);
    return 0; // Return 0 on error to avoid breaking the page
  }
}

export async function incrementCvDownloads(): Promise<{ success: boolean }> {
  const { missing, values } = checkEnvVars(['MONGODB_DB_NAME', 'MONGODB_COUNTERS_COLLECTION']);
  if (missing.length > 0) {
    console.error(`Server Configuration Error for incrementCvDownloads: Missing environment variables: ${missing.join(', ')}. Cannot increment count.`);
    return { success: false };
  }
  const { MONGODB_DB_NAME, MONGODB_COUNTERS_COLLECTION } = values;

  try {
    const mongoClient = await getMongoClient();
    const db = mongoClient.db(MONGODB_DB_NAME);
    const collection = db.collection(MONGODB_COUNTERS_COLLECTION);
    
    await collection.findOneAndUpdate(
      { _id: 'cv' },
      { $inc: { count: 1 } },
      { upsert: true }
    );
    
    return { success: true };
  } catch (error) {
    console.error('Failed to increment CV download count:', error);
    return { success: false };
  }
}
