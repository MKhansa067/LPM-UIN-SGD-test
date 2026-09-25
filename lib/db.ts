import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://lpm_user:lpm_password@127.0.0.1:5432/lpm_db";

const isSupabaseOrProd =
  connectionString.includes("supabase") ||
  connectionString.includes("sslmode=require") ||
  process.env.NODE_ENV === "production";

// Global client to reuse connection across requests
// prepare: false is required for Supabase Connection Pooler (pgBouncer)
const client = postgres(connectionString, {
  max: 10,
  prepare: false,
  ssl: isSupabaseOrProd ? "require" : false,
});

export const db = drizzle(client, { schema });
