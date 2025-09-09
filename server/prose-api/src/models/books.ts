import { getDb } from "../db/DbClient";
import { books } from "../db/schemas";
import { eq } from "drizzle-orm";

export type NewBook = {
  ol_key?: string | null;
  title: string;
  author_names?: string[] | null;
  first_publish_year?: number | null;
  edition_count?: number | null;
};

export async function addBooks(newBooks: NewBook[]) {
  const db = getDb();

  const filtered = newBooks.filter((b) => b.title?.trim());
  if (filtered.length === 0) {
    return [];
  }

  const res = await db
    .insert(books)
    .values(
      filtered.map((b) => ({
        ol_key: b.ol_key ?? null,
        title: b.title,
        author_names: b.author_names ?? null,
        first_publish_year: b.first_publish_year ?? null,
        edition_count: b.edition_count ?? null,
      }))
    )
    .returning();

  return res;
}

export async function listBooks() {
  const db = getDb();
  return db.select().from(books).orderBy(books.id);
}
