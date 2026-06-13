/**
 * Database Client — Sprint 8B Vercel Postgres Persistence
 *
 * Re-exports the tagged template `sql` from @vercel/postgres.
 * This is the single import point for all SQL queries in the application.
 *
 * @vercel/postgres auto-reads POSTGRES_URL / POSTGRES_URL_NON_POOLING
 * from the environment — no manual pool configuration required.
 *
 * Server-side only. Never import in client components.
 * Never expose POSTGRES_URL via NEXT_PUBLIC_* variables.
 */
export { sql } from '@vercel/postgres';
