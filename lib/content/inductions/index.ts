import { inductions2026 } from "./2026";
import type { ClubEvent } from "@/lib/events/schema";

export const inductionCycles = [inductions2026];
if (
  new Set(inductionCycles.map((cycle) => cycle.id)).size !==
  inductionCycles.length
)
  throw new Error("Induction cycle IDs must be unique");

export function getInductionCycle(id: string) {
  return inductionCycles.find((cycle) => cycle.id === id);
}

export function getEventInduction(event: ClubEvent) {
  const registration = event.registration;
  if (
    registration.mode !== "internal" ||
    registration.form !== "department-interest"
  )
    return undefined;
  const cycle = getInductionCycle(registration.cycleId);
  return cycle?.eventId === event.id ? cycle : undefined;
}
