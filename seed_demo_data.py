#!/usr/bin/env python3
"""
WilmaxPOS 1.0 — Seed demo data into Supabase via REST API
Run AFTER the SQL schema and migration have been applied.
"""
import json, ssl, urllib.request, urllib.error, datetime

SUPABASE_URL = "https://xvkorpygwxqpwolhlaap.supabase.co"
SERVICE_KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2a29ycHlnd3hxcHdvbGhsYWFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzI0MzE1OSwiZXhwIjoyMDkyODE5MTU5fQ.02ZD_urFuYE7QMH86mnzd-ToVMhZlV8i_Pw4HZDoJWo"
HEADERS      = {"apikey": SERVICE_KEY, "Authorization": f"Bearer {SERVICE_KEY}", "Content-Type": "application/json", "Prefer": "return=minimal"}
ctx          = ssl.create_default_context()

def post(table, rows):
    if not rows: return
    if not isinstance(rows, list): rows = [rows]
    body = json.dumps(rows).encode()
    req  = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/{table}", data=body, headers=HEADERS, method="POST")
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=15) as r:
            print(f"  ✅ {table}: {len(rows)} registros insertados")
    except urllib.error.HTTPError as e:
        err = e.read().decode()
        if "already exists" in err or "duplicate" in err.lower():
            print(f"  ℹ️  {table}: datos ya existen, omitido")
        else:
            print(f"  ❌ {table}: HTTP {e.code} — {err[:120]}")

today = datetime.date.today().isoformat()
now   = datetime.datetime.now().isoformat()

print("\n╔══════════════════════════════════════╗")
print("║  WILMAXPOS — SEEDING DEMO DATA       ║")
print("╚══════════════════════════════════════╝\n")

# ── STORES ───────────────────────────────────────────────────────
post("stores", [
    {"name": "WILMAX POS 1", "address": "JOSE MARTIN CON 27 DE FEBRERO", "phone": "8297179746", "currency": "RD$", "tax_rate": 18, "is_active": True},
])

# ── CASH REGISTERS ────────────────────────────────────────────────
post("cash_registers", [
    {"name": "CAJA 1", "store_id": 1, "is_open": False, "current_amount": 0},
    {"name": "CAJA 2", "store_id": 1, "is_open": False, "current_amount": 0},
])

# ── USERS ─────────────────────────────────────────────────────────
post("users", [
    {"name": "Administrador",  "email": "admin@sistema.com",    "pin": "1234", "role": "admin",   "is_active": True},
    {"name": "Carolina Moreno","email": "carolina@tienda.com",  "pin": "5678", "role": "cashier", "is_active": True},
    {"name": "Jose Yepez",     "email": "jose@tienda.com",      "pin": "9012", "role": "manager", "is_active": True},
])

# ── VOUCHERS (NCF) ────────────────────────────────────────────────
post("vouchers", [
    {"description": "FACTURA DE CRÉDITO FISCAL",  "series": "B", "type": "01", "from": "00000001", "to": "00000020", "current": "B0100000001", "is_active": True},
    {"description": "FACTURA DE CONSUMO",          "series": "B", "type": "02", "from": "00000001", "to": "00000020", "current": "B0200000001", "is_active": True},
    {"description": "NOTA DE DÉBITO",              "series": "B", "type": "03", "from": "00000001", "to": "00000010", "current": "B0300000001", "is_active": True},
    {"description": "NOTA DE CRÉDITO",             "series": "B", "type": "04", "from": "00000001", "to": "00000010", "current": "B0400000001", "is_active": True},
    {"description": "COMPROBANTE GUBERNAMENTAL",   "series": "B", "type": "14", "from": "00000001", "to": "00000010", "current": "B1400000001", "is_active": True},
    {"description": "COMPROBANTE RÉGIMEN ESPECIAL","series": "B", "type": "15", "from": "00000001", "to": "00000010", "current": "B1500000001", "is_active": True},
])

