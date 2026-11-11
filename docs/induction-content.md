# Induction forms

Inductions use the shared event layout, with a department-interest preset for
applications. The first cycle is `/events/inductions-2026`. Students apply to at
most two departments with an institute email and no account.

## Content ownership

| File                                    | Edit here                                                       |
| --------------------------------------- | --------------------------------------------------------------- |
| `lib/content/departments.ts`            | Stable department IDs, names, descriptions, and colors          |
| `lib/content/home.ts`                   | Department leads, photos, and profile links                     |
| `lib/content/events/inductions-2026.ts` | Event copy, carousel, availability, featuring, next steps, FAQs |
| `lib/content/inductions/2026.ts`        | Department order, previews, expectations, and questions         |
| `lib/content/inductions/index.ts`       | Register another cycle                                          |
| `lib/inductions/schema.ts`              | Common questions, labels, validation, and the department cap    |

AI, Creatives, App Development, Web Development, UI/UX, and DevSecOps use the
chapter-supplied questions (a domain may have up to 16). Web's resume is a Google Drive link rather than an upload, because the
app has no file storage. The remaining departments
have editable sample prompts marked `sample: true`; replace those when the leads
supply final questions. CP's preparation syllabus is split into first- and
second-year sections, technical assessment/interview rounds, and selection criteria.

Seven departments have expectations supplied by the chapter; Creatives also has a
closing `outro` line. Women in Tech takes no applications (`applications: false`):
members of any department are part of it, so it stays on the event page with its
`membership` note but is left out of the department picker, and the server rejects
it. A department that takes applications needs questions; one that does not has
none. Do not invent requirements for departments without expectations. App
Development has common basics and four alternative tracks: Flutter, React Native,
Swift, and Kotlin. Its React Native track was drafted to mirror the others; the
department lead reviews it.

Every question has a stable ID, label, optional hint, and required flag. Supported
inputs are `text` (short answer), `textarea`, `choice`, `multi` (choose any),
`ranking`, and `links`.
Choice and ranking options have stable IDs and display labels; choice options with
a `description` render as tiles. A `links` answer is a list of up to `maxLinks`
web addresses, each with a short note about what it shows; `notes: false` drops
the note for a single obvious link such as a resume. `multi` answers are stored in
the options' order. Missing schemes become
`https://`, blank rows are ignored, and exports print `note: url` lines. Ranking answers contain all
option IDs exactly once, in preference order; they support drag handles and
keyboard/touch-friendly up/down buttons. Text inputs have maximum lengths.

A question may use `when: { questionId, equals }` to depend on an earlier choice;
`equals` may be one option ID or a list of them.
The Creatives social-content question appears and becomes required only for Yes.
Hidden answers are excluded from review and submission; the server rejects
unexpected hidden values. Google Drive work links are stored as text, not fetched
or uploaded by the app. Applicants set their link's sharing permissions themselves.

A department may set `note`, a list of paragraphs shown with its lead's photo
above that department's questions. App Development uses it for the lead's welcome
and a reminder about the orientation brownie points form (`/forms/mobile26`).
That form stored only name, branch, and one answer, so applicants are asked to use
the same name and branch, and a yes/no question flags who to look up.

Bump the cycle's `version` when questions, common fields, or validation change.
The current version is 6. Old open tabs must review the current form before
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

The event page has one "Start your application" button. Department cards are for
reading: each shows its lead, a "See what's expected" button that opens a side
sheet (a bottom sheet on phones), and a PDF download. The site tells applicants
that these are expectations, not requirements. `/events/<slug>/apply?department=<id>`
preselects a department, and older `/events/<slug>/apply/<department>` links
redirect there. In the application, a chosen department's tile and question page
also offer its expectations and PDF.

## Expectation PDFs

`npm run inductions:pdfs` builds one A4 PDF per department with expectations into
`public/inductions/<cycle>/`, using XeLaTeX, the chapter logo, and Instrument Sans
(`scripts/induction-expectations/`, OFL-licensed). Each PDF shows the department,
its lead, its preview, and its expectations. Departments without expectations get
no PDF. Rebuild after editing expectations, previews, titles, or leads; a unit test
compares `manifest.json` with the current content and fails until you do.

