CREATE TABLE "app_dev_response" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"branch" text NOT NULL,
	"answer" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
