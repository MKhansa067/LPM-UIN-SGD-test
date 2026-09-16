# 📚 Dokumentasi Teknis — LPM UIN SGD

Website Portal & CMS Lembaga Penjaminan Mutu (LPM) UIN Sunan Gunung Djati Bandung.

---

## 📌 Gambaran Umum
Website ini dirancang untuk menggantikan portal lama LPM UIN SGD dengan tampilan modern, flat/clean UI (tanpa warna gradasi), akreditasi real-time per triwulan/semester, manajemen dokumen mutus/SPMI, serta CMS Berita & Pengumuman yang dinamis dan ter-dockerisasi.

---

## 🛠️ Tech Stack
- **Framework:** Next.js 14+ (App Router, Standalone Output)
- **Bahasa:** TypeScript
- **Styling:** Tailwind CSS (Flat UI, Emerald Green `#064e3b` & Amber Gold `#f59e0b`)
- **Autentikasi:** NextAuth.js v5 (Credentials Provider + JWT Strategy)
- **Database:** PostgreSQL (via Drizzle ORM)
- **Rich Text Editor:** TipTap Editor
- **Grafik Analytics:** Recharts
- **Animasi:** Framer Motion
- **Ikon:** Lucide React
- **Containerization:** Docker & Docker Compose (Multi-stage build)

---

## 🚀 Quick Start (Local Development)

### Menggunakan Docker (Rekomendasi)
```bash
# 1. Copy env file
cp .env.example .env.local

# 2. Jalankan docker compose
docker compose up -d

# 3. Akses di browser: http://localhost:3000
```

### Tanpa Docker
```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Setup .env.local dengan DATABASE_URL PostgreSQL Anda

# 3. Jalankan database migration & seed
npm run db:push
npm run seed

# 4. Jalankan development server
npm run dev
```

---

## 📁 Struktur Utama Proyek
- `app/(public)/` — Halaman pengunjung publik (Beranda, Informasi, Dokumen, SPMI, Akreditasi, Tautan)
- `app/admin/` — Halaman workspace admin (Dashboard, CMS, Dokumen, Akreditasi, Pengaturan)
- `app/api/` — API Routes (Feeds, Dokumen, Akreditasi, SPMI, Auth, Health)
- `components/` — Reusable React UI components
- `lib/` — Konfigurasi auth, database, rate limiter, zod schemas
- `docs/` — Dokumentasi proyek lengkap
- `docker/` — Konfigurasi Nginx & Postgres container
