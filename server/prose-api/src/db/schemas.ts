import { sql } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  check,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  ol_key: text("ol_key"),
  title: text("title").notNull(),
  author_names: text("author_names").array(),
  first_publish_year: integer("first_publish_year"),
  edition_count: integer("edition_count"),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const userBooks = pgTable(
  "user_books",
  {
    id: serial("id").primaryKey(),
    user_id: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    book_id: integer("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(), // 1..5
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => ({
    uqUserBook: uniqueIndex("uq_user_books_user_book").on(t.user_id, t.book_id),
    ratingRange: check(
      "ck_user_books_rating_1_5",
      sql`${t.rating} BETWEEN 1 AND 5`
    ),
  })
);
