import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import type { PreparedSubmission } from "./submission";
import { asc, eq } from "drizzle-orm";

test(
  "PostgreSQL saves preference-ordered snapshots, caps departments per email or roll number, and enforces attempt budgets",
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
    const { db, inductionSubmission, registrationAttempt } =
      await import("@/lib/database");
    const { storeInductionSubmission } = await import("./store");
    const cycleId = `test-${randomUUID()}`;
    const scope = `induction:${cycleId}`;
    const hashes = () => ({
      address: `address-${randomUUID()}`,
      email: `email-${randomUUID()}`,
      roll: `roll-${randomUUID()}`,
    });
    const application = (
      departmentId: PreparedSubmission["applications"][number]["departmentId"],
      answer = `${departmentId} answer`,
    ) => ({
      departmentId,
      answers: { interest: answer },
      questionSnapshot: [
        { id: "interest", label: "Original question", type: "textarea" },
      ],
    });
    const data: PreparedSubmission = {
      eventId: "test-event",
      cycleId,
      maxDepartments: 2,
      name: "Test Student",
      email: "test@nitj.ac.in",
      rollNumber: "23103045",
      phone: "9876543210",
      branch: "Other",
      linkedinUrl: "https://www.linkedin.com/in/test-student",
      githubUrl: "https://github.com/test-student",
      orcidUrl: null,
      portfolioUrl: null,
      otherClubs: "None",
      whyGdgc: "Testing an isolated submission.",
      formVersion: 1,
      applications: [application("web")],
    };
    const rows = () =>
      db
        .select()
        .from(inductionSubmission)
        .where(eq(inductionSubmission.cycleId, cycleId))
        .orderBy(asc(inductionSubmission.preference));
    try {
      const student = hashes();
      const concurrent = await Promise.all([
        storeInductionSubmission(data, student),
        storeInductionSubmission(data, student),
      ]);
      assert.deepEqual(
        concurrent.map((result) => result.ok && result.status).sort(),
        ["created", "duplicate"],
      );
      assert.ok(
        concurrent.every((result) => result.ok && result.remaining === 1),
      );

      // Adding a department later continues the preference order.
      const second = await storeInductionSubmission(
        {
          ...data,
          name: "Updated name",
          applications: [application("web"), application("ai", "Second")],
        },
        student,
      );
      assert.deepEqual(second, {
        ok: true,
        status: "created",
        departments: ["web", "ai"],
        remaining: 0,
      });
      const saved = await rows();
      assert.deepEqual(
        saved.map((row) => [row.departmentId, row.preference, row.name]),
        [
          ["web", 1, "Test Student"],
          ["ai", 2, "Updated name"],
        ],
      );
      assert.equal(saved[0].questionSnapshot[0].label, "Original question");
      assert.equal(saved[0].orcidUrl, null);

      // The cap applies to the same email or the same roll number.
      for (const change of [
        { rollNumber: "99999999" },
        { email: "other@nitj.ac.in" },
      ]) {
        const third = await storeInductionSubmission(
          { ...data, ...change, applications: [application("ui")] },
          hashes(),
        );
        assert.ok(!third.ok && third.code === "full");
      }
      assert.equal((await rows()).length, 2);

      // Concurrent attempts for different departments cannot exceed the cap.
      const racer = {
        ...data,
        email: "racer@nitj.ac.in",
        rollNumber: "23103046",
      };
      const racerHashes = hashes();
      await storeInductionSubmission(
        { ...racer, applications: [application("cp")] },
        racerHashes,
      );
      const race = await Promise.all(
        (["mobile", "wit", "devsecops"] as const).map((departmentId) =>
          storeInductionSubmission(
            { ...racer, applications: [application(departmentId)] },
            racerHashes,
          ),
        ),
      );
      assert.equal(race.filter((result) => result.ok).length, 1);
      assert.equal(
        (await rows()).filter((row) => row.email === racer.email).length,
        2,
      );

      const limitedHashes = hashes();
      await db.insert(registrationAttempt).values(
        Array.from({ length: 24 }, () => ({
          eventId: scope,
          clientHash: limitedHashes.email,
        })),
      );
      const limited = await storeInductionSubmission(
        {
          ...data,
          email: "limited@nitj.ac.in",
          rollNumber: "23103047",
        },
        limitedHashes,
      );
      assert.ok(!limited.ok && limited.code === "limited");
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
