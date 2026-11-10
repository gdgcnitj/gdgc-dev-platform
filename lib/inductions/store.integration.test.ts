import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import type { PreparedSubmission } from "./submission";
import { and, eq } from "drizzle-orm";

test(
  "PostgreSQL saves separate department snapshots, deduplicates concurrent submits, and enforces attempt budgets",
  {
    skip:
      !process.env.INDUCTION_TEST_DATABASE_URL &&
      "Set INDUCTION_TEST_DATABASE_URL to an isolated test database",
  },
  async () => {
    const url = process.env.INDUCTION_TEST_DATABASE_URL!;
    assert.match(
      new URL(url).pathname,
      /(?:_test|_ci)$/u,
      "Use an explicitly named test/CI database",
    );
    process.env.DATABASE_URL = url;
    const { db, inductionSubmission, registrationAttempt } = await import(
      "@/lib/database"
    );
    const { storeInductionSubmission } = await import("./store");
    const cycleId = `test-${randomUUID()}`;
    const scope = `induction:${cycleId}`;
    const hashes = {
      address: `address-${randomUUID()}`,
      email: `email-${randomUUID()}`,
    };
    const data: PreparedSubmission = {
      eventId: "test-event",
      cycleId,
      departmentId: "web",
      name: "Test Student",
      email: "test@nitj.ac.in",
      phone: "9876543210",
      branch: "Other",
      otherClubs: "None",
      whyGdgc: "Testing an isolated submission.",
      answers: { interest: "First department answer" },
      formVersion: 1,
      questionSnapshot: [
        { id: "interest", label: "Original question", type: "textarea" },
      ],
    };
    try {
      const concurrent = await Promise.all([
        storeInductionSubmission(data, hashes),
        storeInductionSubmission(data, hashes),
      ]);
      assert.equal(
        concurrent.filter((result) => result.ok && result.status === "created")
          .length,
        1,
      );
      assert.equal(
        concurrent.filter(
          (result) => result.ok && result.status === "duplicate",
        ).length,
        1,
      );
      const second = await storeInductionSubmission(
        {
          ...data,
          departmentId: "ai",
          name: "Updated name",
          answers: { interest: "Second department answer" },
        },
        hashes,
      );
      assert.ok(second.ok && second.status === "created");
      const rows = await db
        .select()
        .from(inductionSubmission)
        .where(eq(inductionSubmission.cycleId, cycleId));
      assert.equal(rows.length, 2);
      assert.equal(
        rows.find((row) => row.departmentId === "web")?.name,
        "Test Student",
      );
      assert.equal(
        rows.find((row) => row.departmentId === "ai")?.answers.interest,
        "Second department answer",
      );
      assert.equal(rows[0].questionSnapshot[0].label, "Original question");

      // One student can complete all eight departments within the email budget.
      for (const departmentId of [
        "ui",
        "cp",
        "mobile",
        "wit",
        "devsecops",
        "creatives",
      ] as const)
        assert.deepEqual(
          await storeInductionSubmission(
            {
              ...data,
              departmentId,
              ...(departmentId === "creatives"
                ? {
                    answers: {
                      interest: ["video-editing", "poster-designing"],
                    },
                  }
                : {}),
            },
            hashes,
          ),
          { ok: true, status: "created" },
        );
      const [creativeRow] = await db
        .select()
        .from(inductionSubmission)
        .where(
          and(
            eq(inductionSubmission.cycleId, cycleId),
            eq(inductionSubmission.departmentId, "creatives"),
          ),
        );
      assert.deepEqual(creativeRow.answers.interest, [
        "video-editing",
        "poster-designing",
      ]);
      await db.insert(registrationAttempt).values(
        Array.from({ length: 24 }, () => ({
          eventId: scope,
          clientHash: hashes.email,
        })),
      );
      const limited = await storeInductionSubmission(
        { ...data, departmentId: "web" },
        hashes,
      );
      assert.ok(!limited.ok && limited.code === "limited");
      assert.equal(
        (
          await db
            .select()
            .from(inductionSubmission)
            .where(
              and(
                eq(inductionSubmission.cycleId, cycleId),
                eq(inductionSubmission.departmentId, "web"),
              ),
            )
        ).length,
        1,
      );
    } finally {
      await db
        .delete(inductionSubmission)
        .where(eq(inductionSubmission.cycleId, cycleId));
      await db
        .delete(registrationAttempt)
        .where(eq(registrationAttempt.eventId, scope));
      await db.$client.end();
    }
  },
);
