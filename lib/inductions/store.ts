import { randomUUID } from "node:crypto";
import { and, eq, gt, lt, or, sql } from "drizzle-orm";
import { db, inductionSubmission, registrationAttempt } from "@/lib/database";
import type { InductionResult } from "./schema";
import type { PreparedSubmission } from "./submission";

// A shared campus address can legitimately submit many students' department forms.
const hourlyLimits = { address: 8000, email: 24 };

export async function storeInductionSubmission(
  data: PreparedSubmission,
  hashes: { address: string; email: string; roll: string },
  now = new Date(),
): Promise<InductionResult> {
  const { applications, maxDepartments, ...common } = data;
  const scope = `induction:${data.cycleId}`;
  const windowStart = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  return db.transaction(async (tx) => {
    // Locks make the attempt budget and department cap atomic for concurrent submissions.
    for (const kind of ["address", "email", "roll"] as const)
      await tx.execute(
        sql`select pg_advisory_xact_lock(hashtextextended(${`${scope}:${kind}:${hashes[kind]}`}, 0))`,
      );
    for (const kind of ["address", "email"] as const) {
      const [{ count }] = await tx
        .select({ count: sql<number>`count(*)::int` })
        .from(registrationAttempt)
        .where(
          and(
            eq(registrationAttempt.eventId, scope),
            eq(registrationAttempt.clientHash, hashes[kind]),
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
    // The same student is matched by either identifier.
    const existing = new Set(
      (
        await tx
          .selectDistinct({ departmentId: inductionSubmission.departmentId })
          .from(inductionSubmission)
          .where(
            and(
              eq(inductionSubmission.cycleId, data.cycleId),
              or(
                eq(inductionSubmission.email, data.email),
                eq(inductionSubmission.rollNumber, data.rollNumber),
              ),
            ),
          )
      ).map((row) => row.departmentId),
    );
    const requested = applications.map((item) => item.departmentId);
    const fresh = applications.filter(
      (item) => !existing.has(item.departmentId),
    );
    const total = existing.size + fresh.length;
    if (!fresh.length)
      return {
        ok: true,
        status: "duplicate",
        departments: requested,
        remaining: Math.max(0, maxDepartments - existing.size),
      };
    if (total > maxDepartments)
      return {
        ok: false,
        code: "full",
        error:
          existing.size >= maxDepartments
            ? `This email or roll number already has applications for ${maxDepartments} domains, the most allowed.`
            : `This email or roll number already has an application on file. You can add ${maxDepartments - existing.size} more domain${maxDepartments - existing.size === 1 ? "" : "s"}.`,
      };
    await tx.insert(inductionSubmission).values(
      fresh.map((item, index) => ({
        id: randomUUID(),
        ...common,
        ...item,
        preference: existing.size + index + 1,
      })),
    );
    return {
      ok: true,
      status: "created",
      departments: requested,
      remaining: maxDepartments - total,
    };
  });
}
