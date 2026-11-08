import type { EventKind, EventSection } from "./schema";

// Authoring suggestions only. The event's sections array controls the actual order.
// Any event kind can use any section, including prizes at a workshop.
export const eventPresets = {
  workshop: ["story", "list", "speakers", "schedule", "resources", "faq"],
  hackathon: [
    "story",
    "challenges",
    "prizes",
    "schedule",
    "list",
    "results",
    "faq",
  ],
  bootcamp: ["story", "list", "speakers", "schedule", "resources", "faq"],
  meetup: ["story", "speakers", "schedule", "resources"],
  orientation: ["story", "schedule", "resources", "faq"],
  festival: ["story", "schedule", "challenges", "resources", "results"],
  other: ["story", "schedule", "resources"],
} as const satisfies Record<EventKind, readonly EventSection["type"][]>;
