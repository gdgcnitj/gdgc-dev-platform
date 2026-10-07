export * from "@/lib/database/schema";
export * from "@/lib/database/relations";

import fs from "node:fs";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

const connectionString = process.env.DATABASE_URL;

function databaseSsl() {
  if (!connectionString) return undefined;
  let hostname = "";
  try {
    hostname = new URL(connectionString).hostname;
  } catch {
    return undefined;
  }
  if (hostname === "localhost" || hostname === "127.0.0.1") return undefined;
  const caPath = process.env.DATABASE_CA_PATH ?? "/etc/gdgc/rds-ca.pem";
  return { rejectUnauthorized: true, ca: fs.readFileSync(caPath, "utf8") };
}

const pool = new Pool({
  connectionString,
  ssl: databaseSsl(),
});

export const db = drizzle(pool);
