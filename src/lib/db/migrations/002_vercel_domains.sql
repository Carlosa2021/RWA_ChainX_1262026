-- ============================================================
-- Migration 002 — Vercel Domains Column Extension
-- Sprint 9.2A: Domain Model Extension
--
-- Extends tenant_domains with columns needed for future
-- Vercel Domains API integration.
--
-- Run once via:
--   psql $POSTGRES_URL_NON_POOLING -f src/lib/db/migrations/002_vercel_domains.sql
--
-- Safe to re-run: uses ADD COLUMN IF NOT EXISTS throughout.
-- No existing columns are removed or altered.
-- Backward compatible: all new columns are nullable with no NOT NULL constraint.
-- ============================================================

-- ============================================================
-- Vercel integration columns
-- These are populated by POST /api/admin/domains/register (Sprint 9.2B).
-- They are NULL for domains registered before Vercel integration.
-- ============================================================

-- Vercel's internal identifier for this domain registration.
-- Used to query verification status: GET /v10/projects/{project}/domains/{hostname}
ALTER TABLE tenant_domains
  ADD COLUMN IF NOT EXISTS vercel_domain_id TEXT;

-- DNS TXT record that the tenant must add to their DNS zone.
-- Name component, e.g. "_vercel" or "_vercel.invest"
ALTER TABLE tenant_domains
  ADD COLUMN IF NOT EXISTS txt_name TEXT;

-- DNS TXT record value (verification token issued by Vercel).
ALTER TABLE tenant_domains
  ADD COLUMN IF NOT EXISTS txt_value TEXT;

-- DNS CNAME record name (for subdomain delegation, e.g. "invest").
-- NULL for apex domains (Vercel uses A records instead of CNAME for apex).
ALTER TABLE tenant_domains
  ADD COLUMN IF NOT EXISTS cname_name TEXT;

-- DNS CNAME record value (Vercel target, e.g. "cname.vercel-dns.com").
ALTER TABLE tenant_domains
  ADD COLUMN IF NOT EXISTS cname_value TEXT;

-- ============================================================
-- Verification lifecycle columns
-- ============================================================

-- Timestamp when domain verification was confirmed by Vercel.
-- NULL until verification_status = 'verified'.
ALTER TABLE tenant_domains
  ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;

-- Last error message returned by Vercel when verification failed or the
-- domain registration encountered an error.
-- NULL when verification_status is 'pending', 'registering', 'registered', or 'verified'.
ALTER TABLE tenant_domains
  ADD COLUMN IF NOT EXISTS verification_error TEXT;

-- Timestamp of the last time we queried Vercel for this domain's status.
-- Used to avoid polling too frequently.
ALTER TABLE tenant_domains
  ADD COLUMN IF NOT EXISTS last_checked_at TIMESTAMPTZ;

-- ============================================================
-- Audit columns
-- ============================================================

-- Wallet address of the PLATFORM_ADMIN who registered this domain.
-- Populated by the admin route at domain creation time.
ALTER TABLE tenant_domains
  ADD COLUMN IF NOT EXISTS created_by TEXT;

-- Timestamp of the last update to any column in this row.
-- Updated by any write operation (registration, status change, etc.).
ALTER TABLE tenant_domains
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;

-- ============================================================
-- Verification status constraint evolution
--
-- The existing CHECK constraint only allows: pending | verified | failed
-- We need to add: registering | registered
--
-- Postgres does not support ALTER CONSTRAINT directly.
-- Strategy: drop the old constraint, recreate with expanded values.
-- This is safe — no data changes, only allowed values expand.
--
-- The constraint name was set implicitly by Postgres at table creation.
-- We use a DO block to handle the case where the constraint was
-- already updated by a previous run of this migration.
-- ============================================================

DO $$
DECLARE
  _cname TEXT;
BEGIN
  -- Dynamically find and drop ALL CHECK constraints that reference verification_status,
  -- regardless of the auto-generated constraint name Postgres assigned in migration 001.
  -- This is safe on re-run: if no matching constraint exists the loop simply does nothing.
  FOR _cname IN
    SELECT c.conname
    FROM   pg_constraint c
    JOIN   pg_class      t ON c.conrelid = t.oid
    WHERE  t.relname   = 'tenant_domains'
    AND    c.contype   = 'c'
    AND    pg_get_constraintdef(c.oid) LIKE '%verification_status%'
  LOOP
    EXECUTE format('ALTER TABLE tenant_domains DROP CONSTRAINT %I', _cname);
  END LOOP;

  -- Recreate with the expanded set of allowed values.
  ALTER TABLE tenant_domains
    ADD CONSTRAINT tenant_domains_verification_status_check
    CHECK (
      verification_status IN (
        'pending',
        'registering',
        'registered',
        'verified',
        'failed'
      )
    );
END $$;

-- ============================================================
-- Index: last_checked_at — supports efficient polling queries
-- (find domains where last_checked_at IS NULL or < now() - interval)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_tenant_domains_last_checked_at
  ON tenant_domains(last_checked_at ASC NULLS FIRST)
  WHERE verification_status IN ('registering', 'registered');
