import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const { Pool } = pg;

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create Prisma client with PostgreSQL adapter
const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
  log: ['query', 'error', 'warn'],
});

export default prisma;
export { pool };