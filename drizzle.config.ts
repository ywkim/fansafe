import { existsSync } from 'fs';
import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// Load .env.local only if it exists (for local development)
if (existsSync('.env.local')) {
  config({ path: '.env.local' });
}

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
});
