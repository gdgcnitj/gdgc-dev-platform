export * from "@/lib/database/schema";
export * from "@/lib/database/relations";

import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // remind me to remove this in production
  ssl: {
    rejectUnauthorized: false,
  },
});

export const db = drizzle(pool);
