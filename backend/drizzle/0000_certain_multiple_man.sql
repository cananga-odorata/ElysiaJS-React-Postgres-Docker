CREATE TABLE IF NOT EXISTS "todos" (
	"id" serial PRIMARY KEY NOT NULL,
	"task" text NOT NULL,
	"completed" boolean DEFAULT false NOT NULL
);
