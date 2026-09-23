# 📋 Log Perubahan Master — LPM UIN SGD

Dokumen ini berisi linimasa utama perubahan sistem per iterasi. Rincian setiap versi juga tersedia pada file log khusus:
- [`docs/log-0.md`](./log-0.md) — Iterasi 0 (v0.1.0)
- [`docs/log-1.md`](./log-1.md) — Iterasi 1 (v0.2.0)
- [`docs/log-2.md`](./log-2.md) — Iterasi 2 (v0.3.0)
- [`docs/log-3.md`](./log-3.md) — Iterasi 3 (v0.4.0)
- [`docs/log-4.md`](./log-4.md) — Iterasi 4 (v0.5.0)
- [`docs/log-5.md`](./log-5.md) — Iterasi 5 (v0.6.0)
- [`docs/log-6.md`](./log-6.md) — Iterasi 6 (v0.7.0)
- [`docs/log-7.md`](./log-7.md) — Iterasi 7 (v0.8.0)
- [`docs/log-8.md`](./log-8.md) — Iterasi 8 (v0.8.5)
- [`docs/log-9.md`](./log-9.md) — Iterasi 9 (v0.9.0)
- [`docs/log-10.md`](./log-10.md) — Iterasi 10 (v0.9.5)
- [`docs/log-11.md`](./log-11.md) — Iterasi 11 (v0.10.0)


---
## [v0.10.0] — 2026-09-16 (Iterasi 11: Total Demo Data Removal — Portal Publik 100% Real Database & Opsi Upload PDF)
**Tipe:** `feat` | `fix` | `db` | `public` | `admin` | `ui`
**Developer:** AI Agent (Cline)
*Lihat rincian lengkap di [`docs/log-11.md`](./log-11.md)*

### ✅ Yang Diperbaiki & Ditambahkan
- **Penghapusan Total Data Demo di Portal Publik**: Halaman `/dokumen`, `/feeds`, `/spmi`, `/akreditasi`, dan komponen `HomeFeeds.tsx` kini **100% membaca data riil dari PostgreSQL**. Seluruh array statis (`mockDocs`, `feedsData`, `fallbackDocs`, `mockAcc`, `fallbackFeeds`, `sampleFeeds`) dihapus.
- **Sinkronisasi CRUD Admin → Portal**: Dokumen/feed yang dihapus di dashboard admin langsung hilang dari tampilan publik; data baru langsung muncul tanpa refresh manual.
- **9 Sub-Kategori Dokumen Mutu Resmi**: AMI, AME, Renstra & RIP LPM, Sertifikasi ISO, Laporan Monev Pembelajaran, Laporan Survei Kepuasan, Uji Validitas Data SPMI, Kebijakan Mutu SPMI, dan Siklus PPEPP pada dashboard Dokumen Mutu.
- **Dua Opsi File PDF**: Admin dapat **upload file PDF** (via `/api/uploads`) ATAU memasukkan **link PDF eksternal**.
- **Empty State di Semua Halaman Publik**: Jika database kosong, halaman menampilkan pesan kosong yang bersih (bukan data demo), termasuk halaman **Event** (`/feeds?category=Event`).
- **API Detail Feed Bersih**: `GET /api/feeds/[id]` kini mengembalikan 404 jika feed tidak ditemukan (fallback `sampleFeeds` dihapus).

---

## [v0.9.5] — 2026-09-16 (Iterasi 10: Fix State Persistence Bug — Multi-Create Form Reset Trial-and-Error)
**Tipe:** `fix` | `admin` | `ui` | `refactor`
**Developer:** AI Agent (Cline)
*Lihat rincian lengkap di [`docs/log-10.md`](./log-10.md)*

### ✅ Yang Diperbaiki
- **Penanganan State Persistence / Stale Form Bug**: Mengatasi masalah di mana membuat item baru (Feed, Dokumen Mutu, SPMI, Akreditasi, Admin User) kedua kalinya dalam satu sesi justru mengedit item pertama karena `editId` / input state lama tidak dibersihkan.
- **Helper `resetForm()` & `openCreateModal()`**: Menambahkan pembersihan state penuh pada event handler klik tombol "Tambah Baru" serta pada akhir penanganan submit berhasil di `CMS Feeds`, `Dokumen Mutu`, `SPMI`, `Akreditasi`, dan `Users`.
- **Akreditasi Grid Multi-Edit Prevention**: `openNew()` mengeset `editingId = null` dan `openEdit()` mengeset `showNewRow = false` untuk mencegah konflik interaksi baris spreadsheet.

