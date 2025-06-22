
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

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;
const MONGODB_CONTACT_COLLECTION = process.env.MONGODB_CONTACT_COLLECTION;

if (!MONGODB_URI || !MONGODB_DB_NAME || !MONGODB_CONTACT_COLLECTION) {
  console.error("FATAL ERROR: MongoDB environment variables (MONGODB_URI, MONGODB_DB_NAME, MONGODB_CONTACT_COLLECTION) are not set.");
  console.error("Please create a .env.local file in the project root and add these variables with your MongoDB connection details, or configure them as secrets in your hosting environment.");
}

let client: MongoClient | null = null;
// @ts-ignore
let clientPromise: Promise<MongoClient> | null = global._mongoClientPromise || null;

async function getMongoClient(): Promise<MongoClient> {
  if (!MONGODB_URI) {
    throw new Error('Critical: MONGODB_URI environment variable is not defined. Check your .env.local file or hosting secrets.');
  }
  if (!MONGODB_DB_NAME) {
    throw new Error('Critical: MONGODB_DB_NAME environment variable is not defined. Check your .env.local file or hosting secrets.');
  }

  if (!clientPromise) {
    client = new MongoClient(MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    clientPromise = client.connect();
    if (process.env.NODE_ENV === 'development') {
      // @ts-ignore
      global._mongoClientPromise = clientPromise;
    }
  }
  return clientPromise;
}

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

  if (!MONGODB_URI || !MONGODB_DB_NAME || !MONGODB_CONTACT_COLLECTION) {
    // This server-side log is for developers. The user gets a generic error.
    console.error("MongoDB environment variables are not properly set. Cannot submit form to database.");
    return {
      message: "Server configuration error. Please contact support if this issue persists.",
      success: false,
    };
  }

  try {
    const mongoClient = await getMongoClient();
    const db = mongoClient.db(MONGODB_DB_NAME);
    const collection = db.collection(MONGODB_CONTACT_COLLECTION);

    const submissionData = {
      ...parsed.data,
      submittedAt: new Date(),
    };

    await collection.insertOne(submissionData);

    return {
      message: 'Your message is in my inbox — thanks for contacting me! Expect a reply soon.',
      success: true,
    };
  } catch (error) {
    console.error('Failed to submit contact form to MongoDB:', error);
    let errorMessage = "An error occurred while sending your message. Please try again later.";
    if (error instanceof Error) {
        if (error.message.toLowerCase().includes('authentication failed')) {
            errorMessage = "Database authentication failed. Please check server logs and contact support.";
        } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED') || error.message.includes('connection refused')) {
            errorMessage = "Could not connect to the database. Please check connection string and network access.";
        } else if (error.message.includes('topology was destroyed')) {
            errorMessage = "Database connection was lost. Please try again.";
             // @ts-ignore
            if (process.env.NODE_ENV === 'development') global._mongoClientPromise = null;
            clientPromise = null; // Reset promise to allow re-connection attempt
        }
    }
    return {
      message: errorMessage,
      success: false,
    };
  }
}
