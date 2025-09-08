import { Context } from "hono";
import { OpenLibraryResponseDTO } from "../DTOs/OpenLibraryResponseDTO";
import { addBooks, listBooks } from "../models/books";

const normalizeWorkKey = (key?: string | null) =>
  key?.startsWith("/works/") ? key.slice("/works/".length) : key ?? null;

export async function getBooks(c: Context) {
  const { bookName } = c.req.param();
  const openLibraryUrl = `https://openlibrary.org/search.json?title=${bookName}`;

  try {
    const response = await fetch(openLibraryUrl);
    if (!response.ok) {
      return c.json({ error: "Failed to fetch books from Open Library" }, 500);
    }
    const data = await response.json();
    const parsedData = OpenLibraryResponseDTO.parse(data);
    return c.json(parsedData);
  } catch {
    return c.json({ error: "An error occurred while fetching books" }, 500);
  }
}

type IncomingBook = {
  ol_key?: string | null;
  title: string;
  author_name?: string[] | string | null;
  first_publish_year?: number | null;
  edition_count?: number | null;
};

function normalizeToArray(raw: unknown): IncomingBook[] {
  const b = raw as any;
  if (Array.isArray(b?.books)) return b.books;
  if (b?.book && typeof b.book === "object") return [b.book];
  if (b && typeof b === "object" && "title" in b) return [b as IncomingBook];
  return [];
}

export async function saveBooks(c: Context) {
  try {
    const body = await c.req.json();
    const items = normalizeToArray(body);

    if (!items.length) {
      return c.json(
        { error: "Provide books:[], book:{}, or a single book object" },
        400
      );
    }

    const toInsert = items.map((b) => {
      const title = (b.title ?? "").trim();
      if (!title) throw new Error("TITLE_REQUIRED");

      const author_names = Array.isArray(b.author_name)
        ? b.author_name
        : typeof b.author_name === "string"
        ? [b.author_name]
        : null;

      return {
        ol_key: normalizeWorkKey(b.ol_key ?? null),
        title,
        author_names,
        first_publish_year: b.first_publish_year ?? null,
        edition_count: b.edition_count ?? null,
      };
    });

    const inserted = await addBooks(toInsert);
    return c.json({ count: inserted.length, inserted }, 201);
  } catch (err: any) {
    if (err?.message === "TITLE_REQUIRED") {
      return c.json({ error: "title is required" }, 400);
    }
    return c.json({ error: "Failed to save books" }, 500);
  }
}

export async function listStoredBooks(c: Context) {
  const data = await listBooks();
  return c.json(data);
}
