import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'firebase-studio-db'; // Puedes cambiar esto si tu base de datos tiene otro nombre

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// En desarrollo, usamos una variable global para preservar el valor a través de las recargas de módulos
// causadas por HMR (Hot Module Replacement).
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in .env.local');
  }

  const client = await MongoClient.connect(MONGODB_URI, {
    // useNewUrlParser: true, // Deprecated
    // useUnifiedTopology: true, // Deprecated
  });

  const db = client.db(DB_NAME);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}