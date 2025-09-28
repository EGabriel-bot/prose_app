import { Context } from "hono";
import { z } from "zod";
import { upsertUserBook, listUserShelf } from "../models/userBook";

const RatePayload = z.object({
  user_id: z.number().int().positive(),
  book_id: z.number().int().positive(),
  rating: z.number().int().min(1).max(5),
});

export async function createUserBook(c: Context) {
  try {
    const parsed = RatePayload.parse(await c.req.json());
    const row = await upsertUserBook({
      userId: parsed.user_id,
      bookId: parsed.book_id,
      rating: parsed.rating,
    });
    return c.json({ data: row }, 201);
  } catch (e: any) {
    if (e?.issues)
      return c.json({ error: "Invalid payload", details: e.issues }, 400);
    return c.json({ error: "Failed to create user_book" }, 500);
  }
}

export async function getUserShelf(c: Context) {
  const userId = Number(c.req.param("userId"));
  if (!userId) return c.json({ error: "invalid userId" }, 400);
  const data = await listUserShelf(userId);
  return c.json({ data });
}
