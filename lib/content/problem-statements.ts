import { getEventById } from "@/lib/content/events";
import { eventProblems } from "@/lib/events/helpers";

export function getProblemStatements(eventId: string) {
  const event = getEventById(eventId);
  return event && eventProblems(event);
}

export type EventProblemData = NonNullable<
  ReturnType<typeof getProblemStatements>
>;
