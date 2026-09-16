# 📋 Log Perubahan — LPM UIN SGD (v0.1.0 - Iterasi 0)

**Versi:** `v0.1.0`
**Tanggal:** 2026-09-10
**Tipe:** `chore` | `docs` | `feat`
**Developer:** AI Agent (Cline)

---

### ✅ Yang Ditambahkan
1. **Inisialisasi Proyek Next.js 14+ (App Router):**
   - TypeScript, Tailwind CSS v4, Lucide Icons, Geist Font setup.
   - Konfigurasi `standalone` export pada `next.config.ts` untuk kompatibilitas Docker multi-stage.

2. **Dokumentasi Teknis Lengkap (`docs/`):**
   - `docs/dokumentasi.md`: Panduan umum arsitektur & teknologi.
   - `docs/api.md`: Spesifikasi REST & Dynamic API Endpoints.
   - `docs/database.md`: Skema Drizzle ORM & ERD PostgreSQL (6 tabel utama: `lpm_documents`, `lpm_accreditation`, `lpm_feeds`, `lpm_admins`, `lpm_audit_logs`, `lpm_surveys`).
   - `docs/deployment.md`: Panduan Multi-Stage Docker & Compose deployment.
   - `docs/auth.md`: Spesifikasi Keamanan & Autentikasi NextAuth.js.

3. **Infrastruktur Docker & Nginx:**
   - Multi-stage `Dockerfile` (deps, builder, runner ~200MB).
   - `docker-compose.yml` (Development) & `docker-compose.prod.yml` (Production).
   - Nginx reverse proxy configuration (`docker/nginx/nginx.conf`).
   - Init SQL script for PostgreSQL (`docker/postgres/init.sql`).

4. **Koneksi Database & Seed Script:**
   - Skema Drizzle ORM (`lib/schema.ts`) & koneksi DB (`lib/db.ts`).
   - Script hash password bcrypt (`scripts/hash-password.ts`).
   - Script seeding data awal (`scripts/seed.ts`).
