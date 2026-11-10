import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";
import {
  allEvents,
  getEvent,
  getEventById,
  getFeaturedEvents,
} from "@/lib/content/events";
import { getProblemStatements } from "@/lib/content/problem-statements";
import {
  canRegister,
  eventCover,
  eventDate,
  eventProblems,
  eventSummary,
  eventTime,
  registrationStatus,
  visibleSections,
} from "./helpers";
import { defineEvent, eventSchema } from "./schema";

function workshop() {
  return defineEvent({
    id: "learning-session",
    slug: "learning-session",
    title: "Learning session",
    kind: "workshop",
    summary: "A hands-on learning session.",
    status: "scheduled",
    visibility: "published",
    color: "blue",
    date: {
      startsAt: "2027-01-10T10:00:00+05:30",
      endsAt: "2027-01-10T12:00:00+05:30",
    },
    media: [
      {
        id: "poster",
        src: "/images/events/bootcamp.jpg",
        alt: "Session poster",
      },
    ],
    registration: {
      mode: "internal",
      form: "campus",
      state: "open",
      opensAt: "2027-01-01T00:00:00+05:30",
      closesAt: "2027-01-09T23:59:00+05:30",
    },
    sections: [
      {
        id: "learn",
        type: "list",
        title: "What you'll learn",
        items: ["Build a small app"],
      },
      {
        id: "resources",
        type: "resources",
        title: "Resources",
        links: [{ title: "Slides", url: "https://example.com/slides" }],
      },
    ],
  });
}

test("a workshop publishes without prizes, results, tracks, or problem statements", () => {
  const event = workshop();
  assert.equal(eventProblems(event), undefined);
  assert.deepEqual(
    visibleSections(event).map((section) => section.id),
    ["learn", "resources"],
  );
  assert.equal(event.media.length, 1);
});

test("sections remain ordered and optional, independent of event kind", () => {
  const event = workshop();
  event.sections.reverse();
  event.sections[0].hidden = true;
  event.sections.push({
    id: "prizes",
    type: "prizes",
    title: "Contest prizes",
    items: [{ title: "Winner", description: "A book" }],
  });
  assert.equal(eventSchema.safeParse(event).success, true);
  assert.deepEqual(
    visibleSections(event).map((section) => section.id),
    ["learn", "prizes"],
  );
});

test("registration enforces both time boundaries on the server", () => {
  const event = workshop();
  assert.equal(
    canRegister(event, Date.parse("2026-12-31T23:59:59+05:30")),
    false,
  );
  assert.equal(
    canRegister(event, Date.parse("2027-01-01T00:00:00+05:30")),
    true,
  );
  assert.equal(
    canRegister(event, Date.parse("2027-01-09T23:59:00+05:30")),
    false,
  );
});

test("registration displays upcoming before opening and closes at the end of a local calendar day", () => {
  const event = workshop();
  assert.equal(
    registrationStatus(event, Date.parse("2026-12-31T23:59:59+05:30")),
    "upcoming",
  );
  event.date = { startsOn: "2027-01-10", timezone: "Asia/Kolkata" };
  event.registration = { mode: "internal", form: "campus", state: "open" };
  assert.equal(
    canRegister(event, Date.parse("2027-01-10T23:59:59+05:30")),
    true,
  );
  assert.equal(
    canRegister(event, Date.parse("2027-01-11T00:00:00+05:30")),
    false,
  );
});

test("workshop resources can link to local materials but cannot use executable URLs", () => {
  const event = workshop();
  const resources = event.sections.find(
    (section) => section.type === "resources",
  )!;
  resources.links[0].url = "/resources/workshop-slides.pdf";
  assert.equal(eventSchema.safeParse(event).success, true);
  resources.links[0].url = "javascript:alert(1)";
  assert.equal(eventSchema.safeParse(event).success, false);
});

test("past, cancelled, postponed, closed and waitlisted events cannot accept registrations", () => {
  const now = Date.parse("2027-01-05T00:00:00+05:30");
  for (const status of ["completed", "cancelled", "postponed"] as const)
    assert.equal(canRegister({ ...workshop(), status }, now), false);
  for (const state of ["closed", "waitlist", "upcoming"] as const) {
    const event = workshop();
    if (event.registration.mode === "internal")
      event.registration.state = state;
    assert.equal(canRegister(event, now), false);
  }
  const event = workshop();
  if (event.registration.mode === "internal")
    delete event.registration.closesAt;
  assert.equal(
    canRegister(event, Date.parse("2027-01-10T12:00:00+05:30")),
    false,
  );
});

test("registration modes cannot mix internal forms and external providers", () => {
  const event = workshop();
  assert.equal(
    eventSchema.safeParse({
      ...event,
      registration: { mode: "external", state: "open" },
    }).success,
    false,
  );
  assert.equal(
    eventSchema.safeParse({
      ...event,
      registration: {
        mode: "external",
        state: "open",
        provider: "Community platform",
        url: "javascript:alert(1)",
      },
    }).success,
    false,
  );
  assert.equal(
    eventSchema.safeParse({
      ...event,
      registration: {
        mode: "external",
        state: "open",
        provider: "Community platform",
        url: "https://example.com/register",
      },
    }).success,
    true,
  );
});

