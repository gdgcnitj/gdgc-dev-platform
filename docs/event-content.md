# Event content

Each event lives in `lib/content/events/<slug>.ts` and calls `defineEvent` from
`lib/events/schema.ts`. Import it into `lib/content/events/index.ts` to register it.
The homepage, archive at `/events`, event page, and optional challenge archive
read the same record. Content is edited in files; this change does not introduce
an admin editor or a new database schema.

## Shared fields

| Field                       | Purpose                                                                                           |
| --------------------------- | ------------------------------------------------------------------------------------------------- |
| `id`                        | Permanent identity used by registrations; never rename an existing ID                             |
| `slug`                      | URL segment at `/events/<slug>`; existing URLs are preserved                                      |
| `title`, `summary`          | Confirmed event name and short description                                                        |
| `kind`                      | `induction`, `hackathon`, `workshop`, `bootcamp`, `meetup`, `orientation`, `festival`, or `other` |
| `categoryLabel`             | Optional display label, such as “Workshops & contests”                                            |
| `status`                    | `scheduled`, `live`, `completed`, `postponed`, or `cancelled`                                     |
| `visibility`                | `draft` (default) or `published`; drafts are excluded from public routes and lookups              |
| `color`                     | `blue`, `green`, `yellow`, or `red`                                                               |
| `date`                      | Optional exact timestamps, calendar dates, or historical labels                                   |
| `location`                  | Optional `mode` (`in-person`, `online`, `hybrid`), `name`, and HTTP(S) `url`                      |
| `media`                     | Ordered carousel slides; published events require at least one                                    |
| `coverId`                   | Optional slide ID for cards; defaults to the first slide                                          |
| `registration`              | `none`, `internal`, or `external`; defaults to `none`                                             |
| `homepage`                  | Optional `featured` and `featuredUntil` placement settings                                        |
| `website`                   | Optional dedicated site, with a display `label` and HTTP(S) `url`                                 |
| `seriesId`, `parentEventId` | Optional grouping for recurring editions or constituent activities                                |
| `sections`                  | Ordered content sections; an empty array is valid                                                 |

Keep status, featuring, and registration independent. A completed event can remain
featured with registration closed. Status is editorial: an elapsed date does not
invent results or turn a postponed event into a completed one. Timed featuring
and registration displays refresh within the pages' 60-second revalidation period.

For exact times, use ISO timestamps with offsets in `startsAt` and `endsAt`:
`2027-01-10T10:00:00+05:30`. `timezone` defaults to `Asia/Kolkata`. For known dates
without known times, use `startsOn` and optional `endsOn` (`YYYY-MM-DD`). Readable
`label` and `timeLabel` override automatic display, including historical ranges
such as “January–February 2025”. Omit unknown data rather than inventing precision.
Completed events omit missing facts; scheduled events show “To be announced”.

## Carousel

A slide contains `id`, local `src` under `/images/`, descriptive `alt`, optional
`caption`, and `kind` (`photo`, `poster`, or `illustration`). Posters and artwork
use a contained fit; photos use a center crop. Use posters before an event and
real photos afterward. Keep a different `coverId` when a card should show the
poster while the event page opens with photos.

Every event uses the same carousel, including events with one slide. Multiple
slides enable swipe, arrow buttons, keyboard browsing, thumbnails, and a full
screen viewer. Single-slide events omit previous/next controls. Motion respects
the visitor's reduced-motion setting; there is no automatic rotation.

## Editable sections

Every section needs a unique `id`, `type`, and editable `title`. Use optional
`navLabel` for a shorter navigation label. Array order is
page order and navigation order. Set `hidden: true` to omit a section from both.
Event kinds do not restrict which sections are allowed. The suggestions in
`lib/events/presets.ts` are authoring starting points only.

| Type           | Content                                                                                                                    |
| -------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `applications` | Department interest forms configured by the event registration preset; see [induction forms](induction-content.md)         |
| `story`        | `paragraphs` and optional `cards` (`title`, `description`)                                                                 |
| `notice`       | `body` and optional short `label`                                                                                          |
| `list`         | `items` and optional `style` (`bullets` or `numbered`); useful for learning outcomes, prerequisites, rules, or eligibility |
| `schedule`     | `items` with `time`, `title`, optional `description` and `resources`                                                       |
| `speakers`     | `people` with `name`, optional `role`, `bio`, `image`, and profile `url`                                                   |
| `resources`    | `links` with `title`, `url`, and optional `description`                                                                    |
| `faq`          | `items` with `question` and `answer`                                                                                       |
| `prizes`       | `items` with `title`, `description`, optional `highlight`                                                                  |
| `challenges`   | `tracks`, optional `description`, and `statements`; usable before results exist                                            |
| `results`      | `items` with `team`, optional `trackId`, `rank`, `prize`, and `description`                                                |

