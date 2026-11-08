import { z } from "zod";
import { eventKinds } from "./labels";

const id = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase, hyphenated ID");
const copy = z.string().trim().min(1);
const webUrl = z
  .url()
  .refine((value) => /^https?:\/\//.test(value), "Use an HTTP or HTTPS URL");
const resource = z.object({
  title: copy,
  url: z
    .string()
    .refine(
      (value) => webUrl.safeParse(value).success || /^\/(?!\/)/.test(value),
      "Use an HTTP(S) URL or a local path",
    ),
  description: copy.optional(),
});
const section = z.object({
  id,
  title: copy,
  navLabel: copy.optional(),
  hidden: z.boolean().optional(),
});

export const problemStatementSchema = z.object({
  id,
  trackId: id,
  title: copy,
  tagline: copy,
  badge: copy.optional(),
  icon: z.enum(["cpu", "storage", "car", "people", "layers"]).optional(),
  highlights: z.array(copy).default([]),
  objective: copy,
  runtime: z
    .object({ target: copy, description: copy, mandate: copy.optional() })
    .optional(),
  specs: z.array(z.object({ label: copy, value: copy })).optional(),
  architecture: z
    .object({
      summary: copy,
      steps: z.array(z.object({ step: copy, description: copy })).optional(),
      notes: z.array(copy).optional(),
    })
    .optional(),
  coreFeatures: z
    .array(z.object({ title: copy, description: copy }))
    .optional(),
  hardRequirements: z.array(copy).default([]),
  strictlyProhibited: z.array(copy).default([]),
  bonusPoints: z.array(copy).optional(),
});

const sections = z.discriminatedUnion("type", [
  section.extend({
    type: z.literal("story"),
    paragraphs: z.array(copy).min(1),
    cards: z.array(z.object({ title: copy, description: copy })).optional(),
  }),
  section.extend({
    type: z.literal("notice"),
    label: copy.optional(),
    body: copy,
  }),
  section.extend({
    type: z.literal("list"),
    items: z.array(copy).min(1),
    style: z.enum(["bullets", "numbered"]).default("bullets"),
  }),
  section.extend({
    type: z.literal("schedule"),
    items: z
      .array(
        z.object({
          time: copy,
          title: copy,
          description: copy.optional(),
          resources: z.array(resource).optional(),
        }),
      )
      .min(1),
  }),
  section.extend({
    type: z.literal("speakers"),
    people: z
      .array(
        z.object({
          name: copy,
          role: copy.optional(),
          bio: copy.optional(),
          image: copy.optional(),
          url: webUrl.optional(),
        }),
      )
      .min(1),
  }),
  section.extend({
    type: z.literal("resources"),
    links: z.array(resource).min(1),
  }),
  section.extend({
    type: z.literal("faq"),
    items: z.array(z.object({ question: copy, answer: copy })).min(1),
  }),
  section.extend({
    type: z.literal("prizes"),
    items: z
      .array(
        z.object({
          title: copy,
          description: copy,
          highlight: z.boolean().optional(),
        }),
      )
      .min(1),
  }),
  section.extend({
    type: z.literal("challenges"),
    description: copy.optional(),
    tracks: z
      .array(
        z.object({
          id: id.refine(
            (value) => value !== "all",
            "The track ID 'all' is reserved for the archive filter",
          ),
          title: copy,
          description: copy.optional(),
        }),
      )
      .min(1),
    statements: z.array(problemStatementSchema).default([]),
  }),
  section.extend({
    type: z.literal("results"),
    items: z
      .array(
        z.object({
          trackId: id.optional(),
          rank: copy.optional(),
          team: copy,
          prize: copy.optional(),
          description: copy.optional(),
        }),
      )
      .min(1),
  }),
]);

const registrationDetails = z.object({
  state: z.enum(["upcoming", "open", "waitlist", "closed"]),
  opensAt: z.iso.datetime({ offset: true }).optional(),
  closesAt: z.iso.datetime({ offset: true }).optional(),
  fee: copy.optional(),
  eligibility: copy.optional(),
  teamSize: copy.optional(),
});
const registration = z.discriminatedUnion("mode", [
  z.object({ mode: z.literal("none") }),
  registrationDetails.extend({
    mode: z.literal("internal"),
    form: z.literal("campus"),
  }),
  registrationDetails.extend({
    mode: z.literal("external"),
    provider: copy,
    url: webUrl,
  }),
]);

export const eventSchema = z
  .object({
    // Keep IDs stable: existing registration rows reference this value.
    id,
    slug: id,
    title: copy,
    kind: z.enum(eventKinds),
    categoryLabel: copy.optional(),
    summary: copy,
    status: z.enum([
      "scheduled",
      "live",
      "completed",
      "postponed",
      "cancelled",
    ]),
    visibility: z.enum(["draft", "published"]).default("draft"),
    color: z.enum(["blue", "green", "yellow", "red"]),
    date: z
      .object({
        label: copy.optional(),
        timeLabel: copy.optional(),
        startsOn: z.iso.date().optional(),
        endsOn: z.iso.date().optional(),
        startsAt: z.iso.datetime({ offset: true }).optional(),
        endsAt: z.iso.datetime({ offset: true }).optional(),
        timezone: z
          .string()
          .refine((value) => {
            try {
              new Intl.DateTimeFormat("en", { timeZone: value });
              return true;
            } catch {
              return false;
            }
          }, "Use a valid IANA timezone")
          .default("Asia/Kolkata"),
      })
      .optional(),
    location: z
      .object({
        mode: z.enum(["in-person", "online", "hybrid"]),
        name: copy.optional(),
        url: webUrl.optional(),
      })
      .optional(),
    media: z.array(
      z.object({
        id,
        src: z.string().startsWith("/images/"),
        alt: copy,
        caption: copy.optional(),
        kind: z.enum(["photo", "poster", "illustration"]).default("photo"),
      }),
    ),
    coverId: id.optional(),
    registration: registration.default({ mode: "none" }),
    homepage: z
      .object({
        featured: z.boolean().default(false),
        featuredUntil: z.iso.datetime({ offset: true }).optional(),
      })
      .optional(),
    website: z.object({ label: copy, url: webUrl }).optional(),
    seriesId: id.optional(),
    parentEventId: id.optional(),
    sections: z.array(sections),
  })
  .superRefine((event, context) => {
    const issue = (message: string, path: (string | number)[]) =>
      context.addIssue({ code: "custom", message, path });
    const unique = (values: string[], path: string) => {
      if (new Set(values).size !== values.length)
        issue(`Duplicate ${path} IDs`, [path]);
    };
    if (event.visibility === "published" && !event.media.length)
      issue("Published events need at least one carousel slide", ["media"]);
    unique(
      event.media.map((item) => item.id),
      "media",
    );
    if (event.coverId && !event.media.some((item) => item.id === event.coverId))
      issue("Cover must reference a carousel slide", ["coverId"]);
    unique(
      event.sections.map((item) => item.id),
      "sections",
    );
    if (event.sections.filter((item) => item.type === "challenges").length > 1)
      issue("Use one challenges section per event", ["sections"]);
    if (
      event.date?.startsAt &&
      event.date.endsAt &&
      Date.parse(event.date.endsAt) < Date.parse(event.date.startsAt)
    )
      issue("End must follow start", ["date", "endsAt"]);
    if (
      event.date?.startsOn &&
      event.date.endsOn &&
      event.date.endsOn < event.date.startsOn
    )
      issue("End date must follow start date", ["date", "endsOn"]);
    if (
      event.registration.mode !== "none" &&
      event.registration.opensAt &&
      event.registration.closesAt &&
      Date.parse(event.registration.closesAt) <=
        Date.parse(event.registration.opensAt)
    )
      issue("Registration close must follow open", [
        "registration",
        "closesAt",
      ]);
    const challenges = event.sections.find(
      (item) => item.type === "challenges",
    );
    const trackIds = new Set(challenges?.tracks.map((track) => track.id));
    if (challenges) {
      if (trackIds.size !== challenges.tracks.length)
        issue("Track IDs must be unique", ["sections"]);
      if (
        new Set(challenges.statements.map((item) => item.id)).size !==
        challenges.statements.length
      )
        issue("Problem statement IDs must be unique", ["sections"]);
      for (const statement of challenges.statements)
        if (!trackIds.has(statement.trackId))
          issue(`Unknown problem statement track: ${statement.trackId}`, [
            "sections",
          ]);
    }
    for (const result of event.sections.flatMap((item) =>
      item.type === "results" ? item.items : [],
    )) {
      if (result.trackId && !trackIds.has(result.trackId))
        issue(`Unknown results track: ${result.trackId}`, ["sections"]);
    }
  });

export type ClubEvent = z.infer<typeof eventSchema>;
export type EventKind = ClubEvent["kind"];
export type EventStatus = ClubEvent["status"];
export type EventSection = ClubEvent["sections"][number];
export type EventMedia = ClubEvent["media"][number];
export type ProblemStatement = z.infer<typeof problemStatementSchema>;
export type ChallengesSection = Extract<EventSection, { type: "challenges" }>;
export type EventSummary = Pick<
  ClubEvent,
  | "id"
  | "slug"
  | "title"
  | "kind"
  | "categoryLabel"
  | "summary"
  | "color"
  | "date"
  | "location"
  | "media"
  | "coverId"
>;

export function defineEvent(input: z.input<typeof eventSchema>): ClubEvent {
  return eventSchema.parse(input);
}
