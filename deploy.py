#!/usr/bin/env python3
"""
WilmaxPOS 1.0 - Full Deployment Script
- Creates Supabase storage buckets (products, employees, clients, documents, logos)
- Runs SQL schema via Supabase Management API
- Uploads dist/ to systemaspro.com via SSH/SFTP
"""

import os
import json
import sys
import time
import paramiko
import urllib.request
import urllib.error
import ssl

# ─────────────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────────────
SUPABASE_URL     = "https://xvkorpygwxqpwolhlaap.supabase.co"
SUPABASE_PROJECT = "xvkorpygwxqpwolhlaap"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2a29ycHlnd3hxcHdvbGhsYWFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzI0MzE1OSwiZXhwIjoyMDkyODE5MTU5fQ.02ZD_urFuYE7QMH86mnzd-ToVMhZlV8i_Pw4HZDoJWo"

SSH_HOST     = "82.25.87.157"
SSH_PORT     = 65002
SSH_USER     = "u108221933"
SSH_PASS     = "Producers0587@"
REMOTE_DIR   = "/home/u108221933/domains/systemaspro.com/public_html"

DIST_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dist")
SCHEMA_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "wilmaxpos_schema.sql")

HEADERS = {
    "apikey": SERVICE_ROLE_KEY,
    "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
    "Content-Type": "application/json",
}

ssl_ctx = ssl.create_default_context()

# ─────────────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────────────
def http_request(method, url, data=None, extra_headers=None):
    headers = {**HEADERS}
    if extra_headers:
        headers.update(extra_headers)
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, context=ssl_ctx, timeout=30) as resp:
            raw = resp.read().decode()
            return resp.status, json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        raw = e.read().decode()
        return e.code, raw
    except Exception as ex:
        return 0, str(ex)

def print_ok(msg):  print(f"  ✅ {msg}")
def print_err(msg): print(f"  ❌ {msg}")
def print_info(msg):print(f"  ℹ️  {msg}")
def section(title): print(f"\n{'─'*55}\n  {title}\n{'─'*55}")

# ─────────────────────────────────────────────────────
# STEP 1 — SUPABASE STORAGE BUCKETS
# ─────────────────────────────────────────────────────
BUCKETS = [
    {"name": "product-images",  "public": True,  "help": "Imágenes de productos"},
    {"name": "employee-avatars","public": True,  "help": "Fotos de empleados"},
    {"name": "client-photos",   "public": True,  "help": "Fotos de clientes"},
    {"name": "supplier-logos",  "public": True,  "help": "Logos de proveedores"},
    {"name": "store-logos",     "public": True,  "help": "Logos de tiendas / marca"},
    {"name": "documents",       "public": False, "help": "Documentos privados (facturas, contratos)"},
    {"name": "expense-receipts","public": False, "help": "Comprobantes de gastos"},
]

def create_buckets():
    section("SUPABASE — Creando storage buckets")
    for b in BUCKETS:
        url = f"{SUPABASE_URL}/storage/v1/bucket"
        status, resp = http_request("POST", url, {
            "name": b["name"],
            "public": b["public"],
            "fileSizeLimit": 10485760,  # 10 MB
            "allowedMimeTypes": ["image/jpeg","image/png","image/webp","image/gif","application/pdf"]
        })
        if status in (200, 201):
            vis = "🌐 público" if b["public"] else "🔒 privado"
            print_ok(f"{b['name']} ({vis}) — {b['help']}")
        elif status == 400 and "already exists" in str(resp):
            print_info(f"{b['name']} ya existe — omitido")
        else:
            print_err(f"{b['name']} → HTTP {status}: {resp}")

