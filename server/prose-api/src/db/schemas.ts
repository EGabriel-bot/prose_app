import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

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
