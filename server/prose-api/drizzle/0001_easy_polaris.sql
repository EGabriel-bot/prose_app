CREATE TABLE "books" (
	"id" serial PRIMARY KEY NOT NULL,
	"ol_key" text,
	"title" text NOT NULL,
	"author_names" text[],
	"first_publish_year" integer,
	"edition_count" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