# ─────────────────────────────────────────────────────
# STEP 2 — SUPABASE SQL SCHEMA
# ─────────────────────────────────────────────────────
def run_sql_schema():
    section("SUPABASE — Ejecutando esquema SQL")
    with open(SCHEMA_FILE, "r", encoding="utf-8") as f:
        sql = f.read()

    # Try the direct pg/query endpoint (Supabase internal)
    url = f"{SUPABASE_URL}/pg/query"
    status, resp = http_request("POST", url, {"query": sql})
    if status in (200, 201):
        print_ok("Esquema SQL ejecutado via /pg/query")
        return True

    # Try via Supabase admin REST endpoint
    url2 = f"{SUPABASE_URL}/rest/v1/rpc/exec_sql"
    status2, resp2 = http_request("POST", url2, {"sql": sql})
    if status2 in (200, 201):
        print_ok("Esquema SQL ejecutado via exec_sql RPC")
        return True

    # Try splitting by semicolon and using PostgREST DDL trick
    print_info(f"/pg/query retornó HTTP {status} — intentando vía Management API...")

    # Supabase Management API (requires personal token - may fail)
    mgmt_url = f"https://api.supabase.com/v1/projects/{SUPABASE_PROJECT}/database/query"
    status3, resp3 = http_request("POST", mgmt_url, {"query": sql},
                                  extra_headers={"Authorization": f"Bearer {SERVICE_ROLE_KEY}"})
    if status3 in (200, 201):
        print_ok("Esquema SQL ejecutado via Management API")
        return True

    print_err(f"No se pudo ejecutar el SQL automáticamente (HTTP {status} / {status2} / {status3})")
    print()
    print("  📋 INSTRUCCIONES MANUALES:")
    print(f"     1. Abre https://supabase.com/dashboard/project/{SUPABASE_PROJECT}/sql")
    print(f"     2. Pega el contenido del archivo: wilmaxpos_schema.sql")
    print(f"     3. Haz clic en 'Run'")
    return False

# ─────────────────────────────────────────────────────
# STEP 3 — UPLOAD TO SYSTEMASPRO.COM
# ─────────────────────────────────────────────────────
def sftp_upload_dir(sftp, local_dir, remote_dir):
    """Recursively upload a local directory via SFTP."""
    # Ensure remote dir exists
    try:
        sftp.stat(remote_dir)
    except FileNotFoundError:
        sftp.mkdir(remote_dir)

    for item in os.listdir(local_dir):
        local_path  = os.path.join(local_dir, item)
        remote_path = remote_dir + "/" + item
        if os.path.isdir(local_path):
            sftp_upload_dir(sftp, local_path, remote_path)
        else:
            sftp.put(local_path, remote_path)
            print(f"     ↑ {item}")

def upload_to_host():
    section("HOSTINGER — Subiendo a systemaspro.com")
    if not os.path.isdir(DIST_DIR):
        print_err(f"dist/ no encontrado en {DIST_DIR} — ejecuta 'npm run build' primero")
        return False

    try:
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        print_info(f"Conectando a {SSH_HOST}:{SSH_PORT} como {SSH_USER}...")
        client.connect(SSH_HOST, port=SSH_PORT, username=SSH_USER, password=SSH_PASS, timeout=30)
        print_ok("Conexión SSH establecida")

        # Find the right public_html directory
        _, stdout, _ = client.exec_command(
            f"ls {REMOTE_DIR} 2>/dev/null && echo FOUND || echo NOTFOUND"
        )
        result = stdout.read().decode().strip()

        if "NOTFOUND" in result:
            print_info(f"Directorio {REMOTE_DIR} no existe, intentando crearlo...")
            client.exec_command(f"mkdir -p {REMOTE_DIR}")
            time.sleep(1)

        # Clear old files
        print_info("Limpiando archivos anteriores en public_html...")
        client.exec_command(f"rm -rf {REMOTE_DIR}/*")
        time.sleep(2)

        # Upload via SFTP
        print_info("Subiendo archivos dist/...")
        sftp = client.open_sftp()
        sftp_upload_dir(sftp, DIST_DIR, REMOTE_DIR)

        # Upload .htaccess for SPA routing
        htaccess = """Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
"""
        with sftp.open(REMOTE_DIR + "/.htaccess", "w") as f:
            f.write(htaccess)
        print_info(".htaccess creado para SPA routing")

        sftp.close()
        client.close()
        print_ok(f"App publicada en https://systemaspro.com")
        return True

    except Exception as e:
        print_err(f"Error SSH: {e}")
        return False

# ─────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────
if __name__ == "__main__":
    print("\n╔══════════════════════════════════════╗")
    print("║  WILMAXPOS 1.0 — DEPLOYMENT SCRIPT  ║")
    print("╚══════════════════════════════════════╝")

    create_buckets()
    run_sql_schema()
    upload_to_host()

    print("\n" + "═"*55)
    print("  RESUMEN")
    print("═"*55)
    print(f"  🌐 App:      https://systemaspro.com")
    print(f"  🗄️  DB:       {SUPABASE_URL}")
    print(f"  🗂️  Storage:  {SUPABASE_URL}/storage/v1")
    print(f"  📋 Schema:   wilmaxpos_schema.sql")
    print("═"*55 + "\n")
