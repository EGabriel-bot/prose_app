// server/prose-api/src/controllers/bookController.ts
import { Context } from "hono";
import { z, ZodError } from "zod";
import { OpenLibraryResponseDTO } from "../DTOs/OpenLibraryResponseDTO";
import { addBooks, listBooks } from "../models/books";

const respond = {
  ok: (c: Context, data: unknown, status = 200) => c.json({ data }, status),
  bad: (c: Context, message: string, details?: unknown) =>
    c.json({ error: message, details }, 400),
  fail: (c: Context, message = "Internal Server Error") =>
    c.json({ error: message }, 500),
} as const;

const normalizeWorkKey = (key?: string | null) =>
  key?.startsWith("/works/") ? key.slice("/works/".length) : key ?? null;

const coerceAuthors = (a?: string | string[] | null) =>
  Array.isArray(a) ? a : typeof a === "string" && a.trim() ? [a] : null;

const BookInput = z.object({
  title: z.string().trim().min(1, "title is required"),
  author_name: z
    .union([z.string(), z.array(z.string())])
    .nullable()
    .optional(),
  first_publish_year: z.number().int().min(0).max(3000).nullable().optional(),
  edition_count: z.number().int().min(0).nullable().optional(),
  ol_key: z.string().nullable().optional(),
});

const FlexPayload = z.union([
  z.object({ books: z.array(BookInput).min(1) }),
  z.object({ book: BookInput }),
  BookInput,
]);

type BookInputType = z.infer<typeof BookInput>;

const toInsert = (b: BookInputType) => ({
  ol_key: normalizeWorkKey(b.ol_key ?? null),
  title: b.title.trim(),
  author_names: coerceAuthors(b.author_name ?? null),
  first_publish_year: b.first_publish_year ?? null,
  edition_count: b.edition_count ?? null,
});

export async function getBooks(c: Context) {
  const { bookName } = c.req.param();
  const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(
    bookName
  )}`;

  try {
    const r = await fetch(url);
    if (!r.ok)
      return c.json({ error: "Failed to fetch books from Open Library" }, 500);
    const json = await r.json();
    const parsed = OpenLibraryResponseDTO.parse(json);
    return respond.ok(c, parsed);
  } catch {
    return respond.fail(c, "An error occurred while fetching books");
  }
}

export async function saveBooks(c: Context) {
  try {
    const raw = await c.req.json();
    const parsed = FlexPayload.safeParse(raw);
    if (!parsed.success)
      return respond.bad(c, "Invalid payload", parsed.error.issues);

    const items =
      "books" in parsed.data
        ? parsed.data.books
        : "book" in parsed.data
        ? [parsed.data.book]
        : [parsed.data];

    const payload = items.map(toInsert);
    const inserted = await addBooks(payload);
    return c.json({ count: inserted.length, data: inserted }, 201);
  } catch (e) {
    if (e instanceof ZodError)
      return respond.bad(c, "Invalid payload", e.issues);
    return respond.fail(c, "Failed to save books");
  }
}

export async function listStoredBooks(c: Context) {
  const rows = await listBooks();
  return respond.ok(c, rows);
}
