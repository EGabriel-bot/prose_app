import { getDb } from "../db/DbClient";
import { users } from "../db/schemas";

export async function getAllUsers() {
  const db = getDb();
  return db.select().from(users);
}

export async function createUser(name: string) {
  const db = getDb();
  return db.insert(users).values({ name }).returning();
}