# ── CLIENTS ───────────────────────────────────────────────────────
# Note: last_name column requires running wilmaxpos_migration.sql first.
# For now inserting with combined name in the name field.
post("clients", [
    {"name": "Juan Pérez",       "email": "juan@ejemplo.com",   "phone": "8091234567", "company": "Empresa ABC", "credit_balance": 0, "credit_limit": 5000,  "tax_id": "001-1234567-2", "is_active": True, "created_at": now, "address1": ""},
    {"name": "María García",     "email": "maria@ejemplo.com",  "phone": "8097654321", "company": "",            "credit_balance": 0, "credit_limit": 3000,  "tax_id": "",              "is_active": True, "created_at": now, "address1": ""},
    {"name": "Carlos Rodríguez", "email": "carlos@ejemplo.com", "phone": "8491112233", "company": "Corp XYZ",   "credit_balance": 0, "credit_limit": 10000, "tax_id": "",              "is_active": True, "created_at": now, "address1": ""},
    {"name": "Ana Martínez",     "email": "ana@ejemplo.com",    "phone": "8293344556", "company": "",            "credit_balance": 0, "credit_limit": 2000,  "tax_id": "",              "is_active": True, "created_at": now, "address1": ""},
    {"name": "Luis Hernández",   "email": "luis@ejemplo.com",   "phone": "8499988776", "company": "Luis Import", "credit_balance": 0, "credit_limit": 8000,  "tax_id": "",              "is_active": True, "created_at": now, "address1": ""},
])

# ── SUPPLIERS ─────────────────────────────────────────────────────
post("suppliers", [
    {"company": "Distribuidora Nacional S.R.L.", "first_name": "Roberto", "last_name": "Reyes",  "email": "rnacional@dist.com", "phone": "8091230001", "city": "Santo Domingo", "balance": 0, "total_purchases": 0, "is_active": True},
    {"company": "Importaciones ABC",             "first_name": "Sandra",  "last_name": "López",  "email": "sandra@abc.com",     "phone": "8097891234", "city": "Santiago",      "balance": 0, "total_purchases": 0, "is_active": True},
    {"company": "Proveedor Tech RD",             "first_name": "Miguel",  "last_name": "Santos", "email": "tech@prov.com",      "phone": "8494561234", "city": "La Romana",     "balance": 0, "total_purchases": 0, "is_active": True},
])

# ── EMPLOYEES ─────────────────────────────────────────────────────
post("employees", [
    {"name": "Pedro Álvarez",   "email": "pedro@tienda.com",   "phone": "8091112222", "position": "Vendedor", "department": "Ventas",      "salary_biweekly": 7500,  "salary_monthly": 15000, "hire_date": "2023-01-15", "total_loans": 0, "total_payments": 0, "is_active": True},
    {"name": "Lucia Fernández", "email": "lucia@tienda.com",   "phone": "8093334444", "position": "Cajera",   "department": "Cajas",       "salary_biweekly": 6500,  "salary_monthly": 13000, "hire_date": "2023-03-10", "total_loans": 0, "total_payments": 0, "is_active": True},
    {"name": "David Torres",    "email": "david@tienda.com",   "phone": "8495556666", "position": "Almacén",  "department": "Inventario",  "salary_biweekly": 6000,  "salary_monthly": 12000, "hire_date": "2023-06-01", "total_loans": 0, "total_payments": 0, "is_active": True},
])

