import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://lpm_user:lpm_password@localhost:5432/lpm_db";

// Global client to reuse connection across requests
const client = postgres(connectionString, { max: 10 });
export const db = drizzle(client, { schema });
