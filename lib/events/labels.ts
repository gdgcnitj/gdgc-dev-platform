import type { EventKind, EventStatus } from "./schema";

export const eventKinds = [
  "hackathon",
  "workshop",
  "bootcamp",
  "meetup",
  "orientation",
  "festival",
  "other",
] as const;
export const eventKindLabels: Record<EventKind, string> = {
  hackathon: "Hackathon",
  workshop: "Workshop",
  bootcamp: "Bootcamp",
  meetup: "Meetup",
  orientation: "Orientation",
  festival: "Festival",
  other: "Community event",
};
export const eventStatusLabels: Record<EventStatus, string> = {
  scheduled: "Coming up",
  live: "Happening now",
  completed: "Completed",
  postponed: "Postponed",
  cancelled: "Cancelled",
};
