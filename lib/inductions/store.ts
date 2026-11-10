import { randomUUID } from "node:crypto";
import { and, eq, gt, lt, sql } from "drizzle-orm";
import { db, inductionSubmission, registrationAttempt } from "@/lib/database";
import type { InductionResult } from "./schema";
import type { PreparedSubmission } from "./submission";

// A shared campus address can legitimately submit many students' department forms.
const hourlyLimits = { address: 8000, email: 24 };

export async function storeInductionSubmission(
  data: PreparedSubmission,
  hashes: { address: string; email: string },
  now = new Date(),
): Promise<InductionResult> {
  const scope = `induction:${data.cycleId}`;
  const windowStart = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  return db.transaction(async (tx) => {
    // Locks make the attempt budget atomic even for concurrent submissions.
    for (const kind of ["address", "email"] as const) {
      const hash = hashes[kind];
      await tx.execute(
        sql`select pg_advisory_xact_lock(hashtextextended(${`${scope}:${kind}:${hash}`}, 0))`,
      );
      const [{ count }] = await tx
        .select({ count: sql<number>`count(*)::int` })
        .from(registrationAttempt)
        .where(
          and(
            eq(registrationAttempt.eventId, scope),
            eq(registrationAttempt.clientHash, hash),
            gt(registrationAttempt.createdAt, windowStart),
          ),
        );
      if (count >= hourlyLimits[kind])
        return {
          ok: false,
          code: "limited",
          error: "Too many attempts. Please try again in a little while.",
        };
    }
    await tx
      .delete(registrationAttempt)
      .where(
        and(
          eq(registrationAttempt.eventId, scope),
          lt(registrationAttempt.createdAt, dayAgo),
        ),
      );
    await tx.insert(registrationAttempt).values([
      { eventId: scope, clientHash: hashes.address },
      { eventId: scope, clientHash: hashes.email },
    ]);
    const rows = await tx
      .insert(inductionSubmission)
      .values({ id: randomUUID(), ...data })
      .onConflictDoNothing({
        target: [
          inductionSubmission.cycleId,
          inductionSubmission.departmentId,
          inductionSubmission.email,
        ],
      })
      .returning({ id: inductionSubmission.id });
    return { ok: true, status: rows.length ? "created" : "duplicate" };
  });
}
