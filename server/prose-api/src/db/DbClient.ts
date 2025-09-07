// neon client for global use
import { drizzle } from 'drizzle-orm/neon-serverless';

let db: ReturnType<typeof drizzle> | null = null;

export function initDbClient(connectionString: string) {
    if (!db){
       db = drizzle(connectionString);
    }
    return db;
}

export function getDb() {
  if (!db) {
    throw new Error("DB not initialized. Call initDb first.");
  }
  return db;
}