---

## [v0.9.0] — 2026-09-16 (Iterasi 9: Dynamic Audit Logging, Clean DB Single-Source-of-Truth, Dynamic Views & Stats)
**Tipe:** `feat` | `fix` | `db` | `audit` | `api` | `admin`
**Developer:** AI Agent (Cline)
*Lihat rincian lengkap di [`docs/log-9.md`](./log-9.md)*

### ✅ Yang Ditambahkan & Diperbaiki
- **Dynamic Permanent Audit Logging (`lpm_audit_logs`)**: Helper `recordAuditLog()` (`lib/audit.ts`) menyisipkan setiap tindakan admin (Login, CRUD Feeds, Dokumen, SPMI, Akreditasi, Admin Users) secara permanen ke PostgreSQL.
- **Join Admin Audit Log**: Endpoint `GET /api/audit-logs` melakukan `LEFT JOIN` ke `lpm_admins` untuk menampilkan nama admin pengelola asli.
- **Pengosongan Array Sampel Statis**: Menghapus seluruh mock fallback array pada API (`/api/feeds`, `/api/dokumen`, `/api/spmi`, `/api/akreditasi`, `/api/admin/users`) agar tabel tidak memunculkan data hantu yang muncul-tenggelam.
- **Real-Time Overview Stats (`/api/admin/stats`)**: Menampilkan total feed, total pembaca artikel (`SUM(view_count)`), total dokumen, dan persentase prodi Unggul secara dinamis dari database.
- **Dynamic Relative Time Widget**: `AuditLog.tsx` pada overview dashboard diubah menjadi komponen dinamis dengan kalkulasi waktu relatif riil ("Baru saja", "X detik lalu", "X menit lalu").

---

## [v0.8.5] — 2026-09-14 (Iterasi 8: Rombak UI Beranda — Wide Header Logo, Hero Banner & Feeds Dokumentasi)
**Tipe:** `feat` | `ui` | `public`
**Developer:** AI Agent (Cline)
*Lihat rincian lengkap di [`docs/log-8.md`](./log-8.md)*

### ✅ Yang Ditambahkan
- Header Logo `logo-uin-blu-akre.webp` di kiri atas dan Hero Banner `logo-lpm.webp` di bagian utama.
- Rombak total `HomeFeeds.tsx` untuk mengambil foto dokumentasi real-time dari database PostgreSQL.
- Komponen `SocialIcons.tsx` dengan SVG inline untuk brand sosial media (FB, IG, YT, X).

---

## [v0.8.0] — 2026-09-11 (Iterasi 7: CMS Polish — Uploads, Draft/Publish, Drag-Drop Sections, Feed Preview)
**Tipe:** `feat` | `ui` | `admin` | `editor` | `api` | `refactor`
**Developer:** AI Agent (Cline)
*Lihat rincian lengkap di [`docs/log-7.md`](./log-7.md)*

### ✅ Yang Ditambahkan
- API Upload `POST /api/uploads` (gambar & PDF, max 10 MB, MIME whitelist, nama file crypto-random) + `GET /api/uploads/[filename]` (serve dari disk, aman di `next dev`/`next start`/standalone).
- Tombol upload gambar di toolbar TipTap → sisipkan gambar ke konten feed.
- Komponen shared `FeedArticle` — satu renderer untuk halaman publik `/feeds/[id]` dan modal preview CMS (~150 baris duplikasi dihapus).
- Draft/Publish states: `isPublished`, toggle PATCH `/api/feeds/[id]`, dan `GET /api/feeds?all=1` (CMS melihat draft; publik hanya published).
- CMS Feed Page: filter status, toggle publish, section drag-drop reorder (HTML5 native), upload button untuk gambar sampul & PDF seksi, dan `FeedPreviewModal` live preview.
- `.gitignore` ditambahkan `/public/uploads/`; `next.config.ts` override `X-Frame-Options: SAMEORIGIN` untuk `/api/uploads/*` (iframe PDF).

