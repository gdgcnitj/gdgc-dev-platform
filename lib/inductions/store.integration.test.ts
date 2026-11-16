import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import type { PreparedSubmission } from "./submission";
import { and, asc, eq } from "drizzle-orm";

test(
  "PostgreSQL enforces snapshots, domain caps, attempt budgets, and transaction-time deadlines",
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
      year: "1st year",
      gender: "Prefer not to say",
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

      const deadlineIn = async (milliseconds: number) => {
        const result = await db.$client.query(
          "select clock_timestamp() + ($1 * interval '1 millisecond') as deadline",
          [milliseconds],
        );
        return (result.rows[0].deadline as Date).toISOString();
      };
      const timely = await storeInductionSubmission(
        { ...data, email: "timely@nitj.ac.in", rollNumber: "23103051", closesAt: await deadlineIn(60000) },
        hashes(),
      );
      assert.ok(timely.ok && timely.status === "created");

      // A stale application-server timestamp cannot override the DB clock.
      const expired = await storeInductionSubmission(
        { ...data, email: "expired@nitj.ac.in", rollNumber: "23103052", closesAt: await deadlineIn(-1000) },
        hashes(),
        new Date(Date.now() - 86400000),
      );
      assert.ok(!expired.ok && expired.code === "closed");
      assert.equal((await rows()).filter(row => row.email === "expired@nitj.ac.in").length, 0);

      // The transaction starts in time but crosses the deadline while queued.
      const queuedHashes = hashes();
      const blocker = await db.$client.connect();
      let queued: Promise<Awaited<ReturnType<typeof storeInductionSubmission>>>;
      let queuedBeforeCutoff = false;
      try {
        await blocker.query("begin");
        await blocker.query("select pg_advisory_xact_lock(hashtextextended($1, 0))", [
          `${scope}:address:${queuedHashes.address}`,
        ]);
        const closesAt = await deadlineIn(2000);
        queued = storeInductionSubmission(
          { ...data, email: "queued@nitj.ac.in", rollNumber: "23103053", closesAt },
          queuedHashes,
        );
        await blocker.query("select pg_sleep(2.1)");
        const waiting = await blocker.query(
          "select exists(select 1 from pg_locks l join pg_stat_activity a on a.pid=l.pid where l.locktype='advisory' and not l.granted and a.xact_start < $1::timestamptz) as waiting",
          [closesAt],
        );
        queuedBeforeCutoff = waiting.rows[0].waiting;
      } finally {
        await blocker.query("rollback");
        blocker.release();
      }
      const queuedResult = await queued!;
      assert.equal(queuedBeforeCutoff, true, "The request must actually wait across the cutoff");
      assert.ok(!queuedResult.ok && queuedResult.code === "closed");
      assert.equal((await rows()).filter(row => row.email === "queued@nitj.ac.in").length, 0);

      // A test-only trigger makes both inserts finish after the deadline.
      // A sequence is non-transactional, proving the inserts were attempted even
      // though the application rows and attempt records must all roll back.
      const marker = `deadline_${randomUUID().replaceAll("-", "")}`;
      const trigger = `${marker}_trigger`;
      const crossingHashes = hashes();
      try {
        const closesAt = await deadlineIn(3000);
        await db.$client.query(`create sequence ${marker}`);
        await db.$client.query(`create function ${marker}() returns trigger language plpgsql as $$
          begin
            if NEW.cycle_id = '${cycleId}' and NEW.email = 'crossing@nitj.ac.in' then
              perform nextval('${marker}');
              perform pg_sleep(greatest(0, extract(epoch from ('${closesAt}'::timestamptz - clock_timestamp()))) + 0.05);
            end if;
            return NEW;
          end $$`);
        await db.$client.query(`create trigger ${trigger} after insert on induction_submission for each row execute function ${marker}()`);
        const crossing = await storeInductionSubmission(
          { ...data, email: "crossing@nitj.ac.in", rollNumber: "23103054", closesAt,
            applications: [application("web"), application("ai")] },
          crossingHashes,
        );
        assert.ok(!crossing.ok && crossing.code === "closed");
        const attempted = await db.$client.query(`select last_value, is_called from ${marker}`);
        assert.equal(attempted.rows[0].is_called, true);
        assert.equal(Number(attempted.rows[0].last_value), 2);
        assert.equal((await rows()).filter(row => row.email === "crossing@nitj.ac.in").length, 0);
        const attempts = await db.select().from(registrationAttempt).where(and(
          eq(registrationAttempt.eventId, scope),
          eq(registrationAttempt.clientHash, crossingHashes.address),
        ));
        assert.equal(attempts.length, 0);
      } finally {
        await db.$client.query(`drop trigger if exists ${trigger} on induction_submission`);
        await db.$client.query(`drop function if exists ${marker}()`);
        await db.$client.query(`drop sequence if exists ${marker}`);
      }
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
