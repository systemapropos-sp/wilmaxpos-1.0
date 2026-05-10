-- =====================================================
-- WILMAXPOS 1.0 — MIGRATION: Add missing columns
-- Run this in Supabase SQL Editor AFTER the main schema
-- =====================================================

-- Clients: add last_name, photo_url
ALTER TABLE clients ADD COLUMN IF NOT EXISTS last_name  TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS province   TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS last_visit TEXT;

-- Products: add supplier_name (store as string instead of FK)
ALTER TABLE products ADD COLUMN IF NOT EXISTS supplier_name TEXT;

-- Sales: add register_name
ALTER TABLE sales ADD COLUMN IF NOT EXISTS register_name TEXT;

-- Documents: update to match app (file_url, file_type, file_size, uploaded_at, entity_id)
ALTER TABLE documents ADD COLUMN IF NOT EXISTS file_url    TEXT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS file_type   TEXT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS file_size   BIGINT DEFAULT 0;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS uploaded_at TIMESTAMPTZ DEFAULT NOW();

-- Kits: add category
ALTER TABLE kits ADD COLUMN IF NOT EXISTS category TEXT;

-- Suppliers: add notes column (if not already there)
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS notes TEXT;

-- =====================================================
-- COMBINED SCHEMA + MIGRATION (run this if starting fresh)
-- =====================================================
-- You can also run the full wilmaxpos_schema.sql and this
-- migration together in one execution in the SQL editor.
