# Induction forms

Inductions use the shared event layout, with a department-interest preset for
applications. The first cycle is `/events/inductions-2026`. Students can apply to
several departments with an institute email and no account.

## Content ownership

| File                                    | Edit here                                                       |
| --------------------------------------- | --------------------------------------------------------------- |
| `lib/content/departments.ts`            | Stable department IDs, names, descriptions, and colors          |
| `lib/content/home.ts`                   | Department leads, photos, and profile links                     |
| `lib/content/events/inductions-2026.ts` | Event copy, carousel, availability, featuring, next steps, FAQs |
| `lib/content/inductions/2026.ts`        | Department order, previews, expectations, and questions         |
| `lib/content/inductions/index.ts`       | Register another cycle                                          |
| `lib/inductions/schema.ts`              | Common questions, labels, and validation                        |

AI and Creatives use the chapter-supplied questions. The remaining departments
have editable sample prompts marked `sample: true`; replace those when the leads
supply final questions. CP's preparation syllabus is split into first- and
second-year sections, technical assessment/interview rounds, and selection criteria.

Six departments have expectations supplied by the chapter. Women in Tech and
Creatives show a pending-copy note. Do not invent their requirements. App
Development has common basics and three alternative track groups.

Every question has a stable ID, label, optional hint, and required flag. Supported
inputs are `text` (short answer), `textarea`, `choice`, and `ranking`. Choice and
ranking options have stable IDs and display labels. Ranking answers contain all
option IDs exactly once, in preference order; they support drag handles and
keyboard/touch-friendly up/down buttons. Text inputs have maximum lengths.

A question may use `when: { questionId, equals }` to depend on an earlier choice.
The Creatives social-content question appears and becomes required only for Yes.
Hidden answers are excluded from review and submission; the server rejects
unexpected hidden values. Google Drive work links are stored as text, not fetched
or uploaded by the app. Applicants set their link's sharing permissions themselves.

Bump the cycle's `version` when questions, common fields, or validation change.
The current version is 2. Old open tabs must review the current form before
submitting. Stored responses retain their version, original server-built question
labels and option labels, and the exact preference order. Exports turn stored
option IDs back into the original readable labels.

## Event configuration

Use `kind: "induction"` and the following registration configuration:

```ts
registration: {
  mode: "internal",
  form: "department-interest",
  cycleId: "inductions-2026",
  state: "open",
}
```

The cycle's `eventId` must match the event's stable ID. Add exactly one visible
`applications` section; its position in the sections array controls the department
grid's position. The hero links to that section. The ordinary campus registration
action cannot submit an induction form.

Unknown interview date, time, venue, and application deadline stay unset. The
scheduled event shows unconfirmed arrangements as "To be announced". Interest
collection can open before the interview arrangements are known. Use the existing
registration state, optional `opensAt`/`closesAt`, and event lifecycle to open or
close applications. Every server submission checks these again. Application routes
render dynamically; public event pages refresh within their 60-second cache period.

Set `homepage.featured: true` for the homepage spotlight. Active events sort above
completed recaps, even without a date. A published event needs a carousel slide;
the supplied flat SVG is original department-themed artwork, not an event photo.

## Application behavior

The public event links to `/events/<slug>/apply/<department>`. The shared layout
keeps common details and per-department drafts in memory while students navigate
between application pages. `/events/<slug>/apply` offers the department choices.
There is no persistent browser storage and no cross-device resume.

The form has three steps: About you, Your interest, and Review. Common details are
name, institute email, phone, branch, other clubs, and why GDGC. Every common field
is required. Students who are not in another club write "None". The
common form is reused rather than imposing the campus event form's roll number,
year, or course fields. Each department requires its own explicit submission.

One `induction_submission` row stores the complete common-answer snapshot and
department answers, form version, original question labels, and timestamps. A
unique cycle + department + normalized email constraint prevents double submits
and races. Later submissions never update earlier answers. Database attempt
limits use HMAC hashes for the address and email; transactions serialize the
attempt budget. The budgets allow all eight forms and many students on a shared
campus connection. Existing event and mobile26 response tables are unchanged.

The email suffix checks format, not ownership. This public flow has no lookup or
editing endpoint for stored responses. Duplicate attempts return a confirmation
without exposing or changing the existing answers. Only newly saved submissions
are marked submitted in the current flow. Application errors retain the draft.

## Export for the induction team

There is no public response list or staff dashboard. An authorized operator can
run a read-only export with existing database access. Apply migrations first and
set database environment variables as described in the environment guide.

```sh
node --import tsx scripts/export-inductions.ts --cycle inductions-2026 --department web > ~/Downloads/inductions-web.csv
```

Omit `--department` for all departments. Use stable department IDs from the catalog.
The export includes common answers and the original department question text for
each response, even after questions change. It quotes CSV fields and neutralizes
spreadsheet formulas. Store exports privately, outside the repository and public
web directories. Do not commit or share applicants' contact details publicly.
The existing local registration-sheet tool is separate and remains unchanged.

## Before a production release

The current production deploy helper builds and restarts the app; it does not
apply database migrations. An authorized operator must apply the additive
`induction_submission` migration from the reviewed release checkout before
switching production to this feature. Do not run it against production as part of
local development.

With the existing server database environment loaded, run from the checkout:

```sh
node --import tsx scripts/migrate-database.ts
```

This command uses the runtime's certificate-verified database connection, including
`DATABASE_CA_PATH` for RDS, and the existing Drizzle migration journal. Confirm
legacy migrations are recorded before applying new ones; do not reset or erase an
existing database to resolve a journal mismatch. The new migration only adds the
induction table and its indexes. Existing registration records remain intact.

## Validation

```sh
npm run check
node --import tsx --test lib/events/events.test.ts lib/inductions/inductions.test.ts
npm run db:migrate
INDUCTION_TEST_DATABASE_URL="$DATABASE_URL" node --import tsx --test lib/inductions/store.integration.test.ts
npm run build
```

The integration test must point to an isolated database whose name ends in `_test`
or `_ci`. It creates and removes only its own randomized cycle, checks concurrent
duplicates, eight department submissions, independent snapshots, and rate limits.
CI runs it against its PostgreSQL service after applying migrations.

Check the homepage, archive, event, and application routes on desktop and phone.
Verify disclosures, keyboard navigation, error focus, review/editing, common-detail
reuse, separate department answers, success and duplicate messages, and closed
forms. Keep `/forms/mobile26` and historical event registration behavior intact.
