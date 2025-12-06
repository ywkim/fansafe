import { drizzle } from 'drizzle-orm/libsql';

import * as schema from './schema';

// libSQL supports both local files and Turso remote:
// - Local: DATABASE_URL=file:./local.db
// - Turso: DATABASE_URL=libsql://xxx.turso.io + DATABASE_AUTH_TOKEN=xxx

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}

export const db = drizzle({
  connection: {
    url: databaseUrl,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
  schema,
});

export * from './schema';
