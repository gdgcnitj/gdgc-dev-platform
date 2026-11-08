import { bootcamp } from "./bootcamp";
import { hackmol } from "./hackmol";
import { minimol } from "./minimol";
import { orientation } from "./orientation-2026";
import { winterfest } from "./winterfest";
import type { ClubEvent } from "@/lib/events/schema";
import { eventStart } from "@/lib/events/helpers";

const events: ClubEvent[] = [
  minimol,
  orientation,
  hackmol,
  winterfest,
  bootcamp,
];

// Validate the registry, including drafts, so a future publication cannot shadow a URL.
for (const key of ["id", "slug"] as const) {
  if (new Set(events.map((event) => event[key])).size !== events.length)
    throw new Error(`Event ${key}s must be unique`);
}
for (const event of events) {
  if (
    event.parentEventId &&
    !events.some((parent) => parent.id === event.parentEventId)
  )
    throw new Error(`Unknown parent for ${event.id}`);
  const seen = new Set([event.id]);
  let parentId = event.parentEventId;
  while (parentId) {
    if (seen.has(parentId))
      throw new Error(`Event parent cycle at ${event.id}`);
    seen.add(parentId);
    parentId = events.find((parent) => parent.id === parentId)?.parentEventId;
  }
}

export const allEvents = events
  .filter((event) => event.visibility === "published")
  .sort((a, b) => eventStart(b) - eventStart(a));

export function getEvent(slug: string) {
  return allEvents.find((event) => event.slug === slug);
}

export function getEventById(id: string) {
  return allEvents.find((event) => event.id === id);
}

export function getFeaturedEvents(now = Date.now()) {
  return allEvents.filter(
    (event) =>
      event.homepage?.featured &&
      event.status !== "cancelled" &&
      (!event.homepage.featuredUntil ||
        now < Date.parse(event.homepage.featuredUntil)),
  );
}

export function getRelatedEvents(event: ClubEvent) {
  return allEvents.filter(
    (other) =>
      other.id !== event.id &&
      (other.parentEventId === event.id ||
        event.parentEventId === other.id ||
        (event.seriesId && event.seriesId === other.seriesId)),
  );
}
