-- =====================================================
-- WILMAXPOS 1.0 — MULTI-TENANT MIGRATION
-- Adds business isolation: each business has its own
-- UUID that filters ALL data tables via business_id.
-- =====================================================

-- ─────────────────────────────────────────────────────────
-- 1. BUSINESSES TABLE (one row = one client/negocio)
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS businesses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  business_code TEXT UNIQUE,          -- short memorable code e.g. WILMAX01
  owner_email   TEXT,
  owner_phone   TEXT,
  address       TEXT,
  plan          TEXT DEFAULT 'starter' CHECK (plan IN ('starter','pro','enterprise')),
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_businesses_code ON businesses(business_code);

ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON businesses FOR ALL USING (true);

-- ─────────────────────────────────────────────────────────
-- 2. ADD business_id TO ALL TABLES
-- ─────────────────────────────────────────────────────────
ALTER TABLE users               ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id);
ALTER TABLE clients             ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id);
ALTER TABLE products            ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id);
ALTER TABLE kits                ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id);
ALTER TABLE kit_products        ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id);
ALTER TABLE suppliers           ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id);
ALTER TABLE employees           ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id);
ALTER TABLE employee_loans      ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id);
ALTER TABLE employee_payments   ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id);
ALTER TABLE sales               ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id);
ALTER TABLE sale_items          ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id);
ALTER TABLE purchases           ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id);
ALTER TABLE purchase_items      ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id);
ALTER TABLE expenses            ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id);
ALTER TABLE gift_cards          ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id);
ALTER TABLE vouchers            ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id);
ALTER TABLE stores              ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id);
ALTER TABLE cash_registers      ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id);
ALTER TABLE activity_logs       ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id);
ALTER TABLE inventory_movements ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id);
ALTER TABLE documents           ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id);
ALTER TABLE paused_sales        ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id);
ALTER TABLE product_categories  ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id);

-- Also add the migration columns from wilmaxpos_migration.sql
ALTER TABLE clients   ADD COLUMN IF NOT EXISTS last_name   TEXT;
ALTER TABLE clients   ADD COLUMN IF NOT EXISTS province    TEXT;
ALTER TABLE clients   ADD COLUMN IF NOT EXISTS last_visit  TEXT;
ALTER TABLE products  ADD COLUMN IF NOT EXISTS supplier_name TEXT;
ALTER TABLE sales     ADD COLUMN IF NOT EXISTS register_name TEXT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS file_url    TEXT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS file_type   TEXT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS file_size   BIGINT DEFAULT 0;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS uploaded_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE kits      ADD COLUMN IF NOT EXISTS category    TEXT;

-- ─────────────────────────────────────────────────────────
-- 3. CREATE INDEXES for business_id queries
-- ─────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_users_business           ON users(business_id);
CREATE INDEX IF NOT EXISTS idx_clients_business         ON clients(business_id);
CREATE INDEX IF NOT EXISTS idx_products_business        ON products(business_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_business       ON suppliers(business_id);
CREATE INDEX IF NOT EXISTS idx_employees_business       ON employees(business_id);
CREATE INDEX IF NOT EXISTS idx_sales_business           ON sales(business_id);
CREATE INDEX IF NOT EXISTS idx_purchases_business       ON purchases(business_id);
CREATE INDEX IF NOT EXISTS idx_expenses_business        ON expenses(business_id);
CREATE INDEX IF NOT EXISTS idx_vouchers_business        ON vouchers(business_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_business   ON activity_logs(business_id);
CREATE INDEX IF NOT EXISTS idx_inventory_mov_business   ON inventory_movements(business_id);
