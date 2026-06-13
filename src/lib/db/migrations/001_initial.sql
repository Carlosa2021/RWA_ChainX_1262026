-- ============================================================
-- Migration 001 — Initial Schema
-- Sprint 8B: Vercel Postgres Persistence Layer
--
-- Run once via:
--   psql $POSTGRES_URL_NON_POOLING -f src/lib/db/migrations/001_initial.sql
--
-- Safe to re-run: uses IF NOT EXISTS throughout.
-- ============================================================

-- ============================================================
-- TABLE: tenants
-- Core tenant record. One row per white-label client.
-- ============================================================
CREATE TABLE IF NOT EXISTS tenants (
  id                TEXT        PRIMARY KEY,          -- e.g. "chainx", "alzira"
  brand_name        TEXT        NOT NULL,
  brand_url         TEXT        NOT NULL,
  support_email     TEXT        NOT NULL,
  primary_color     TEXT        NOT NULL DEFAULT '#2563EB',
  secondary_color   TEXT        NOT NULL DEFAULT '#0B1220',
  favicon_url       TEXT,                             -- nullable — optional branding
  show_infra_notice BOOLEAN     NOT NULL DEFAULT true,
  plan              TEXT        NOT NULL DEFAULT 'starter',  -- starter | pro | enterprise
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- TABLE: tenant_domains
-- One tenant may own multiple hostnames (primary + aliases).
-- Each hostname must resolve to exactly one tenant.
-- ============================================================
CREATE TABLE IF NOT EXISTS tenant_domains (
  hostname             TEXT        PRIMARY KEY,       -- e.g. "invest.alzira.com"
  tenant_id            TEXT        NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  verified             BOOLEAN     NOT NULL DEFAULT false,
  verification_status  TEXT        NOT NULL DEFAULT 'pending'
                                   CHECK (verification_status IN ('pending', 'verified', 'failed')),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- TABLE: tenant_branding
-- JSONB overrides for BrandingConfig fields.
-- Allows future fields (fonts, logos, portal settings) without
-- schema migrations.
-- Merged at runtime: DEFAULTS < tenant_branding.config < localStorage
-- ============================================================
CREATE TABLE IF NOT EXISTS tenant_branding (
  tenant_id   TEXT        PRIMARY KEY REFERENCES tenants(id) ON DELETE CASCADE,
  config      JSONB       NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_tenant_domains_tenant_id
  ON tenant_domains(tenant_id);

CREATE INDEX IF NOT EXISTS idx_tenant_branding_tenant_id
  ON tenant_branding(tenant_id);