# ── PRODUCTS ──────────────────────────────────────────────────────
post("products", [
    {"name": "Televisor LED 55\"",   "barcode": "1000001", "category": "Electrónicos", "unit_of_measure": "UNIDAD", "cost": 18000, "sale_price": 24999, "current_stock": 15, "min_stock": 3,  "is_sellable": True, "is_product": True, "is_raw_material": False, "is_service": False, "prices_include_tax": False, "allow_alternate_description": False, "has_serial_number": False, "is_active": True},
    {"name": "Laptop HP 15\"",       "barcode": "1000002", "category": "Electrónicos", "unit_of_measure": "UNIDAD", "cost": 28000, "sale_price": 38500, "current_stock": 8,  "min_stock": 2,  "is_sellable": True, "is_product": True, "is_raw_material": False, "is_service": False, "prices_include_tax": False, "allow_alternate_description": False, "has_serial_number": True,  "is_active": True},
    {"name": "Camisa Polo M",        "barcode": "2000001", "category": "Ropa",         "unit_of_measure": "UNIDAD", "cost": 450,   "sale_price": 850,   "current_stock": 50, "min_stock": 10, "is_sellable": True, "is_product": True, "is_raw_material": False, "is_service": False, "prices_include_tax": False, "allow_alternate_description": False, "has_serial_number": False, "is_active": True},
    {"name": "Camisa Polo L",        "barcode": "2000002", "category": "Ropa",         "unit_of_measure": "UNIDAD", "cost": 450,   "sale_price": 850,   "current_stock": 45, "min_stock": 10, "is_sellable": True, "is_product": True, "is_raw_material": False, "is_service": False, "prices_include_tax": False, "allow_alternate_description": False, "has_serial_number": False, "is_active": True},
    {"name": "Pantalón Jean 32",     "barcode": "2000003", "category": "Ropa",         "unit_of_measure": "UNIDAD", "cost": 850,   "sale_price": 1500,  "current_stock": 30, "min_stock": 5,  "is_sellable": True, "is_product": True, "is_raw_material": False, "is_service": False, "prices_include_tax": False, "allow_alternate_description": False, "has_serial_number": False, "is_active": True},
    {"name": "Aceite Motor 5W30",    "barcode": "3000001", "category": "Líquidos",     "unit_of_measure": "LITRO",  "cost": 320,   "sale_price": 550,   "current_stock": 100,"min_stock": 20, "is_sellable": True, "is_product": True, "is_raw_material": False, "is_service": False, "prices_include_tax": False, "allow_alternate_description": False, "has_serial_number": False, "is_active": True},
    {"name": "Agua Mineral 500ml",   "barcode": "4000001", "category": "Bebidas",      "unit_of_measure": "UNIDAD", "cost": 25,    "sale_price": 50,    "current_stock": 200,"min_stock": 50, "is_sellable": True, "is_product": True, "is_raw_material": False, "is_service": False, "prices_include_tax": False, "allow_alternate_description": False, "has_serial_number": False, "is_active": True},
    {"name": "Jugo natural 1L",      "barcode": "4000002", "category": "Bebidas",      "unit_of_measure": "UNIDAD", "cost": 80,    "sale_price": 150,   "current_stock": 80, "min_stock": 15, "is_sellable": True, "is_product": True, "is_raw_material": False, "is_service": False, "prices_include_tax": False, "allow_alternate_description": False, "has_serial_number": False, "is_active": True},
    {"name": "Mantenimiento PC",     "barcode": "9000001", "category": "Electrónicos", "unit_of_measure": "UNIDAD", "cost": 500,   "sale_price": 1200,  "current_stock": 999,"min_stock": 0,  "is_sellable": True, "is_product": False,"is_raw_material": False, "is_service": True,  "prices_include_tax": False, "allow_alternate_description": True,  "has_serial_number": False, "is_active": True},
    {"name": "Servicio Instalación", "barcode": "9000002", "category": "Electrónicos", "unit_of_measure": "UNIDAD", "cost": 300,   "sale_price": 800,   "current_stock": 999,"min_stock": 0,  "is_sellable": True, "is_product": False,"is_raw_material": False, "is_service": True,  "prices_include_tax": False, "allow_alternate_description": True,  "has_serial_number": False, "is_active": True},
])

# ── GIFT CARDS ────────────────────────────────────────────────────
post("gift_cards", [
    {"card_number": "GC-001-2026", "value": 2000, "balance": 2000, "description": "Tarjeta de regalo cumpleaños", "is_active": True, "issue_date": today},
    {"card_number": "GC-002-2026", "value": 5000, "balance": 3500, "description": "Promo especial mayo",         "is_active": True, "issue_date": today},
])

# ── EXPENSES ──────────────────────────────────────────────────────
post("expenses", [
    {"date": today, "category": "Servicios", "description": "Factura eléctrica mes de mayo",  "amount": 4500, "tax": 0, "recipient": "EDESUR",    "approved_by": "Administrador"},
    {"date": today, "category": "Servicios", "description": "Servicio de internet mensual",   "amount": 2200, "tax": 0, "recipient": "CLARO RD",   "approved_by": "Administrador"},
    {"date": today, "category": "Insumos",   "description": "Material de oficina",            "amount": 850,  "tax": 0, "recipient": "La Nacional", "approved_by": "Administrador"},
])

# ── ACTIVITY LOG ──────────────────────────────────────────────────
post("activity_logs", [
    {"date": now, "user_name": "Administrador", "controller": "Sistema", "action": "Inicio",   "details": "Sistema iniciado y configurado correctamente", "platform": "Web"},
    {"date": now, "user_name": "Administrador", "controller": "Datos",   "action": "Migración","details": "Datos de demo cargados en Supabase",            "platform": "Web"},
])

print("\n═══════════════════════════════════════════")
print("  ✅ DATOS DEMO CARGADOS EXITOSAMENTE")
print(f"  📂 URL: https://systemaspro.com")
print(f"  🗄️  DB:  https://xvkorpygwxqpwolhlaap.supabase.co")
print("═══════════════════════════════════════════")
print("\n  Ahora puedes iniciar sesión con PIN: 1234")
print("  Para borrar los datos demo después de probar:\n")
print("  DELETE FROM sales;")
print("  DELETE FROM sale_items;")
print("  DELETE FROM clients;")
print("  DELETE FROM products;")
print("  DELETE FROM suppliers;")
print("  DELETE FROM employees;")
print("  DELETE FROM expenses;\n")
