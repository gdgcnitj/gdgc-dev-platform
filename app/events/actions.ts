"use server";

import { createHmac, randomUUID } from "node:crypto";
import { and, eq, gt, lt, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { allEvents } from "@/lib/content/home";
import { registrationSchema, type RegistrationResult } from "@/lib/content/registration";
import { db, eventRegistration, registrationAttempt } from "@/lib/database";

const attemptLimit = 10;
const attemptWindowMs = 60 * 60 * 1000;

function nationalPhone(value: string) {
  return value.replace(/\D/g, "").slice(-10);
}

function databaseError(error: unknown): { code?: string; constraint?: string } | undefined {
  if (!error || typeof error !== "object") return undefined;
  const record = error as { code?: unknown; constraint?: unknown; cause?: unknown };
  if (typeof record.code === "string") {
    return { code: record.code, constraint: typeof record.constraint === "string" ? record.constraint : undefined };
  }
  return databaseError(record.cause);
}

async function clientHash() {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) return null;
  const headerStore = await headers();
  const address = headerStore.get("x-real-ip") ?? "unknown";
  return createHmac("sha256", secret).update(address).digest("hex");
}

export async function registerForEvent(eventId: string, input: unknown): Promise<RegistrationResult> {
  const event = allEvents.find((item) => item.id === eventId);
  if (!event?.registration) return { ok: false, error: "Registration is not open for this event." };

  const parsed = registrationSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Check the highlighted fields and try again." };

  const hash = await clientHash();
  if (!hash || !process.env.DATABASE_URL) {
    return { ok: false, error: "Registration is unavailable right now. Please try again later." };
  }

  const now = Date.now();
  const windowStart = new Date(now - attemptWindowMs).toISOString();
  const dayAgo = new Date(now - 24 * attemptWindowMs).toISOString();

  try {
    await db.delete(registrationAttempt).where(lt(registrationAttempt.createdAt, dayAgo));
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(registrationAttempt)
      .where(and(
        eq(registrationAttempt.eventId, eventId),
        eq(registrationAttempt.clientHash, hash),
        gt(registrationAttempt.createdAt, windowStart),
      ));
    if (count >= attemptLimit) {
      return { ok: false, error: "Too many attempts. Please try again in a little while." };
    }
    await db.insert(registrationAttempt).values({ eventId, clientHash: hash });
    if (parsed.data.company?.trim()) {
      return { ok: false, error: "Check the highlighted fields and try again." };
    }

    await db.insert(eventRegistration).values({
      id: randomUUID(),
      eventId,
      name: parsed.data.name,
      email: parsed.data.email,
        rollNumber: parsed.data.rollNumber.toUpperCase(),
        course: parsed.data.course,
        branch: parsed.data.branch,
      year: parsed.data.year,
      phone: nationalPhone(parsed.data.phone),
      interests: [...new Set(parsed.data.interests)],
    });
  } catch (error) {
    const failure = databaseError(error);
    if (failure?.code === "23505" && failure.constraint === "event_registration_event_email_unique") {
      return { ok: false, error: "This email is already registered for the event." };
    }
    if (failure?.code === "23505" && failure.constraint === "event_registration_event_roll_unique") {
      return { ok: false, error: "This roll number is already registered for the event." };
    }
    console.error("registration failed", failure?.code ?? "unknown");
    return { ok: false, error: "Registration is unavailable right now. Please try again later." };
  }

  return { ok: true };
}
