import Database from 'better-sqlite3';
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';

import * as sqliteSchema from './schema.sqlite';

// For local development, use SQLite
// In production (Vercel), use PostgreSQL via @vercel/postgres

const hasPostgres = !!process.env.POSTGRES_URL;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let db: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let tradeSafetyChecks: any;

if (hasPostgres) {
  // Dynamic import for PostgreSQL (only in production)
  throw new Error(
    'PostgreSQL mode requires dynamic import. Use getDb() for production.'
  );
} else {
  // SQLite for local development
  const sqlite = new Database('./local_database.db');

  // Create table if not exists
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS trade_safety_checks (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      input_text TEXT NOT NULL,
      llm_analysis TEXT NOT NULL,
      risk_score INTEGER NOT NULL,
      expert_advice TEXT,
      expert_reviewed INTEGER NOT NULL DEFAULT 0,
      expert_reviewed_at INTEGER,
      expert_reviewed_by TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS ix_trade_safety_checks_user_id ON trade_safety_checks(user_id);
    CREATE INDEX IF NOT EXISTS ix_trade_safety_checks_expert_reviewed ON trade_safety_checks(expert_reviewed);
  `);

  db = drizzleSqlite(sqlite, { schema: sqliteSchema });
  tradeSafetyChecks = sqliteSchema.tradeSafetyChecks;
}

export { db, tradeSafetyChecks };

// Re-export types
export type { TradeSafetyCheck, NewTradeSafetyCheck } from './schema.sqlite';
