#!/usr/bin/env python3
"""
WilmaxPOS — Create a new business account (multi-tenant).
Usage: python create_business.py
"""
import json, ssl, urllib.request, urllib.error

URL = "https://xvkorpygwxqpwolhlaap.supabase.co"
KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2a29ycHlnd3hxcHdvbGhsYWFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzI0MzE1OSwiZXhwIjoyMDkyODE5MTU5fQ.02ZD_urFuYE7QMH86mnzd-ToVMhZlV8i_Pw4HZDoJWo"
H   = {"apikey": KEY, "Authorization": f"Bearer {KEY}", "Content-Type": "application/json", "Prefer": "return=representation"}
ctx = ssl.create_default_context()

def req(method, path, body=None):
    data = json.dumps(body).encode() if body else None
    r = urllib.request.Request(f"{URL}{path}", data=data, headers=H, method=method)
    with urllib.request.urlopen(r, context=ctx, timeout=15) as resp:
        return json.loads(resp.read()) if resp.status != 204 else None

print("\n╔══════════════════════════════════════╗")
print("║  WILMAXPOS — CREAR NUEVO NEGOCIO     ║")
print("╚══════════════════════════════════════╝\n")

name  = input("Nombre del negocio: ").strip()
code  = input("Código de acceso (ej: TIENDA01): ").strip().upper()
email = input("Email del dueño (opcional): ").strip()
phone = input("Teléfono (opcional): ").strip()
plan  = input("Plan [starter/pro/enterprise] (Enter=starter): ").strip() or "starter"

print("\nCreando negocio en Supabase...")
biz = req("POST", "/rest/v1/businesses", {
    "name": name, "business_code": code,
    "owner_email": email or None, "owner_phone": phone or None,
    "plan": plan, "is_active": True
})
bid = biz[0]["id"]
print(f"  ✅ Negocio creado: {name}  (ID: {bid})")

print("Creando usuarios por defecto...")
req("POST", "/rest/v1/users", [
    {"name": "Administrador", "email": f"admin@{code.lower()}.com", "pin": "1234", "role": "admin",   "is_active": True, "business_id": bid},
    {"name": "Cajero",        "email": f"cajero@{code.lower()}.com","pin": "0000", "role": "cashier", "is_active": True, "business_id": bid},
])
print("  ✅ Usuarios creados (admin PIN: 1234, cajero PIN: 0000)")

print("Creando tienda y caja...")
store = req("POST", "/rest/v1/stores", [{"name": name, "is_active": True, "business_id": bid}])
req("POST", "/rest/v1/cash_registers", [{"name": "CAJA 1", "store_id": store[0]["id"], "is_open": False, "current_amount": 0, "business_id": bid}])
print("  ✅ Tienda y caja creadas")

print("Creando comprobantes NCF...")
ncf = [
    {"description": "FACTURA CONSUMO",       "series": "B", "type": "02", "from": "00000001", "to": "00000200", "current": "B0200000001", "is_active": True, "business_id": bid},
    {"description": "FACTURA CRÉDITO FISCAL","series": "B", "type": "01", "from": "00000001", "to": "00000100", "current": "B0100000001", "is_active": True, "business_id": bid},
]
req("POST", "/rest/v1/vouchers", ncf)
print("  ✅ Comprobantes NCF creados")

print(f"""
╔══════════════════════════════════════════╗
  ✅ NEGOCIO LISTO PARA USAR

  Nombre  : {name}
  Código  : {code}
  Plan    : {plan}
  UUID    : {bid}

  Para acceder en systemaspro.com:
    1. Código de negocio: {code}
    2. PIN admin: 1234

  Cambia el PIN del admin después del primer
  ingreso por seguridad.
╚══════════════════════════════════════════╝
""")