test("published content rejects missing media, duplicate IDs and invalid cover references", () => {
  const event = workshop();
  assert.equal(eventSchema.safeParse({ ...event, media: [] }).success, false);
  assert.equal(
    eventSchema.safeParse({ ...event, visibility: "draft", media: [] }).success,
    true,
  );
  assert.equal(
    eventSchema.safeParse({ ...event, coverId: "missing" }).success,
    false,
  );
  assert.equal(
    eventSchema.safeParse({ ...event, media: [...event.media, event.media[0]] })
      .success,
    false,
  );
  assert.equal(
    eventSchema.safeParse({
      ...event,
      sections: [...event.sections, event.sections[0]],
    }).success,
    false,
  );
});

test("invalid dates and registration windows fail validation", () => {
  const event = workshop();
  assert.equal(
    eventSchema.safeParse({
      ...event,
      date: {
        startsAt: "2027-01-10T12:00:00Z",
        endsAt: "2027-01-10T10:00:00Z",
      },
    }).success,
    false,
  );
  assert.equal(
    eventSchema.safeParse({ ...event, date: { timezone: "invalid/timezone" } })
      .success,
    false,
  );
  assert.equal(
    eventSchema.safeParse({
      ...event,
      registration: {
        mode: "internal",
        form: "campus",
        state: "open",
        opensAt: "2027-01-10T00:00:00Z",
        closesAt: "2027-01-09T00:00:00Z",
      },
    }).success,
    false,
  );
});

test("unknown tracks and duplicate statements cannot publish", () => {
  const event = structuredClone(getEvent("minimol")!);
  const challenges = event.sections.find(
    (section) => section.type === "challenges",
  )!;
  challenges.statements[0].trackId = "missing";
  assert.equal(eventSchema.safeParse(event).success, false);
  challenges.statements[0].trackId = challenges.tracks[0].id;
  challenges.statements.push(challenges.statements[0]);
  assert.equal(eventSchema.safeParse(event).success, false);
});

test("custom tracks work before winners exist, with derived challenge counts", () => {
  const event = workshop();
  event.sections.push({
    id: "challenge",
    title: "Practice challenge",
    type: "challenges",
    tracks: [{ id: "beginners", title: "Beginners" }],
    statements: [
      {
        id: "practice",
        trackId: "beginners",
        title: "Build a thing",
        tagline: "Practice",
        objective: "Build an app",
        highlights: [],
        hardRequirements: [],
        strictlyProhibited: [],
      },
    ],
  });
  assert.equal(eventSchema.safeParse(event).success, true);
  assert.equal(eventProblems(event)?.tracks[0].count, 1);
  assert.equal(eventProblems(event)?.statements[0].trackId, "beginners");
  event.sections[event.sections.length - 1].hidden = true;
  assert.equal(eventProblems(event), undefined);
});

test("the archive preserves event IDs, routes, assets, winners and MiniMol challenge links", () => {
  assert.deepEqual(
    allEvents.map((event) => event.id),
    ["inductions-2026", "minimol", "orientation-2026", "hackmol", "winterfest", "bootcamp"],
  );
  for (const event of allEvents) {
    assert.equal(getEvent(event.slug), getEventById(event.id));
    for (const slide of event.media)
      assert.equal(existsSync(`public${slide.src}`), true, slide.src);
    assert.ok(eventCover(event));
  }
  const minimol = getEvent("minimol")!;
  assert.equal(minimol.status, "completed");
  assert.ok(getFeaturedEvents().some((event) => event.id === minimol.id));
  assert.equal(
    minimol.sections.find((section) => section.type === "results")?.items
      .length,
    4,
  );
  assert.deepEqual(
    getProblemStatements("minimol")?.tracks.map((track) => [
      track.id,
      track.count,
    ]),
    [
      ["main", 3],
      ["freshers", 1],
    ],
  );
  assert.equal(getProblemStatements("bootcamp"), undefined);
  assert.equal(getEvent("missing"), undefined);
});

test("historical unknown times stay absent and calendar dates respect their precision", () => {
  assert.equal(eventTime(getEvent("winterfest")!), undefined);
  assert.equal(eventDate(getEvent("bootcamp")!), undefined);
  assert.equal(
    eventDate({
      date: {
        startsOn: "2027-01-10",
        endsOn: "2027-01-11",
        timezone: "America/Los_Angeles",
      },
    }),
    "10 January 2027 – 11 January 2027",
  );
  assert.match(eventTime(workshop())!, /10:00.*12:00/);
});

test("archive summaries do not serialize full challenge specifications", () => {
  const summary = eventSummary(getEvent("minimol")!);
  assert.equal("sections" in summary, false);
  assert.equal(summary.media.length, 1);
  assert.equal("website" in eventSummary(getEvent("hackmol")!), false);
});
