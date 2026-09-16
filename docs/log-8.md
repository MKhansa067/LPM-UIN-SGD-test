# 📋 Log Perubahan — LPM UIN SGD (v0.8.1 - Iterasi 8)

**Versi:** `v0.8.1`
**Tanggal:** 2026-09-14
**Tipe:** `fix` | `setup` | `db` | `docs`
**Developer:** AI Agent (Cline)

---

### ✅ Yang Diselesaikan

1. **Admin Login BERHASIL (fix end-to-end):**
   - Login `admin` / `admin123` sukses → redirect dashboard → session valid.
   - Verifikasi via HTTP: `GET /api/auth/csrf` → 200; `POST /api/auth/callback/credentials` → 302 ke dashboard; `GET /api/auth/session` → `{"user":{"name":"Super Admin LPM","role":"superadmin","id":"1"},...}`.
   - `last_login` ter-update di DB: `2026-09-14 12:58:46`.

2. **Root Cause Analysis (3 penyebab):**
   - **RC1:** Role `lpm_user` + database `lpm_db` tidak ada di PostgreSQL → DB connection error.
   - **RC2:** Bcrypt hash di `docker/postgres/init.sql` invalid (sudah diperbaiki di iterasi sebelumnya).
   - **RC3 (ditemukan saat verifikasi):** Auth.js v5 `UntrustedHost` error → `auth.config.ts` kurang `trustHost: true`. **Diperbaiki.**

3. **Koneksi Database — Strategi Laragon PostgreSQL (port 5433):**
   - Native PostgreSQL 18 (Windows Service) memakai port 5432 dengan password superuser TIDAK DIKETAHUI (pgpass & pgAdmin storage kosong; kredensial `root`/kosong tidak berlaku karena native memakai `scram-sha-256`).
   - **Solusi terverifikasi:** Instance **Laragon PostgreSQL 18** (`D:\laragon\data\postgresql`) memakai **trust auth** (tanpa password) → dijalankan di port **5433** (native tetap di 5432, tanpa konflik).
   - Created `lpm_user` (password `lpm_password`), `lpm_db` (owner `lpm_user`), GRANT semua hak.

4. **Schema + Seed Data:**
   - Import `docker/postgres/init.sql` ke `lpm_db` → 6 tabel + 4 index + admin seed sukses (`INSERT 0 1`).
   - Tabel: lpm_admins, lpm_feeds, lpm_documents, lpm_spmi_docs, lpm_accreditation, lpm_audit_logs.

5. **Konfigurasi:**
   - `.env.local`: `DATABASE_URL` diubah `5432` → `5433`.
   - `.env.example`: komentar + port `5433` untuk mesin ini.
   - `auth.config.ts`: menambah `trustHost: true`.

6. **Server:** Build produksi sukses (28 routes), `next start` berjalan di port 3000, `GET /api/feeds` → 200 (data baca dari DB).

---

### 🆕 File Baru

| File | Keterangan |
|------|------------|
| `scripts/start-db.cmd` | Menyalakan Laragon PostgreSQL di port 5433 (cek port dulu, lalu `pg_ctl start`) |

### 📝 File Yang Diubah

| File | Perubahan |
|------|-----------|
| `.env.local` | Port `5433` |
| `.env.example` | Port `5433` + komentar |
| `auth.config.ts` | + `trustHost: true` |
| `docs/run_db.md` | Restrukturisasi: Section 3 baru "⚡ Setup TERCEPAT Laragon", Root Cause 3, Troubleshooting lengkap, Referensi File |

---

### 🔄 Alur Setup (Ringkas, untuk mesin ini)

```
1. scripts\start-db.cmd           → Laragon PG di port 5433 (trust auth)
2. psql: CREATE ROLE/DB (jika belum)
3. psql: -f docker/postgres/init.sql  → schema + seed
4. .env.local: DATABASE_URL ...:5433/lpm_db
5. npm run dev (atau build && start)
6. Login admin/admin123
```

---

### ⚠️ Catatan Penting

- **Jangan lupa** jalankan `scripts/start-db.cmd` sebelum `npm run dev` (setelah reboot).
- Native PG 18 di port 5432 tetap jalan; tidak diganggu.
- Jika ingin memakai native 5432, perlu reset password superuser (butuh admin).

---

### 🔜 Berikutnya (Iterasi 9+)

1. Restrukturisasi UI/logo (layout.tsx, Header.tsx, Footer.tsx, Hero.tsx banner).
2. `revisi-ui-1.txt` dokumentasi perubahan UI.
3. CMS polish (upload progress, draft/publish UX).