import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js';
import { sql as vercelSql } from '@vercel/postgres';
import { drizzle as drizzleVercel } from 'drizzle-orm/vercel-postgres';
import postgres from 'postgres';

import * as schema from './schema';

// Environment detection:
// - VERCEL: Running on Vercel platform (use @vercel/postgres)
// - Otherwise: Local development (use postgres-js with DATABASE_URL)

const isVercel = !!process.env.VERCEL;
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

function createDb() {
  if (isVercel) {
    // Vercel production: use @vercel/postgres (Neon serverless)
    return drizzleVercel(vercelSql, { schema });
  }

  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL or POSTGRES_URL environment variable is required for local development'
    );
  }

  // Local development: use postgres-js
  const client = postgres(databaseUrl);
  return drizzlePostgres(client, { schema });
}

export const db = createDb();

export * from './schema';