Learning outcomes, prerequisites, and rules can each be a separate `list` section
with a different ID and heading. Bootcamps can use schedule items for individual
sessions, with resources attached to each item. Add child events only when an
activity needs its own page. Parent references must exist and cannot form cycles.

Use one challenges section per event. Give each track a stable ID and reference
it from statements and results. Results can also omit `trackId` for an overall
ranking. Tracks do not require winners. Challenge counts are derived from the
statements; do not maintain separate counts. The challenge viewer derives track choices and its compact index from content.
A single selected challenge is shown as a readable document, with a statement
selector on phones. Choosing another challenge scrolls to its heading after the
new content loads and moves keyboard focus there; reduced motion is respected. Empty tracks are omitted from the viewer. Runtime specifications, architecture, and feature lists
are optional so nontechnical challenges can use the same viewer.

Resource URLs can be HTTP(S) links or local paths such as
`/resources/workshop-slides.pdf`. The track ID `all` is reserved for the filter
that displays every challenge.

`/events/<slug>/problem-statements` exists only when the visible challenges section
has statements. Links accept `?track=<trackId>`, `?ps=<statementId>`, and
`#<statementId>`. Existing MiniMol statement IDs and main/freshers track links are
preserved. Hiding the challenges section also makes its subpage unavailable.

## Workshop example

This is a draft example, not an announced event. Use confirmed details before
publishing; put the actual poster at the referenced image path.

```ts
import { defineEvent } from "@/lib/events/schema";

export const workshop = defineEvent({
  id: "intro-to-mobile",
  slug: "intro-to-mobile",
  title: "Introduction to mobile development",
  kind: "workshop",
  summary: "Build your first small mobile app with the chapter.",
  status: "scheduled",
  visibility: "draft",
  color: "green",
  media: [], // Add at least one actual poster/photo before publication.
  registration: { mode: "none" },
  sections: [
    {
      id: "outcomes",
      type: "list",
      title: "What you'll learn",
      items: ["Build a screen", "Handle a button interaction"],
    },
    {
      id: "prerequisites",
      type: "list",
      title: "Before you arrive",
      items: ["Bring a laptop"],
    },
  ],
});
```

No prize pool, problem statement, or results are required for a workshop. A
workshop with a small contest can add those sections without changing its kind.

## Registration

Internal registration uses the existing campus form and server action:

```ts
registration: {
  mode: "internal",
  form: "campus",
  state: "open",
  opensAt: "2027-01-01T00:00:00+05:30",
  closesAt: "2027-01-09T23:59:00+05:30",
  eligibility: "NIT Jalandhar students",
  fee: "Free",
}
```

The `campus` preset keeps the existing NITJ email, roll number, course, branch,
year, phone, and department-interest validation in `lib/content/registration.ts`.
Inductions use the separate `department-interest` preset and versioned questions,
with their own storage and server action. See [induction forms](induction-content.md).
The campus preset is not a generic team registration form. Use an external provider for other
registration flows until a separately validated internal preset is implemented.

External registration requires `provider` and an HTTP(S) `url`, alongside `state`.
Provider names and participation fees are explicit content; the UI does not assume
Unstop, free admission, team participation, or an offline venue. Optional `teamSize`,
`eligibility`, `fee`, `opensAt`, and `closesAt` work for either registration mode.

Registration states are `upcoming`, `open`, `waitlist`, and `closed`. Only open
registration for a scheduled/live event can accept sign-ups, and only within its
time window and before its known end. The server action checks this on each
submission and only accepts internal registrations. Waitlist and closed states
do not submit to the campus form. Existing deduplication, rate limits, and
honeypot checks remain in place. No database migration is needed.

## Checks

The schema validates IDs, section data, slide references, dates, timezones,
registration windows, and challenge/result track references. The registry rejects
duplicate event IDs/slugs, missing parents, and cycles. Empty optional sections
should be omitted rather than filled with invented content.

```sh
node --import tsx --test lib/events/events.test.ts
npm run check
npm run build
```

CI runs the event tests. Also check the homepage, `/events`, every edited event,
and any challenge links on desktop and phone widths. Verify image crops, the
carousel and full screen viewer, keyboard navigation, search and type filtering, missing-data
states, and that registration actions agree with the event's actual state.
