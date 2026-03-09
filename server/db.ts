import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

let pool = null;
let db = null;

if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  db = drizzle(pool, { schema });
  console.log("Database connected");
} else {
  console.log("DATABASE_URL not found. Running without database.");
}

export { pool, db };
