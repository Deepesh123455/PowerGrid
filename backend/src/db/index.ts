import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.js';
import config from '../config/index.js';

if (!config.database.url) {
  throw new Error('DATABASE_URL is missing in config');
}

const { Pool } = pg;

// Using Pool for safe and lightweight connection management
export const pool = new Pool({
  connectionString: config.database.url,
  // Industry standard pool settings for robustness
  max: 20, // Increased to handle more concurrent transactions
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 20000, // Increased to 20s to prevent timeout errors
  ssl: {
    rejectUnauthorized: false, // Required for many cloud providers like Supabase
  },
});

export const db = drizzle(pool, { schema });

export type Db = typeof db;