One application has four steps:

1. **About you**: name, gender, institute email, roll number, phone, year of study, branch, LinkedIn
   profile, GitHub profile, portfolio, ORCID iD, other clubs, and why GDGC.
   Everything except portfolio and ORCID is required. Students who are not in
   another club write "None".
2. **Departments**: choose up to the cycle's `maxDepartments` (default 2). The
   order of choosing is the preference; students can swap first and second.
3. **Questions**: one page per chosen department, with its expectations a click away.
4. **Review**: everything once, then a single submit. The confirmation offers a
   PDF of what was just submitted, built in the browser with jsPDF from data
   already on the page; nothing extra is fetched from the server. Its fonts and
   logo live in `public/inductions/`. Duplicate submissions get no PDF, since the
   saved answers may differ. The confirmation also links the GDGC Connect WhatsApp
   group and shows call and WhatsApp buttons for the leads of the domains just
   applied to, plus the chapter leads. Those numbers live in
   `lib/content/inductions/contacts.ts`. Each saved row records `created_at`, the
   submission time, exported as "Submitted at".

Profile links are accepted with or without `https://` and `www.`, then saved in
one canonical form: `https://www.linkedin.com/in/<name>`, `https://github.com/<user>`,
and `https://orcid.org/<id>`. LinkedIn must be a `/in/` profile and GitHub a
single valid username. ORCID iDs must pass their check digit. Roll numbers are
stored uppercase.

The draft lives in the shared layout and in `sessionStorage` for that tab, keyed by
cycle and version, so a refresh keeps answers and closing the tab discards them.
There is no cross-device resume.

Induction pages add short interaction feedback: card emphasis, sheet entry,
form-step entries, progress checks, focus/choice feedback, animated ranking moves,
and submission confirmation. Movement respects `prefers-reduced-motion`; there is
no automatic looping or delayed access to controls. Reading surfaces stay solid.

Each chosen department becomes one `induction_submission` row with the complete
common-answer snapshot, its `preference`, department answers, form version,
original question labels, and timestamps. Unique cycle + department + email and
cycle + department + roll number constraints prevent double submits.

The department cap counts every row in the cycle that matches the normalized email
**or** roll number. Submissions lock on the address, email, and roll number, so
concurrent tabs cannot exceed it. A student who applied to one department can come
back later and add one more; its preference continues from the saved rows.
Departments already on file are reported as received and never changed. A request
that would exceed the cap saves nothing. Database attempt limits use HMAC hashes for
the address and email.

The email suffix and roll number check format, not ownership. This public flow
has no lookup or editing endpoint for stored responses, and cap errors do not name
the departments already on file. Application errors retain the draft.

## Export for the induction team

There is no public response list or staff dashboard. An authorized operator can
run a read-only export with existing database access. Apply migrations first and
set database environment variables as described in the environment guide.

```sh
node --import tsx scripts/export-inductions.ts --cycle inductions-2026 --department web > ~/Downloads/inductions-web.csv
```

Omit `--department` for all departments. Use stable department IDs from the catalog.
The export has one row per department with its preference, roll number, profile
links, common answers, and the original department question text, even after
questions change. It quotes CSV fields and neutralizes
spreadsheet formulas. Store exports privately, outside the repository and public
web directories. Do not commit or share applicants' contact details publicly.
The existing local registration-sheet tool is separate and remains unchanged.

## Before a production release

The current production deploy helper builds and restarts the app; it does not
apply database migrations. An authorized operator must apply the additive
`induction_submission` migration (`0003_induction_submission`) from the reviewed release checkout before
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
duplicates, preference order, the two-department cap by email and by roll number,
concurrent submissions racing for the last slot, and rate limits.
CI runs it against its PostgreSQL service after applying migrations.

Check the homepage, archive, event, and application routes on desktop and phone.
Verify the expectations sheet, keyboard navigation, error focus, the two-choice
limit, preference swapping, review/editing, refresh recovery, success, duplicate,
and cap messages, and closed forms. Keep `/forms/mobile26` and historical event registration behavior intact.
