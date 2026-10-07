"use server";

import { allEvents } from "@/lib/content/home";
import { registrationSchema, type RegistrationResult } from "@/lib/content/registration";

export async function registerForEvent(eventId: string, input: unknown): Promise<RegistrationResult> {
  const event = allEvents.find((item) => item.id === eventId);
  if (!event?.registration) return { ok: false, error: "Registration is not open for this event." };

  const parsed = registrationSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Check the highlighted fields and try again." };

  // Not connected to storage yet. Refuse outside development so no sign-up is silently lost.
  // Save `parsed.data` for `eventId` here, and return an error for a repeated email or roll number.
  if (process.env.NODE_ENV !== "development") {
    return { ok: false, error: "Registration opens soon. Please try again later." };
  }
  return { ok: true };
}
