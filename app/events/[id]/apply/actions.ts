"use server";

import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import { getEventById } from "@/lib/content/events";
import { getEventInduction } from "@/lib/content/inductions";
import { prepareInductionSubmission } from "@/lib/inductions/submission";
import { storeInductionSubmission } from "@/lib/inductions/store";
import type { InductionResult } from "@/lib/inductions/schema";

export async function submitInductionInterest(
  eventId: string,
  departmentId: string,
  input: unknown,
): Promise<InductionResult> {
  const event = getEventById(eventId);
  const cycle = event && getEventInduction(event);
  if (!event || !cycle)
    return {
      ok: false,
      code: "closed",
      error: "Interest forms are not open for this event.",
    };
  const prepared = prepareInductionSubmission(
    event,
    cycle,
    departmentId,
    input,
  );
  if (!prepared.ok) return prepared;
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret || !process.env.DATABASE_URL)
    return {
      ok: false,
      error:
        "The form is unavailable right now. Your answers are still here; please try again later.",
    };
  const headerStore = await headers();
  const hash = (value: string) =>
    createHmac("sha256", secret).update(value).digest("hex");
  try {
    return await storeInductionSubmission(prepared.data, {
      address: hash(`address:${headerStore.get("x-real-ip") ?? "unknown"}`),
      email: hash(`email:${prepared.data.email}`),
    });
  } catch {
    // No contact details or free-text responses belong in application logs.
    console.error("induction submission failed");
    return {
      ok: false,
      error:
        "We couldn’t save your form. Your answers are still here; please try again.",
    };
  }
}
