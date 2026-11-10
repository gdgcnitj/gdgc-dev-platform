import "dotenv/config";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "@/lib/database";

async function main() {
  try {
    if (!process.env.DATABASE_URL)
      throw new Error("missing database configuration");
    // Use the same verified TLS/CA configuration as the application runtime.
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Database migrations applied.");
  } catch {
    console.error(
      "Database migration failed. Check configuration, migration history, and database access before deploying.",
    );
    process.exitCode = 1;
  } finally {
    await db.$client.end();
  }
}

void main();
