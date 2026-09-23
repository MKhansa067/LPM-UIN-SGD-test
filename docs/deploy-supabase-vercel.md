# 🚀 Panduan Deploy — Supabase + Vercel

**Proyek:** LPM UIN Sunan Gunung Djati Bandung  
**Stack:** Next.js 16 · Drizzle ORM · PostgreSQL · NextAuth.js v5 · Tailwind CSS v4  
**Estimasi Waktu:** 30–60 menit

---

## 📋 Daftar Isi

1. [Prasyarat](#1-prasyarat)
2. [Persiapan Repository GitHub](#2-persiapan-repository-github)
3. [Setup Database di Supabase](#3-setup-database-di-supabase)
4. [Jalankan SQL Schema di Supabase](#4-jalankan-sql-schema-di-supabase)
5. [Deploy Aplikasi ke Vercel](#5-deploy-aplikasi-ke-vercel)
6. [Konfigurasi Environment Variables di Vercel](#6-konfigurasi-environment-variables-di-vercel)
7. [Konfigurasi Upload File](#7-konfigurasi-upload-file)
8. [Verifikasi & Login Admin Pertama](#8-verifikasi--login-admin-pertama)
9. [Custom Domain (Opsional)](#9-custom-domain-opsional)
10. [Troubleshooting](#10-troubleshooting)
11. [Ringkasan Environment Variables](#11-ringkasan-environment-variables)

---

## 1. Prasyarat

| Kebutuhan | Keterangan |
|---|---|
| Akun **GitHub** | Repository sudah di-push ke GitHub |
| Akun **Supabase** | Daftar gratis di [supabase.com](https://supabase.com) |
| Akun **Vercel** | Daftar gratis di [vercel.com](https://vercel.com) — bisa login via GitHub |
| **Node.js v18+** | Hanya untuk kebutuhan lokal |

> ⚠️ Tier gratis Supabase dan Vercel sudah cukup untuk portal LPM ini. Tidak perlu kartu kredit.

---

## 2. Persiapan Repository GitHub

### 2.1 — Generate SSH Key (jika belum ada)

```bash
# Git Bash / PowerShell
ssh-keygen -t ed25519 -C "email_github@example.com"
# Tekan Enter untuk semua pertanyaan

# Tampilkan public key
cat ~/.ssh/id_ed25519.pub
```

Daftarkan ke GitHub: **Settings → SSH and GPG keys → New SSH key** → paste → Save.

```bash
# Test koneksi — harus muncul "Hi MKhansa067! You've successfully authenticated..."
ssh -T git@github.com
```

### 2.2 — File yang TIDAK boleh ter-commit (cek `.gitignore`)

```
.env.local
node_modules/
.next/
public/uploads/
```

### 2.3 — Push ke GitHub

```bash
cd D:\My-Projects\2-DEVELOPMENT\Websites\JavaScript\LPM_UIN_SGD\lpm-uin-sgd

git add .
git commit -m "feat: ready for Supabase + Vercel deployment"
git push origin main
```

---

## 3. Setup Database di Supabase

### 3.1 — Buat Project Baru

1. Buka [app.supabase.com](https://app.supabase.com) → **"New project"**
2. Isi:
   - **Name:** `lpm-uin-sgd`
   - **Database Password:** Buat password kuat — **simpan baik-baik!**
   - **Region:** `Southeast Asia (Singapore)`
3. Klik **"Create new project"** → tunggu ~2 menit

### 3.2 — Ambil Connection String

1. **Settings** (ikon gear) → **"Database"**
2. Scroll ke **"Connection string"** → tab **"URI"**
3. Salin string berikut (ganti `[PASSWORD]`):
   ```
   postgresql://postgres:[PASSWORD]@db.xxxxxxxxxxxx.supabase.co:5432/postgres
   ```

> 💡 Jangan tambahkan `?sslmode=disable` — Supabase wajib SSL, sudah aktif default.

### 3.3 — Aktifkan Connection Pooler (Wajib untuk Vercel)

Vercel adalah **serverless** — membuka koneksi baru setiap request. Tanpa pooler koneksi database bisa habis.

1. **Settings** → **"Database"** → scroll ke **"Connection pooling"**
2. Pastikan **Mode: Transaction** aktif
3. Salin connection string dari **"Connection pooler"** (port `6543`):
   ```
   postgresql://postgres.[ref]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```
4. **Gunakan URL ini** sebagai `DATABASE_URL` di Vercel ✅

---

## 4. Jalankan SQL Schema di Supabase

### 4.1 — Buka SQL Editor

Supabase sidebar → **"SQL Editor"** → **"New query"**

### 4.2 — Jalankan Script Schema (Tabel 1–3)

Paste dan klik **"Run"**:

```sql
CREATE TABLE IF NOT EXISTS lpm_admins (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'admin',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lpm_feeds (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(300) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    published_date DATE NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    pdf_attachment_url TEXT DEFAULT '-',
    view_count INT NOT NULL DEFAULT 0,
    sections JSONB NOT NULL DEFAULT '[]',
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_by INT REFERENCES lpm_admins(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lpm_documents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    main_category VARCHAR(100) NOT NULL,
    sub_category VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    target_unit VARCHAR(100) NOT NULL DEFAULT 'Universitas',
    download_url TEXT NOT NULL,
    file_size VARCHAR(20),
    file_type VARCHAR(10) DEFAULT 'PDF',
    created_by INT REFERENCES lpm_admins(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 4.3 — Jalankan Script Schema (Tabel 4–6 + Index + Seed Admin)

**Buat query baru** → paste dan klik **"Run"**:

```sql
CREATE TABLE IF NOT EXISTS lpm_spmi_docs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    file_url TEXT NOT NULL,
    year INT NOT NULL,
    description TEXT,
    created_by INT REFERENCES lpm_admins(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lpm_accreditation (
    id SERIAL PRIMARY KEY,
    program_name VARCHAR(255) NOT NULL,
    degree_level VARCHAR(50) NOT NULL,
    faculty VARCHAR(255) NOT NULL,
    rating VARCHAR(100) NOT NULL,
    accreditor VARCHAR(50) NOT NULL DEFAULT 'BAN-PT',
    expiration_date DATE NOT NULL,
    quarter_period VARCHAR(20) NOT NULL,
    semester_period VARCHAR(50) NOT NULL,
    sk_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by INT REFERENCES lpm_admins(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lpm_audit_logs (
    id SERIAL PRIMARY KEY,
    admin_id INT REFERENCES lpm_admins(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    target_table VARCHAR(100),
    target_id INT,
    details JSONB DEFAULT '{}',
    ip_address VARCHAR(45),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_feeds_category ON lpm_feeds(category);
CREATE INDEX IF NOT EXISTS idx_feeds_published_date ON lpm_feeds(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_docs_main_category ON lpm_documents(main_category);
CREATE INDEX IF NOT EXISTS idx_accr_quarter ON lpm_accreditation(quarter_period);

-- Superadmin awal: username=admin | password=admin123
INSERT INTO lpm_admins (name, username, email, password_hash, role)
VALUES (
    'Super Admin LPM',
    'admin',
    'admin@lpm.uinsgd.ac.id',
    '$2b$12$CJb3Hv5wWWqYW6ZhZkJTsumI2Noe.pgIUsGeuR4WKCRwuyzv/XQU.',
    'superadmin'
) ON CONFLICT (username) DO NOTHING;
```

Berhasil → **"Success. No rows returned."**

### 4.4 — Verifikasi Tabel

Supabase → **"Table Editor"** — 6 tabel harus muncul:

| Tabel | Status Awal |
|---|---|
| `lpm_admins` | ✅ 1 row (superadmin `admin`) |
| `lpm_feeds` | ✅ Kosong (diisi via admin dashboard) |
| `lpm_documents` | ✅ Kosong |
| `lpm_spmi_docs` | ✅ Kosong |
| `lpm_accreditation` | ✅ Kosong |
| `lpm_audit_logs` | ✅ Kosong |


---

## 5. Deploy Aplikasi ke Vercel

### 5.1 — Import Repository ke Vercel

1. Buka [vercel.com](https://vercel.com) → Login dengan akun GitHub
2. Klik **"Add New..."** → **"Project"**
3. Cari dan pilih repository `LPM-UIN-SGD-test` → klik **"Import"**

### 5.2 — Konfigurasi Build Settings

Vercel otomatis mendeteksi proyek Next.js. Pastikan:

| Setting | Nilai |
|---|---|
| **Framework Preset** | `Next.js` (otomatis terdeteksi) |
| **Root Directory** | `lpm-uin-sgd` ← **sesuaikan** jika folder proyek bukan di root repo |
| **Build Command** | `npm run build` (default) |
| **Output Directory** | `.next` (default) |
| **Install Command** | `npm install` (default) |

> ⚠️ **Root Directory sangat penting!**  
> Jika struktur repo Anda adalah `LPM_UIN_SGD/lpm-uin-sgd/`, set **Root Directory** ke `lpm-uin-sgd`.

### 5.3 — JANGAN Deploy Dulu!

**Belum klik "Deploy"** — isi Environment Variables dulu di langkah berikutnya. Gulir ke bawah ke bagian **"Environment Variables"** pada halaman yang sama.

---

## 6. Konfigurasi Environment Variables di Vercel

Ini langkah **paling kritis** — aplikasi tidak akan berjalan tanpa variabel ini.

### 6.1 — Generate NEXTAUTH_SECRET

Jalankan di terminal untuk membuat secret aman (min. 32 karakter):

```bash
# Opsi 1: openssl (Git Bash / Linux / macOS)
openssl rand -base64 32

# Opsi 2: Node.js (PowerShell / CMD)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Salin hasilnya (contoh: `K3p9mQ2rXvL8nJtY5wA7bZ1cUe6FiHoD4gPsNkCx0mRw=`).

> 🔐 Jangan gunakan secret default `dev-secret-key-...` di production!

### 6.2 — Masukkan Environment Variables

Di form Vercel (saat import atau via **Settings → Environment Variables**), tambahkan:

| Nama Variable | Nilai |
|---|---|
| `DATABASE_URL` | `postgresql://postgres.[ref]:[PASS]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres` |
| `NEXTAUTH_SECRET` | *(hasil `openssl rand -base64 32` dari langkah 6.1)* |
| `NEXTAUTH_URL` | `https://nama-proyek-anda.vercel.app` ← ganti dengan URL Vercel Anda |
| `NEXT_PUBLIC_APP_NAME` | `LPM UIN Sunan Gunung Djati Bandung` |
| `NEXT_PUBLIC_APP_URL` | `https://nama-proyek-anda.vercel.app` |

Pastikan environment yang dipilih: ✅ `Production` ✅ `Preview` ✅ `Development`

### 6.3 — Deploy!

Setelah semua terisi, klik **"Deploy"**.

Proses build berlangsung 1–3 menit. Vercel akan:
1. Clone repository dari GitHub
2. `npm install` → `npm run build`
3. Deploy ke CDN global Vercel

Jika berhasil → URL seperti `https://lpm-uin-sgd-xxxx.vercel.app` aktif.

> 💡 **Tip:** URL Vercel akan terlihat seperti `https://lpm-uin-sgd-test-mkhansa067.vercel.app`. Salin URL ini dan **update** nilai `NEXTAUTH_URL` dan `NEXT_PUBLIC_APP_URL` di Environment Variables Vercel, lalu **Redeploy**.

---

## 7. Konfigurasi Upload File

> ⚠️ **Keterbatasan Vercel:** Vercel adalah platform **serverless/stateless** — file yang di-upload via `POST /api/uploads` disimpan ke `public/uploads/` yang bersifat sementara dan **hilang setiap re-deploy**.

### Opsi A — Supabase Storage (Direkomendasikan) ✅

Supabase menyediakan object storage gratis untuk file PDF dan gambar.

**Setup bucket:**

1. Supabase → klik **"Storage"** di sidebar
2. **"New bucket"** → nama: `lpm-uploads` → centang **"Public bucket"** → Create
3. Klik bucket `lpm-uploads` → **"Policies"** → **"New Policy"** → **"For full customization"**
   - Policy name: `Allow public read`
   - Allowed operations: ✅ `SELECT`
   - Target roles: `anon`
   - Klik **Review** → **Save**

**Cara pakai tanpa ubah kode:**

1. Upload file PDF/gambar langsung via **Supabase Storage UI** (drag & drop)
2. Klik file yang sudah diupload → salin **Public URL**
3. Gunakan URL itu sebagai **"Link PDF Eksternal"** di form admin Dokumen Mutu

Format URL Supabase Storage:
```
https://xxxxxxxxxxxx.supabase.co/storage/v1/object/public/lpm-uploads/nama-file.pdf
```

### Opsi B — Link Eksternal (Tanpa Perubahan Kode) ✅

Admin bisa langsung memasukkan URL file yang sudah ada di internet:

- **Google Drive:** Upload file → klik kanan → "Get link" → ganti `...share...` ke `...uc?export=download&id=FILE_ID`
- **OneDrive / Dropbox:** Salin direct link
- **Website UIN SGD:** Gunakan link file yang sudah tersedia di situs resmi
- **Supabase Storage:** (lihat Opsi A)

Masukkan URL ini di kolom **"Link PDF Eksternal"** pada form admin Dokumen Mutu.

### Opsi C — Cloudinary / AWS S3 (Advanced)

Untuk integrasi upload penuh dari browser (tanpa buka Supabase Storage), perlu memodifikasi `app/api/uploads/route.ts` untuk menyimpan ke layanan cloud storage eksternal. Ini di luar scope panduan ini.


---

## 8. Verifikasi & Login Admin Pertama

### 8.1 — Cek Halaman Publik

| Halaman | URL | Status yang Diharapkan |
|---|---|---|
| Beranda | `/` | Tampil normal (empty state kalau DB kosong) |
| Dokumen | `/dokumen` | Tampil "Belum ada dokumen" jika DB kosong |
| Berita | `/feeds` | Tampil "Belum ada berita" jika DB kosong |
| SPMI | `/spmi` | Tampil empty state jika DB kosong |
| Akreditasi | `/akreditasi` | Tampil empty state jika DB kosong |

### 8.2 — Login Admin Pertama

Buka: `https://nama-proyek-anda.vercel.app/admin/login`

```
Username : admin
Password : admin123
```

> 🔐 **WAJIB GANTI PASSWORD setelah login pertama!**  
> Dashboard Admin → Manajemen Pengelola → Edit akun → Ganti password.

### 8.3 — Cek Health Check API

```
GET https://nama-proyek-anda.vercel.app/api/health
```

Harus mengembalikan: `{ "status": "ok", "timestamp": "..." }`

### 8.4 — Test CRUD Pertama

1. Login admin → **Kelola CMS Feed** → **"Tambah Feed Baru"**
2. Isi judul, konten, kategori → Simpan
3. Buka `/feeds` → artikel muncul ✅ — koneksi Supabase berhasil!

---

## 9. Custom Domain (Opsional)

### 9.1 — Tambah Domain di Vercel

1. Vercel → project → **Settings** → **"Domains"** → **"Add"**
2. Masukkan domain (misal `lpm.uinsgd.ac.id`) → ikuti instruksi DNS

### 9.2 — Konfigurasi DNS

**Subdomain** (`lpm.uinsgd.ac.id`):
| Type | Name | Value |
|---|---|---|
| `CNAME` | `lpm` | `cname.vercel-dns.com` |

**Root domain** (`uinsgd.ac.id`):
| Type | Name | Value |
|---|---|---|
| `A` | `@` | `76.76.21.21` |

Propagasi DNS: 5 menit – 24 jam.

### 9.3 — Update Environment Variables Setelah Domain Aktif

```
NEXTAUTH_URL          → https://lpm.uinsgd.ac.id
NEXT_PUBLIC_APP_URL   → https://lpm.uinsgd.ac.id
```

Kemudian **Redeploy**: Vercel → **Deployments** → titik tiga (···) → **"Redeploy"**.


---

## 10. Troubleshooting

### ❌ Connection refused / `ECONNREFUSED`

**Penyebab:** `DATABASE_URL` salah atau tidak pakai pooler.

**Solusi:**
- Gunakan **Supabase Pooler** (port `6543`), bukan direct connection (port `5432`)
- Karakter spesial di password harus di-encode URL: `@` → `%40`, `#` → `%23`
- Jangan tambahkan `?sslmode=disable` pada URL Supabase

---

### ❌ NextAuth `UntrustedHost` / redirect loop di `/admin/login`

**Penyebab:** `NEXTAUTH_URL` tidak sesuai URL deployment aktual.

**Solusi:**
- Set `NEXTAUTH_URL` ke URL Vercel yang tepat: `https://lpm-uin-sgd-xxxx.vercel.app`
- Jangan tambahkan trailing slash di akhir URL
- Jika pakai custom domain, update ke domain tersebut
- File `auth.config.ts` sudah ada `trustHost: true` — pastikan build menggunakan file terbaru

---

### ❌ Build Vercel gagal

**Solusi:** Pastikan build berhasil lokal dulu:
```bash
cd lpm-uin-sgd
npm run build
# Harus: 0 errors, 29 routes compiled
```

Jika lokal berhasil tapi Vercel gagal, pastikan semua file sudah ter-commit:
```bash
git status
git add .
git commit -m "fix: missing files"
git push origin main
```

---

### ❌ Halaman publik kosong — tidak ada data

**Penjelasan:** Normal! Database baru dibuat, belum ada isi. Halaman publik (v0.10.0) menampilkan **empty state** yang bersih.

**Solusi:** Tambahkan data via dashboard admin `/admin/login`.

---

### ❌ Login admin gagal: "Username atau password salah"

**Solusi:**
1. Supabase → **Table Editor** → cek tabel `lpm_admins`
2. Jika kosong, jalankan ulang bagian INSERT dari langkah 4.3
3. Pastikan `DATABASE_URL` di Vercel mengarah ke project Supabase yang benar

---

### ❌ File upload hilang setelah re-deploy

**Penjelasan:** Vercel filesystem sementara — file di `public/uploads/` hilang saat re-deploy.

**Solusi:** Gunakan **Supabase Storage** (Opsi A) atau **Link Eksternal** (Opsi B) dari [bagian 7](#7-konfigurasi-upload-file).

---

## 11. Ringkasan Environment Variables

| Variable | Environment | Wajib | Keterangan |
|---|---|---|---|
| `DATABASE_URL` | Production | ✅ | Connection string Supabase Pooler (port 6543) |
| `NEXTAUTH_SECRET` | Production | ✅ | Secret JWT min. 32 karakter — `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Production | ✅ | URL Vercel aktif, misal `https://lpm-uin-sgd-xxxx.vercel.app` |
| `NEXT_PUBLIC_APP_NAME` | All | ✅ | `LPM UIN Sunan Gunung Djati Bandung` |
| `NEXT_PUBLIC_APP_URL` | All | ✅ | Sama dengan `NEXTAUTH_URL` |

> 💡 Untuk environment **Preview** (branch non-main), bisa gunakan nilai yang sama dengan Production, atau buat project Supabase terpisah khusus testing.

---

## 🏗️ Arsitektur Deployment

```
┌──────────────────────────────────────────────────────────────┐
│                        PRODUKSI                              │
│                                                              │
│  ┌─────────────┐    HTTPS     ┌──────────────────────────┐  │
│  │   Browser   │ ───────────► │   Vercel CDN / Edge      │  │
│  │   (Publik)  │              │   Next.js 16 Standalone  │  │
│  └─────────────┘              │                          │  │
│                               │   /api/* routes          │  │
│  ┌─────────────┐              │   (Serverless Functions) │  │
│  │    Admin    │ ───────────► │                          │  │
│  │   Browser   │              └────────────┬─────────────┘  │
│  └─────────────┘                           │ SSL / TLS       │
│                                            │ Port 6543       │
│                               ┌────────────▼─────────────┐  │
│                               │   Supabase               │  │
│                               │   PostgreSQL 15          │  │
│                               │   + Connection Pooler    │  │
│                               └──────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

**Flow Login Admin:**
```
/admin/login
  → POST /api/auth/signin  (NextAuth.js v5)
  → lib/auth.ts            (Credentials Provider)
  → query lpm_admins       (Drizzle ORM → Supabase)
  → bcrypt.compare()       (verifikasi password hash)
  → JWT cookie
  → /admin/dashboard
```

---

*Panduan ini dibuat khusus untuk proyek LPM UIN SGD — v0.10.0*  
*Diperbarui: 23 September 2026*

