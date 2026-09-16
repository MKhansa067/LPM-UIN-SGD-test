# 🚀 Panduan Setup Database & Menjalankan Proyek secara Lokal

LPM UIN SGD — Panduan lengkap dari nol hingga `npm run dev` berjalan.

---

## 📋 Daftar Isi

1. [Prasyarat](#1-prasyarat)
2. [Analisis Error Admin (Root Cause)](#2-analisis-error-admin-root-cause)
3. [⚡ Setup TERCEPAT: Laragon PostgreSQL (Terbukti Berhasil)](#3-setup-tercepat-laragon-postgresql-terbukti-berhasil)
4. [Setup PostgreSQL via pgAdmin4](#4-setup-postgresql-via-pgadmin4)
5. [Setup & Jalankan Aplikasi](#5-setup--jalankan-aplikasi)
6. [Verifikasi & Login Admin](#6-verifikasi--login-admin)
7. [Troubleshooting](#7-troubleshooting)
8. [Alternatif: Menggunakan Laragon](#8-alternatif-menggunakan-laragon)
9. [Alternatif: Menggunakan Docker](#9-alternatif-menggunakan-docker)
10. [Referensi File](#10-referensi-file)

---

## 1. Prasyarat

| Software | Versi Minimum | Keterangan |
|----------|---------------|------------|
| **Node.js** | v18+ | Cek: `node -v` |
| **npm** | v9+ | Cek: `npm -v` |
| **PostgreSQL** | 14+ | Sudah terinstall (native atau Laragon) |
| **pgAdmin4** | 7+ | GUI untuk mengelola PostgreSQL |

> **Catatan:** Proyek ini menggunakan PostgreSQL (bukan Docker) untuk pengembangan lokal. 
> 
> ⚠️ **Status Port yang Sudah Terverifikasi (14 Sept 2026):**
> - **Native PostgreSQL 18** terinstall sebagai Windows Service → port **5432** (password superuser tidak diketahui)
> - **Laragon PostgreSQL 18** (`D:\laragon\data\postgresql`) → pakai **trust auth** (tanpa password), saat ini berjalan di port **5433**
> - Aplikasi `.env.local` diarahkan ke **`localhost:5433`** dan **login admin sudah terbukti berhasil**
> - Cara termudah: jalankan `scripts/start-db.cmd` untuk menyalakan Laragon PostgreSQL di port 5433

---

## 2. Analisis Error Admin (Root Cause)

Ketika mengakses `/admin/login` → memasukkan `admin` / `admin123` → muncul **"Username atau password salah."**:

### Dua penyebab utama ditemukan:

#### ❌ Root Cause 1: Database belum dibuat
Aplikasi mengharapkan:
- **Role:** `lpm_user` dengan password `lpm_password`
- **Database:** `lpm_db`
- **Tabel:** 6 tabel (lpm_admins, lpm_feeds, lpm_documents, lpm_spmi_docs, lpm_accreditation, lpm_audit_logs)

Tetapi PostgreSQL lokal **belum punya** role `lpm_user` dan database `lpm_db`. Ketika aplikasi mencoba query database, koneksi gagal → login gagal.

#### ❌ Root Cause 2: Bcrypt hash password admin INVALID
File `docker/postgres/init.sql` sebelumnya berisi hash bcrypt yang **rusak** (50 karakter, bukan 60). Hash tersebut tidak cocok dengan password `admin123`. Artinya, bahkan jika database sudah dibuat, login tetap gagal.

**Status:** ✅ Hash sudah diperbaiki ke `$2b$12$CJb3Hv5wWWqYW6ZhZkJTsumI2Noe.pgIUsGeuR4WKCRwuyzv/XQU.` (diverifikasi dengan bcryptjs).

#### ❌ Root Cause 3: Auth.js `UntrustedHost` (ditemukan saat verifikasi)
Setelah DB benar, `/api/auth/csrf` masih mengembalikan `500 UntrustedHost` karena `auth.config.ts` belum punya `trustHost: true`. Ini error khas Auth.js v5 saat berjalan di localhost (bukan Vercel).

**Status:** ✅ Sudah ditambahkan `trustHost: true` di `auth.config.ts`. Verifikasi `GET /api/auth/csrf` → `200 {"csrfToken":"..."}`.

---

## 3. ⚡ Setup TERCEPAT: Laragon PostgreSQL (Terbukti Berhasil ✅)

> Metode ini **sudah dijalankan dan dibuktikan berhasil** di mesin ini pada 14 Sept 2026 (login admin `admin`/`admin123` masuk dashboard). Gunakan metode ini jika password superuser native PostgreSQL tidak diketahui.

### Mengapa Laragon?
- Laragon PostgreSQL (`D:\laragon\data\postgresql`) memakai **trust auth** → **tidak butuh password** untuk koneksi lokal
- Native PostgreSQL 18 (Windows Service) memakai password yang **tidak diketahui** → tidak bisa dipakai
- Solusi: jalankan instance Laragon di port **5433** (native tetap di 5432, tanpa konflik)

### Langkah 3.1: Jalankan Server Database (sekali saja)

```powershell
# Jalankan dari folder proyek
.\scripts\start-db.cmd

# Atau manual:
& 'D:\laragon\bin\postgresql\pgsql\bin\pg_ctl.exe' `
  -D 'D:\laragon\data\postgresql' `
  -o '-p 5433' `
  -l 'D:\laragon\data\postgresql\pg_start.log' `
  start
```

Cek berjalan:
```powershell
netstat -ano | findstr ':5433' | findstr 'LISTENING'
```

### Langkah 3.2: Buat Role + Database (jika belum ada)

```powershell
$PSQL='D:\laragon\bin\postgresql\pgsql\bin\psql.exe'

# Cek role
& $PSQL -U postgres -h localhost -p 5433 -d postgres -t -A -c "SELECT rolname FROM pg_roles WHERE rolname='lpm_user';"

# Buat role (jika kosong)
& $PSQL -U postgres -h localhost -p 5433 -d postgres -c "CREATE ROLE lpm_user WITH LOGIN PASSWORD 'lpm_password';"

# Cek & buat database
& $PSQL -U postgres -h localhost -p 5433 -d postgres -c "CREATE DATABASE lpm_db OWNER lpm_user;"
& $PSQL -U postgres -h localhost -p 5433 -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE lpm_db TO lpm_user;"
```

### Langkah 3.3: Buat Tabel + Seed Data

```powershell
& $PSQL -U lpm_user -h localhost -p 5433 -d lpm_db -f '.\docker\postgres\init.sql'
```

**Expected output:** 6× `CREATE TABLE`, 4× `CREATE INDEX`, `INSERT 0 1`.

### Langkah 3.4: Update `.env.local`

Ubah port di `DATABASE_URL` dari `5432` → `5433`:

```env
DATABASE_URL="postgresql://lpm_user:lpm_password@localhost:5433/lpm_db?sslmode=disable"
```

### Langkah 3.5: Jalankan Aplikasi

```powershell
npm run dev        # development
# atau
npm run build && npm run start   # production
```

Login di **http://localhost:3000/admin/login** dengan `admin` / `admin123`.

---

## 4. Setup PostgreSQL via pgAdmin4

### Langkah 4.1: Buka pgAdmin4 & Login

1. Buka **pgAdmin4** dari Start Menu
2. Masukkan **Master Password** pgAdmin4 (yang dibuat saat install)
3. Di panel kiri, expand **Servers** → **PostgreSQL 18** (atau nama server yang ada)
4. Masukkan password superuser PostgreSQL saat diminta

> 💡 **Lupa password superuser?** Lihat bagian [Troubleshooting](#7-troubleshooting)
### Langkah 4.2: Buat Role `lpm_user`

1. Klik kanan pada server → **Query Tool**
2. Paste dan jalankan SQL berikut:

```sql
-- Buat role lpm_user
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'lpm_user') THEN
    CREATE ROLE lpm_user WITH LOGIN PASSWORD 'lpm_password';
    RAISE NOTICE 'Role lpm_user berhasil dibuat.';
  ELSE
    RAISE NOTICE 'Role lpm_user sudah ada, skip.';
  END IF;
END
$$;
```

3. Klik tombol **▶ Execute** (atau tekan F5)
4. Lihat Messages panel: seharusnya ada notice "Role lpm_user berhasil dibuat."

### Langkah 4.3: Buat Database `lpm_db`

1. Klik kanan pada **Databases** → **Create** → **Database...**
2. Isi form:
   - **Database:** `lpm_db`
   - **Owner:** pilih `lpm_user` dari dropdown
3. Klik **Save**
4. Database `lpm_db` sekarang ada di panel kiri

> ⚠️ Jika form Create Database tidak muncul, pastikan kamu terkoneksi sebagai superuser (postgres), bukan sebagai lpm_user.

### Langkah 4.4: Buat Tabel & Seed Data

1. Klik kanan pada database **lpm_db** → **Query Tool**
2. Buka file `docs/setup-db.sql` dari proyek
3. **Copy seluruh isi file**, paste ke Query Tool
4. Klik **▶ Execute** (F5)
5. Cek Results panel — seharusnya ada 1 baris data admin:

| id | name | username | email | role | is_active |
|----|------|----------|-------|------|-----------|
| 1 | Super Admin LPM | admin | admin@lpm.uinsgd.ac.id | superadmin | ✅ |

6. Cek Messages panel — seharusnya ada notice sukses

### Langkah 4.5: Verifikasi Tabel

Di Query Tool (database `lpm_db`), jalankan:

```sql
-- Lihat semua tabel
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Lihat admin
SELECT id, name, username, email, role, is_active FROM lpm_admins;
```

**Expected output tabel:** lpm_accreditation, lpm_admins, lpm_audit_logs, lpm_documents, lpm_feeds, lpm_spmi_docs

**Expected admin:** 1 baris → `admin` / `admin@lpm.uinsgd.ac.id` / `superadmin`

---

## 5. Setup & Jalankan Aplikasi

### Langkah 5.1: Install Dependencies

```bash
cd D:\My-Projects\2-DEVELOPMENT\Websites\JavaScript\lpm_uin_sgd\lpm-uin-sgd
npm install --legacy-peer-deps
```

### Langkah 5.2: Cek File `.env.local`

File `.env.local` sudah ada dengan isi:

```env
DATABASE_URL="postgresql://lpm_user:lpm_password@localhost:5433/lpm_db?sslmode=disable"
NEXTAUTH_SECRET="dev-secret-key-32-characters-minimum-lpm-uin-sgd"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="LPM UIN Sunan Gunung Djati Bandung"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

> ⚠️ **Pastikan port di `DATABASE_URL` sama dengan port PostgreSQL yang berjalan!**
> - Laragon (trust auth): `5433` → pastikan `scripts/start-db.cmd` sudah dijalankan
> - Native PG 18: `5432` (default, tapi butuh password superuser)

### Langkah 5.3: Jalankan Development Server

```bash
npm run dev
```

**Expected output:**
```
  ▲ Next.js 15.x.x
  - Local:        http://localhost:3000
  - Environments: .env.local
  ✓ Ready in 2.xxs
```

### Langkah 5.4: Jalankan Production Build (opsional)

```bash
npm run build
npm run start
```

> 💡 `npm run start` berjalan di port 3000 (default). Untuk port lain: `npm run start -- -p 3100`

---

## 6. Verifikasi & Login Admin

### 6.1: Akses Portal Publik

Buka browser: **http://localhost:3000**

- ✅ Homepage tampil dengan Header, Hero, Bento Stats, Feeds
- ✅ Navigasi: /profil, /dokumen, /spmi, /akreditasi, /tautan

### 6.2: Akses Portal Admin

1. Buka: **http://localhost:3000/admin/login**
2. Masukkan kredensial:
   - **Username:** `admin`
   - **Password:** `admin123`
3. Klik **"Masuk Dashboard"**

**Expected:** Redirect ke `/admin/dashboard` — tampil Welcome Banner, Metrics Cards, Quick Actions, Audit Log.

### 6.3: Test Fitur Admin

| Fitur | URL | Status |
|-------|-----|--------|
| Dashboard | `/admin/dashboard` | ✅ |
| CMS Feed | `/admin/dashboard/cms` | ✅ |
| Dokumen | `/admin/dashboard/dokumen` | ✅ |
| SPMI | `/admin/dashboard/spmi` | ✅ |
| Akreditasi | `/admin/dashboard/akreditasi` | ✅ |
| Users | `/admin/dashboard/users` | ✅ |
| Audit Log | `/admin/dashboard/audit-log` | ✅ |

### 6.4: Test API Endpoints

```bash
# Health check
curl http://localhost:3000/api/health

# Feeds (public)
curl http://localhost:3000/api/feeds
```

---

## 7. Troubleshooting

### ❌ "Password authentication failed for user lpm_user"

**Artinya:** Role `lpm_user` belum dibuat atau password salah.

**Solusi:**
1. Jalankan metode di [Section 3](#3-setup-tercepat-laragon-postgresql-terbukti-berhasil) untuk buat role + database
2. Atau buat ulang via psql/pgAdmin4:
   - `DROP ROLE IF EXISTS lpm_user;`
   - `CREATE ROLE lpm_user WITH LOGIN PASSWORD 'lpm_password';`

### ❌ "connection refused" / port 5433 tidak bisa diakses

**Artinya:** PostgreSQL Laragon belum dijalankan.

**Solusi:**
1. Jalankan `scripts\start-db.cmd` dari folder proyek
2. Cek: `netstat -ano | findstr ':5433' | findstr 'LISTENING'`
3. Pastikan `DATABASE_URL` di `.env.local` memakai port `5433`

### ❌ "Database lpm_db does not exist"

**Solusi:**
1. Buka pgAdmin4
2. Klik kanan **Databases** → **Create** → **Database...**
3. Name: `lpm_db`, Owner: `lpm_user`
4. Atau via psql: `CREATE DATABASE lpm_db OWNER lpm_user;`

### ❌ "password authentication failed for user postgres"

**Artinya:** Lupa password superuser PostgreSQL native.

**Solusi:** Gunakan metode Laragon di [Section 3](#3-setup-tercepat-laragon-postgresql-terbukti-berhasil) — tidak butuh password sama sekali (trust auth).

### ❌ NextAuth "UntrustedHost"

**Solusi:** Pastikan `auth.config.ts` punya `trustHost: true` (sudah diperbaiki).

### ❌ Admin login berhasil tapi "Terjadi kesalahan sistem"

**Artinya:** Query database gagal (tabel belum ada atau kolom berbeda).

**Solusi:**
1. Jalankan `docker/postgres/init.sql` di database `lpm_db`
2. Cek tabel: `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`
3. Cek admin: `SELECT * FROM lpm_admins;`

### Cek Status Database (Quick Reference)

```powershell
# Cek PostgreSQL berjalan
netstat -ano | findstr ':5433' | findstr 'LISTENING'

# Cek tabel
& 'D:\laragon\bin\postgresql\pgsql\bin\psql.exe' -U lpm_user -h localhost -p 5433 -d lpm_db -c "\dt"

# Cek admin
& 'D:\laragon\bin\postgresql\pgsql\bin\psql.exe' -U lpm_user -h localhost -p 5433 -d lpm_db -c "SELECT id, username, role, is_active FROM lpm_admins;"
```

---

## 8. Alternatif: Menggunakan Laragon

> ✅ **Cara termudah & sudah terverifikasi: lihat [Section 3](#3-setup-tercepat-laragon-postgresql-terbukti-berhasil)** — jalankan Laragon PostgreSQL di port **5433** tanpa perlu menghentikan native PG 18.

### Langkah 8.1: Opsi A — Langsung pakai port 5433 (disarankan)

Jalankan `scripts/start-db.cmd` lalu ikuti [Section 3](#3-setup-tercepat-laragon-postgresql-terbukti-berhasil). Tidak butuh hak admin, tidak mengganggu native PG 18.

### Langkah 8.2: Opsi B — Ganti ke port 5432 (butuh admin)

1. Hentikan PostgreSQL Native (jalankan PowerShell sebagai **Administrator**):
```powershell
Stop-Service postgresql-x64-18
```

2. Buka **Laragon** → **Database** → **PostgreSQL** (atau centang PostgreSQL di panel) → Laragon start PostgreSQL di port **5432**.

### Langkah 8.3: Setup Database

Jika `lpm_db`/`lpm_user` belum ada, ikuti langkah 3.2–3.3 (role + database) dengan port sesuai.

> 💡 **Laragon PostgreSQL** biasanya menggunakan superuser `postgres` dengan trust auth (tanpa password) atau password `root` (yang dibuat saat setup Laragon).

| Komponen | Port Default | Keterangan |
|----------|-------------|------------|
| Native PG 18 | 5432 | Windows Service |
| Laragon PostgreSQL | 5432 | Harus stop native PG dulu |
| Next.js dev | 3000 | `npm run dev` |
| Next.js start | 3000 | `npm run start` |

> **Hanya boleh ada satu PostgreSQL yang jalan di port 5432!**

---

## 9. Alternatif: Menggunakan Docker

### Langkah 9.1: Hentikan PostgreSQL Native

```powershell
# Run as Administrator
Stop-Service postgresql-x64-18
```

> ⚠️ Docker Compose mapping port `5432:5432` akan konflik jika native PG masih jalan!

### Langkah 9.2: Start Docker Desktop

Buka **Docker Desktop** → tunggu hingga engine running (icon hijau).

### Langkah 9.3: Jalankan Docker Compose

```bash
cd D:\My-Projects\2-DEVELOPMENT\Websites\JavaScript\lpm_uin_sgd\lpm-uin-sgd
docker compose up -d
```

Ini akan menjalankan:
- **PostgreSQL 16** (container) di port 5432
- **LPM App** (Next.js) di port 3000

### Langkah 9.4: Akses

- Portal Publik: http://localhost:3000
- Portal Admin: http://localhost:3000/admin/login

Database akan otomatis di-setup oleh `docker/postgres/init.sql`.

---

## 📊 Ringkasan Arsitektur Database

```
PostgreSQL 18 (port 5433 Laragon / 5432 native)
└── lpm_db (database)
    ├── lpm_admins          → Akun admin (bcrypt auth)
    ├── lpm_feeds           → Berita, Pengumuman, Event
    ├── lpm_documents       → Dokumen Regulasi & Monev
    ├── lpm_spmi_docs       → Dokumen SPMI
    ├── lpm_accreditation   → Data Akreditasi Prodi
    └── lpm_audit_logs      → Log Aktivitas Admin
```

**Auth Flow:**
```
/login → signIn("credentials") → authorize() → 
  db.select(lpm_admins).where(username) → 
    bcrypt.compare(password, hash) → 
      return user → JWT session → /admin/dashboard
```

## 10. Referensi File

| File | Fungsi |
|------|--------|
| `docs/setup-db.sql` | Skrip setup lengkap untuk pgAdmin4 |
| `docker/postgres/init.sql` | Schema + seed untuk Docker / psql `-f` |
| `scripts/start-db.cmd` | Menyalakan Laragon PostgreSQL di port 5433 |
| `.env.local` | Konfigurasi DB, NextAuth secret (tidak di-commit) |
| `lib/db.ts` | Koneksi Drizzle ORM → PostgreSQL |
| `lib/schema.ts` | Definisi 6 tabel (drizzle schema) |
| `lib/auth.ts` | NextAuth.js Credentials Provider + bcrypt |
| `auth.config.ts` | NextAuth.js callbacks (authorized, jwt, session) + trustHost |
| `middleware.ts` | Proteksi rute /admin/dashboard |