---

## [v0.7.0] — 2026-09-11 (Iterasi 6: TipTap Rich Text Editor, CMS Feed Edit Mode, Enhanced Sections)
**Tipe:** `feat` | `ui` | `admin` | `editor` | `refactor`
**Developer:** AI Agent (Cline)
*Lihat rincian lengkap di [`docs/log-6.md`](./log-6.md)*

### ✅ Yang Ditambahkan
- TipTap Rich Text Editor (`TiptapEditor.tsx`): komponen WYSIWYG dengan toolbar lengkap (bold, italic, headings, lists, links, images, blockquote, code, undo/redo).
- CMS Feed Edit Mode: tombol edit pada tabel, modal dual-mode (create/edit), PUT API endpoint untuk pembaruan feed.
- Section Builder ditingkatkan: tipe baru `heading`, input inline per seksi (heading/text/pdf_viewer), dan icon visual per tipe.
- Feed Detail HTML Rendering: deteksi konten HTML dari TipTap dengan `dangerouslySetInnerHTML` + Tailwind prose styling; fallback plain text untuk konten lama.
- Dashboard Quick-Action Links diperbaiki — mengarah ke halaman CMS dan Dokumen yang benar (sebelumnya 404).

---

## [v0.6.0] — 2026-09-10 (Iterasi 5: Tautan & Tentang Kami, Feed Sections Renderer, Admin Users & Audit Log Pages)
**Tipe:** `feat` | `ui` | `public` | `admin` | `api`
**Developer:** AI Agent (Cline)
*Lihat rincian lengkap di [`docs/log-5.md`](./log-5.md)*

### ✅ Yang Ditambahkan
- Modul Publik Tautan (`/tautan`): direktori 6 kategori tautan resmi dengan 21 tautan (Lembaga, UIN SGD, Akademik, Standar, Jurnal, Lainnya).
- Modul Publik Tentang Kami (`/tentang-kami`): visi, misi, dan struktur 3 Pusat Pengembangan Mutu + kontak lembaga.
- Feed Detail Sections Renderer (`/feeds/[id]`): render dinamis `sections` JSONB (text blocks & embedded PDF viewer).
- Admin Audit Log Page (`/admin/dashboard/audit-log`): filter aksi, pencarian, badge warna, timestamp terformat.
- Admin User Management (`/admin/dashboard/users`): CRUD akun admin dengan hashing bcrypt.
- API `/api/audit-logs` (GET) dan `/api/admin/users` (GET/POST/DELETE) dengan Drizzle ORM + fallback statis.
- Navigasi diperbarui: menu "Kelola Admin" & "Log Aktivitas" di sidebar admin; tautan "Tentang" & dropdown Tautan ke `/tautan` di public navbar; menu mobile lengkap.

## [v0.5.0] — 2026-09-10 (Iterasi 4: Public SPMI & Profil, Admin CMS CRUD Workspaces, dan Auth Guard)
**Tipe:** `feat` | `ui` | `public` | `admin` | `api` | `security`
**Developer:** AI Agent (Cline)
*Lihat rincian lengkap di [`docs/log-4.md`](./log-4.md)*

### ✅ Yang Ditambahkan
- Modul Publik SPMI (`/spmi`): hero banner, visualisasi siklus PPEPP, repositori dokumen SPMI dengan search & filter kategori, dan unduh PDF.
- Modul Publik Profil LPM (`/profil`): sambutan Ketua LPM, Visi & Misi, dan struktur 3 Pusat Pengembangan Mutu.
- API Full CRUD `/api/spmi` (GET, POST, DELETE) dengan dukungan Drizzle ORM + fallback data statis.
- Admin CMS Workspaces baru: `/admin/dashboard/cms` (dengan Component-Driven Layout Generator sections JSONB), `/admin/dashboard/dokumen`, `/admin/dashboard/spmi`, `/admin/dashboard/akreditasi` (inline grid editor), dan `/admin/dashboard/pengaturan`.
- Authentication Guard pada layout admin dashboard (server component) via NextAuth `auth()` + redirect ke `/admin/login`.
- API CRUD Expansions: `POST /api/feeds`, `PUT/DELETE /api/feeds/[id]`, `POST/DELETE /api/dokumen`, `POST/DELETE /api/akreditasi`.

