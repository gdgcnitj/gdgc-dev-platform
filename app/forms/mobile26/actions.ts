"use server";

import { createHmac, randomUUID } from "node:crypto";
import { and, eq, gt, lt, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { appDevSchema, type AppDevResult } from "@/lib/content/app-dev";
import { appDevResponse, db, registrationAttempt } from "@/lib/database";

const formId = "mobile26";
const attemptLimit = 10;
const attemptWindowMs = 60 * 60 * 1000;

async function clientHash() {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) return null;
  const headerStore = await headers();
  const address = headerStore.get("x-real-ip") ?? "unknown";
  return createHmac("sha256", secret).update(address).digest("hex");
}

export async function submitAppDevResponse(input: unknown): Promise<AppDevResult> {
  const parsed = appDevSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Check the highlighted fields and try again." };

  const hash = await clientHash();
  if (!hash || !process.env.DATABASE_URL) {
    return { ok: false, error: "The form is unavailable right now. Please try again later." };
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
        eq(registrationAttempt.eventId, formId),
        eq(registrationAttempt.clientHash, hash),
        gt(registrationAttempt.createdAt, windowStart),
      ));
    if (count >= attemptLimit) {
      return { ok: false, error: "Too many attempts. Please try again in a little while." };
    }
    await db.insert(registrationAttempt).values({ eventId: formId, clientHash: hash });
    if (parsed.data.leaveBlank?.trim()) {
      return { ok: false, error: "Check the highlighted fields and try again." };
    }

    await db.insert(appDevResponse).values({
      id: randomUUID(),
      name: parsed.data.name,
      branch: parsed.data.branch,
      answer: parsed.data.answer,
    });
  } catch (error) {
    let code = "unknown";
    let current: unknown = error;
    while (current && typeof current === "object") {
      if ("code" in current && typeof current.code === "string") {
        code = current.code;
        break;
      }
      current = "cause" in current ? current.cause : undefined;
    }
    console.error("app dev response failed", code);
    return { ok: false, error: "The form is unavailable right now. Please try again later." };
  }

  return { ok: true };
}
