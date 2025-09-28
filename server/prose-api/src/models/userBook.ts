import { getDb } from "../db/DbClient";
import { userBooks, books } from "../db/schemas";
import { eq } from "drizzle-orm";

export async function upsertUserBook({
  userId,
  bookId,
  rating,
}: {
  userId: number;
  bookId: number;
  rating: number;
}) {
  const db = getDb();
  const [row] = await db
    .insert(userBooks)
    .values({
      user_id: userId,
      book_id: bookId,
      rating,
    })
    .onConflictDoUpdate({
      target: [userBooks.user_id, userBooks.book_id],
      set: { rating, updated_at: new Date() },
    })
    .returning();
  return row;
}

export async function listUserShelf(userId: number) {
  const db = getDb();
  return db
    .select({
      id: books.id,
      title: books.title,
      author_names: books.author_names,
      rating: userBooks.rating,
    })
    .from(userBooks)
    .innerJoin(books, eq(userBooks.book_id, books.id))
    .where(eq(userBooks.user_id, userId));
}
