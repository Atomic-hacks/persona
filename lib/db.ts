import "server-only";
import { Pool } from "pg";

let pool: Pool | undefined;

export function getPool() {
  if (pool) return pool;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const sslDisabled =
    process.env.PGSSLMODE === "disable" ||
    /sslmode=disable/i.test(connectionString);

  if (!sslDisabled) {
    // Simplest way to accept self-signed certificates in dev/hosted DBs.
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  }

  pool = new Pool({
    connectionString,
    ssl: sslDisabled ? undefined : { rejectUnauthorized: false },
  });

  return pool;
}
