CREATE TABLE "event_registration" (
	"id" text PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"roll_number" text NOT NULL,
	"course" text NOT NULL,
	"branch" text NOT NULL,
	"year" text NOT NULL,
	"phone" text NOT NULL,
	"interests" text[] NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "event_registration_event_email_unique" UNIQUE("event_id","email"),
	CONSTRAINT "event_registration_event_roll_unique" UNIQUE("event_id","roll_number")
);
--> statement-breakpoint
CREATE TABLE "registration_attempt" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "registration_attempt_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"event_id" text NOT NULL,
	"client_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "registration_attempt_lookup" ON "registration_attempt" USING btree ("event_id","client_hash","created_at");