## [v0.4.0] — 2026-09-10 (Iterasi 3: Modul Sub-Rute Publik, Feed CMS, Repositori Dokumen & Dashboard Akreditasi)
---
**Tipe:** `feat` | `ui` | `public` | `api`
**Developer:** AI Agent (Cline)
*Lihat rincian lengkap di [`docs/log-3.md`](./log-3.md)*

### ✅ Yang Ditambahkan
- Modul Publik Feeds (`/feeds` & `/feeds/[id]`): Filter Berita/Pengumuman, Arsip Tahun (2016-2026), Auto View Counter, dan Scrollable Embedded PDF Viewer.
- Modul Repositori Dokumen Mutu (`/dokumen`): Live search & multi-category filter (Regulasi, Monev, SPMI) + Direct PDF Download.
- Dashboard Akreditasi Real-time (`/akreditasi`): Visualisasi Recharts (Pie & Bar chart), filter Triwulan vs Semester, serta tabel interaktif prodi & unduh SK.
- API Handlers: `/api/feeds`, `/api/feeds/[id]`, `/api/feeds/[id]/view`, `/api/dokumen`, `/api/akreditasi`.

---



## [v0.3.0] — 2026-09-10 (Iterasi 2: Public Portal, Branding, MegaMenu & Bento Hub)
**Tipe:** `feat` | `ui` | `public`
**Developer:** AI Agent (Cline)
*Lihat rincian lengkap di [`docs/log-2.md`](./log-2.md)*

### ✅ Yang Ditambahkan
- Top Header Kontak & Media Sosial + Main Branding Bar UIN SGD & LPM (Logo UIN, LPM, BLU, BAN-PT Unggul).
- Navbar Sticky Glassmorphism + MegaMenu 2-Kolom Grid untuk Dokumen Mutu & Monev.
- High-Impact Hero Section + Bento Grid Quick Visual Hub (Counter Unggul, Inline Search).
- Bento Dashboard Highlights (Progress Unggul Ring, Timeline AMI, Analytics Survei).
- Dual-Tab Feeds (Berita Terkini & Pengumuman Resmi).
- Public Footer UIN SGD lengkap dengan informasi alamat, kontak, dan tautan cepat.

---

## [v0.2.0] — 2026-09-10 (Iterasi 1: Auth Admin & Admin Workspace Shell)
**Tipe:** `feat` | `security` | `ui`
**Developer:** AI Agent (Cline)
*Lihat rincian lengkap di [`docs/log-1.md`](./log-1.md)*

### ✅ Yang Ditambahkan
- Pembuatan Halaman Login Admin (`/admin/login`) dengan Clean Flat UI.
- Pengintegrasian `NextAuth.js v5` Credentials Provider (`signIn("credentials")`) dengan bcrypt.
- Proteksi Middleware pada seluruh rute `/admin/dashboard/*`.
- Layout Admin Shell Workspace (`Sidebar.tsx`, `Topbar.tsx`).
- Overview Analytics Dashboard & Audit Log (`AuditLog.tsx`).

---

## [v0.1.0] — 2026-09-10 (Iterasi 0: Inisialisasi & Fondasi Arsitektur)
**Tipe:** `chore` | `docs` | `feat`
**Developer:** AI Agent (Cline)
*Lihat rincian lengkap di [`docs/log-0.md`](./log-0.md)*

### ✅ Yang Ditambahkan
- Inisialisasi proyek Next.js 14+ (App Router) + TypeScript + Tailwind CSS.
- Pembuatan struktur folder & 6 file dokumentasi teknis (`docs/`).
- Pembuatan konfigurasi Docker multi-stage & Docker Compose (`Dockerfile`, `docker-compose.yml`, `nginx.conf`, `init.sql`).
- Konfigurasi Drizzle ORM schema (`lib/schema.ts`) & database connection (`lib/db.ts`).

