CREATE TABLE "induction_submission" (
	"id" text PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"cycle_id" text NOT NULL,
	"department_id" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"branch" text NOT NULL,
	"other_clubs" text NOT NULL,
	"why_gdgc" text NOT NULL,
	"answers" jsonb NOT NULL,
	"form_version" integer NOT NULL,
	"question_snapshot" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "induction_submission_cycle_department_email_unique" UNIQUE("cycle_id","department_id","email")
);
--> statement-breakpoint
CREATE INDEX "induction_submission_cycle_department_lookup" ON "induction_submission" USING btree ("cycle_id","department_id","created_at");