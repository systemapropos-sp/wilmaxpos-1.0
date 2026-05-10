-- =====================================================
-- WILMAXPOS 1.0 - SUPABASE SCHEMA
-- Project: xvkorpygwxqpwolhlaap.supabase.co
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────
-- USERS / AUTH
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT,
  pin           TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'cashier' CHECK (role IN ('admin','cashier','seller','manager')),
  is_active     BOOLEAN DEFAULT TRUE,
  avatar        TEXT,
  phone         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- STORES
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS stores (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  address     TEXT,
  phone       TEXT,
  email       TEXT,
  logo_url    TEXT,
  tax_id      TEXT,
  currency    TEXT DEFAULT 'RD$',
  tax_rate    NUMERIC(5,2) DEFAULT 18,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- CASH REGISTERS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cash_registers (
  id             SERIAL PRIMARY KEY,
  name           TEXT NOT NULL,
  store_id       INTEGER REFERENCES stores(id),
  is_open        BOOLEAN DEFAULT FALSE,
  current_amount NUMERIC(12,2) DEFAULT 0,
  opened_at      TIMESTAMPTZ,
  opened_by      TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- CLIENTS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clients (
  id              SERIAL PRIMARY KEY,
  name            TEXT NOT NULL,
  email           TEXT,
  phone           TEXT,
  address1        TEXT,
  address2        TEXT,
  company         TEXT,
  tax_id          TEXT,
  credit_balance  NUMERIC(12,2) DEFAULT 0,
  credit_limit    NUMERIC(12,2) DEFAULT 0,
  discount        NUMERIC(5,2) DEFAULT 0,
  notes           TEXT,
  photo_url       TEXT,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- SUPPLIERS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS suppliers (
  id                  SERIAL PRIMARY KEY,
  company             TEXT NOT NULL,
  first_name          TEXT,
  last_name           TEXT,
  email               TEXT,
  phone               TEXT,
  address             TEXT,
  city                TEXT,
  tax_id              TEXT,
  balance             NUMERIC(12,2) DEFAULT 0,
  credit_limit        NUMERIC(12,2) DEFAULT 0,
  total_purchases     NUMERIC(14,2) DEFAULT 0,
  last_purchase_date  DATE,
  notes               TEXT,
  logo_url            TEXT,
  is_active           BOOLEAN DEFAULT TRUE,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- PRODUCT CATEGORIES
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS product_categories (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,
  description TEXT,
  color       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- PRODUCTS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id                         SERIAL PRIMARY KEY,
  barcode                    TEXT,
  name                       TEXT NOT NULL,
  description                TEXT,
  category                   TEXT,
  size                       TEXT,
  unit_of_measure            TEXT DEFAULT 'UNIDAD',
  cost                       NUMERIC(12,2) NOT NULL DEFAULT 0,
  sale_price                 NUMERIC(12,2) NOT NULL DEFAULT 0,
  wholesale_price            NUMERIC(12,2),
  current_stock              NUMERIC(12,4) DEFAULT 0,
  min_stock                  NUMERIC(10,2) DEFAULT 0,
  max_stock                  NUMERIC(10,2),
  is_sellable                BOOLEAN DEFAULT TRUE,
  is_product                 BOOLEAN DEFAULT TRUE,
  is_raw_material            BOOLEAN DEFAULT FALSE,
  is_service                 BOOLEAN DEFAULT FALSE,
  prices_include_tax         BOOLEAN DEFAULT FALSE,
  allow_alternate_description BOOLEAN DEFAULT FALSE,
  has_serial_number          BOOLEAN DEFAULT FALSE,
  is_favorite                BOOLEAN DEFAULT FALSE,
  is_active                  BOOLEAN DEFAULT TRUE,
  image_url                  TEXT,
  supplier_id                INTEGER REFERENCES suppliers(id),
  created_at                 TIMESTAMPTZ DEFAULT NOW(),
  updated_at                 TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_barcode    ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_category   ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active  ON products(is_active);

-- ─────────────────────────────────────────
-- KITS / BUNDLES
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS kits (
  id          SERIAL PRIMARY KEY,
  kit_id      TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  description TEXT,
  cost        NUMERIC(12,2) DEFAULT 0,
  sale_price  NUMERIC(12,2) DEFAULT 0,
  image_url   TEXT,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kit_products (
  id          SERIAL PRIMARY KEY,
  kit_id      INTEGER REFERENCES kits(id) ON DELETE CASCADE,
  product_id  INTEGER REFERENCES products(id),
  quantity    NUMERIC(10,4) DEFAULT 1
);

-- ─────────────────────────────────────────
-- SALES
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sales (
  id              SERIAL PRIMARY KEY,
  sale_id         TEXT NOT NULL UNIQUE,
  date            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  client_id       INTEGER REFERENCES clients(id),
  client_name     TEXT,
  employee        TEXT,
  user_id         INTEGER REFERENCES users(id),
  subtotal        NUMERIC(12,2) DEFAULT 0,
  discount        NUMERIC(12,2) DEFAULT 0,
  tax             NUMERIC(12,2) DEFAULT 0,
  total           NUMERIC(12,2) NOT NULL DEFAULT 0,
  amount_paid     NUMERIC(12,2) DEFAULT 0,
  change_amount   NUMERIC(12,2) DEFAULT 0,
  payment_method  TEXT DEFAULT 'cash',
  status          TEXT DEFAULT 'completed' CHECK (status IN ('completed','credit','partial','cancelled')),
  ncf             TEXT,
  notes           TEXT,
  store_id        INTEGER REFERENCES stores(id),
  register_id     INTEGER REFERENCES cash_registers(id),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sales_date      ON sales(date);
CREATE INDEX IF NOT EXISTS idx_sales_client_id ON sales(client_id);
CREATE INDEX IF NOT EXISTS idx_sales_status    ON sales(status);

-- ─────────────────────────────────────────
-- SALE ITEMS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sale_items (
  id            SERIAL PRIMARY KEY,
  sale_id       INTEGER REFERENCES sales(id) ON DELETE CASCADE,
  product_id    INTEGER REFERENCES products(id),
  product_name  TEXT NOT NULL,
  quantity      NUMERIC(10,4) NOT NULL DEFAULT 1,
  unit_price    NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount      NUMERIC(12,2) DEFAULT 0,
  total         NUMERIC(12,2) NOT NULL DEFAULT 0,
  serial_number TEXT,
  notes         TEXT
);

-- ─────────────────────────────────────────
-- PURCHASES (ÓRDENES DE COMPRA)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS purchases (
  id              SERIAL PRIMARY KEY,
  purchase_id     TEXT NOT NULL UNIQUE,
  date            DATE NOT NULL DEFAULT CURRENT_DATE,
  expected_date   DATE,
  received_date   DATE,
  supplier_id     INTEGER REFERENCES suppliers(id),
  supplier_name   TEXT,
  subtotal        NUMERIC(12,2) DEFAULT 0,
  tax             NUMERIC(12,2) DEFAULT 0,
  discount        NUMERIC(12,2) DEFAULT 0,
  total           NUMERIC(12,2) NOT NULL DEFAULT 0,
  status          TEXT DEFAULT 'pending' CHECK (status IN ('pending','partial','received','cancelled')),
  notes           TEXT,
  invoice_number  TEXT,
  created_by      TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS purchase_items (
  id            SERIAL PRIMARY KEY,
  purchase_id   INTEGER REFERENCES purchases(id) ON DELETE CASCADE,
  product_id    INTEGER REFERENCES products(id),
  product_name  TEXT NOT NULL,
  quantity      NUMERIC(10,4) NOT NULL DEFAULT 1,
  unit_cost     NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount      NUMERIC(12,2) DEFAULT 0,
  total         NUMERIC(12,2) NOT NULL DEFAULT 0,
  received_qty  NUMERIC(10,4) DEFAULT 0
);

-- ─────────────────────────────────────────
-- INVENTORY MOVEMENTS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS inventory_movements (
  id              SERIAL PRIMARY KEY,
  product_id      INTEGER REFERENCES products(id),
  product_name    TEXT NOT NULL,
  type            TEXT NOT NULL CHECK (type IN ('entry','exit','adjustment','return')),
  quantity        NUMERIC(12,4) NOT NULL,
  previous_stock  NUMERIC(12,4) NOT NULL DEFAULT 0,
  new_stock       NUMERIC(12,4) NOT NULL DEFAULT 0,
  reason          TEXT,
  reference_id    INTEGER,
  reference_type  TEXT,
  requires_auth   BOOLEAN DEFAULT FALSE,
  authorized_by   TEXT,
  user_name       TEXT,
  date            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inv_mov_product_id ON inventory_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_inv_mov_date        ON inventory_movements(date);

-- ─────────────────────────────────────────
-- EXPENSES (GASTOS)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS expenses (
  id          SERIAL PRIMARY KEY,
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  category    TEXT NOT NULL,
  description TEXT NOT NULL,
  amount      NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax         NUMERIC(12,2) DEFAULT 0,
  recipient   TEXT,
  approved_by TEXT,
  receipt_url TEXT,
  payment_method TEXT DEFAULT 'cash',
  notes       TEXT,
  created_by  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- EMPLOYEES
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS employees (
  id               SERIAL PRIMARY KEY,
  name             TEXT NOT NULL,
  email            TEXT,
  phone            TEXT,
  position         TEXT,
  department       TEXT,
  salary_biweekly  NUMERIC(12,2) DEFAULT 0,
  salary_monthly   NUMERIC(12,2) DEFAULT 0,
  hire_date        DATE,
  avatar           TEXT,
  total_loans      NUMERIC(12,2) DEFAULT 0,
  total_payments   NUMERIC(12,2) DEFAULT 0,
  is_active        BOOLEAN DEFAULT TRUE,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employee_loans (
  id               SERIAL PRIMARY KEY,
  employee_id      INTEGER REFERENCES employees(id) ON DELETE CASCADE,
  amount           NUMERIC(12,2) NOT NULL DEFAULT 0,
  date             DATE DEFAULT CURRENT_DATE,
  description      TEXT,
  status           TEXT DEFAULT 'pending' CHECK (status IN ('pending','partial','paid')),
  remaining_amount NUMERIC(12,2) DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employee_payments (
  id          SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
  date        DATE DEFAULT CURRENT_DATE,
  amount      NUMERIC(12,2) NOT NULL DEFAULT 0,
  type        TEXT DEFAULT 'salary' CHECK (type IN ('salary','bonus','commission','advance','other')),
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- GIFT CARDS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gift_cards (
  id          SERIAL PRIMARY KEY,
  card_number TEXT NOT NULL UNIQUE,
  value       NUMERIC(12,2) NOT NULL DEFAULT 0,
  balance     NUMERIC(12,2) NOT NULL DEFAULT 0,
  description TEXT,
  is_active   BOOLEAN DEFAULT TRUE,
  issue_date  DATE DEFAULT CURRENT_DATE,
  expiry_date DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- VOUCHERS / NCF (Comprobantes Fiscales)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vouchers (
  id          SERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  series      TEXT,
  type        TEXT,
  "from"      TEXT,
  "to"        TEXT,
  current     TEXT,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- ACTIVITY LOGS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS activity_logs (
  id          SERIAL PRIMARY KEY,
  date        TIMESTAMPTZ DEFAULT NOW(),
  user_name   TEXT,
  controller  TEXT,
  action      TEXT,
  details     TEXT,
  platform    TEXT,
  ip_address  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_date       ON activity_logs(date DESC);
CREATE INDEX IF NOT EXISTS idx_activity_controller ON activity_logs(controller);

-- ─────────────────────────────────────────
-- DOCUMENTS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS documents (
  id           SERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  type         TEXT,
  url          TEXT NOT NULL,
  size         BIGINT DEFAULT 0,
  entity_type  TEXT,
  entity_id    INTEGER,
  uploaded_by  TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- PAUSED SALES
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS paused_sales (
  id          SERIAL PRIMARY KEY,
  sale_id     TEXT NOT NULL UNIQUE,
  client_id   INTEGER REFERENCES clients(id),
  client_name TEXT,
  items       JSONB DEFAULT '[]',
  notes       TEXT,
  paused_by   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────
ALTER TABLE users               ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients             ENABLE ROW LEVEL SECURITY;
ALTER TABLE products            ENABLE ROW LEVEL SECURITY;
ALTER TABLE kits                ENABLE ROW LEVEL SECURITY;
ALTER TABLE kit_products        ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers           ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees           ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_loans      ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_payments   ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales               ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items          ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases           ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_items      ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses            ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_cards          ENABLE ROW LEVEL SECURITY;
ALTER TABLE vouchers            ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs       ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents           ENABLE ROW LEVEL SECURITY;
ALTER TABLE paused_sales        ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores              ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_registers      ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories  ENABLE ROW LEVEL SECURITY;

-- Allow all access for authenticated & anon (app manages auth via PIN)
CREATE POLICY "Allow all"  ON users               FOR ALL USING (true);
CREATE POLICY "Allow all"  ON clients             FOR ALL USING (true);
CREATE POLICY "Allow all"  ON products            FOR ALL USING (true);
CREATE POLICY "Allow all"  ON kits                FOR ALL USING (true);
CREATE POLICY "Allow all"  ON kit_products        FOR ALL USING (true);
CREATE POLICY "Allow all"  ON suppliers           FOR ALL USING (true);
CREATE POLICY "Allow all"  ON employees           FOR ALL USING (true);
CREATE POLICY "Allow all"  ON employee_loans      FOR ALL USING (true);
CREATE POLICY "Allow all"  ON employee_payments   FOR ALL USING (true);
CREATE POLICY "Allow all"  ON sales               FOR ALL USING (true);
CREATE POLICY "Allow all"  ON sale_items          FOR ALL USING (true);
CREATE POLICY "Allow all"  ON purchases           FOR ALL USING (true);
CREATE POLICY "Allow all"  ON purchase_items      FOR ALL USING (true);
CREATE POLICY "Allow all"  ON inventory_movements FOR ALL USING (true);
CREATE POLICY "Allow all"  ON expenses            FOR ALL USING (true);
CREATE POLICY "Allow all"  ON gift_cards          FOR ALL USING (true);
CREATE POLICY "Allow all"  ON vouchers            FOR ALL USING (true);
CREATE POLICY "Allow all"  ON activity_logs       FOR ALL USING (true);
CREATE POLICY "Allow all"  ON documents           FOR ALL USING (true);
CREATE POLICY "Allow all"  ON paused_sales        FOR ALL USING (true);
CREATE POLICY "Allow all"  ON stores              FOR ALL USING (true);
CREATE POLICY "Allow all"  ON cash_registers      FOR ALL USING (true);
CREATE POLICY "Allow all"  ON product_categories  FOR ALL USING (true);

-- ─────────────────────────────────────────
-- DEFAULT SEED DATA
-- ─────────────────────────────────────────
INSERT INTO stores (name, address, phone, currency, tax_rate)
VALUES ('WILMAX POS 1', 'JOSE MARTIN CON 27 DE FEBRERO', '8297179746', 'RD$', 18)
ON CONFLICT DO NOTHING;

INSERT INTO vouchers (description, series, type, "from", "to", current)
VALUES
  ('FACTURA DE CRÉDITO FISCAL', 'B', '01', '00000001', '00000020', 'B0100000001'),
  ('FACTURA DE CONSUMO',        'B', '02', '00000001', '00000020', 'B0200000001'),
  ('NOTA DE DÉBITO',            'B', '03', '00000001', '00000010', 'B0300000001'),
  ('NOTA DE CRÉDITO',           'B', '04', '00000001', '00000010', 'B0400000001'),
  ('COMPROBANTE GUBERNAMENTAL', 'B', '14', '00000001', '00000010', 'B1400000001'),
  ('COMPROBANTE RÉGIMEN ESPECIAL', 'B', '15', '00000001', '00000010', 'B1500000001')
ON CONFLICT DO NOTHING;

-- Default admin user (PIN: 1234)
INSERT INTO users (name, email, pin, role)
VALUES ('Administrador', 'admin@sistema.com', '1234', 'admin')
ON CONFLICT DO NOTHING;
