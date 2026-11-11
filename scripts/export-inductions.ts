import "dotenv/config";
import { parseArgs } from "node:util";
import { and, asc, eq } from "drizzle-orm";
import { getInductionCycle } from "@/lib/content/inductions";
import { db, inductionSubmission } from "@/lib/database";
import { inductionCsv } from "@/lib/inductions/csv";

async function main() {
  try {
    const { values } = parseArgs({
      options: { cycle: { type: "string" }, department: { type: "string" } },
      strict: true,
    });
    const cycle = values.cycle && getInductionCycle(values.cycle);
    if (!cycle)
      throw new Error(
        "Choose a known cycle with --cycle, for example --cycle inductions-2026.",
      );
    if (
      values.department &&
      !cycle.departments.some(
        (department) => department.id === values.department,
      )
    )
      throw new Error("Choose a department configured for this cycle.");
    if (!process.env.DATABASE_URL)
      throw new Error("Set DATABASE_URL before exporting responses.");
    const rows = await db
      .select()
      .from(inductionSubmission)
      .where(
        and(
          eq(inductionSubmission.cycleId, cycle.id),
          values.department
            ? eq(inductionSubmission.departmentId, values.department)
            : undefined,
        ),
      )
      .orderBy(asc(inductionSubmission.createdAt));
    process.stdout.write(inductionCsv(rows));
  } catch (error) {
    // Deliberately avoid printing database errors, which may contain response data.
    console.error(
      error instanceof Error && !("code" in error) && !("query" in error)
        ? error.message
        : "The induction export failed. Check database access and migrations.",
    );
    process.exitCode = 1;
  } finally {
    await db.$client.end();
  }
}

void main();
