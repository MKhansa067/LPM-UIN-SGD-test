# 📋 Log Perubahan — LPM UIN SGD (v0.5.0 - Iterasi 4)

**Versi:** `v0.5.0`
**Tanggal:** 2026-09-10
**Tipe:** `feat` | `ui` | `public` | `admin` | `api` | `security`
**Developer:** AI Agent (Cline)

---

### ✅ Yang Ditambahkan

1. **Public SPMI Module (`/spmi`):**
   - Halaman publik Sistem Penjaminan Mutu Internal dengan hero banner & branding emerald/amber.
   - Visualisasi 5 Tahapan Siklus PPEPP (Penetapan, Pelaksanaan, Evaluasi, Pengendalian, Peningkatan) dalam kartu interaktif.
   - Repositori dokumen SPMI: pencarian kata kunci real-time, filter kategori (Semua, Kebijakan SPMI, PPEPP, Standar Mutu, Kebijakan Mutu), serta tombol unduh PDF.

2. **Public Profil LPM Module (`/profil`):**
   - Halaman profil LPM UIN SGD Bandung: Hero Banner + Sambutan Ketua LPM.
   - Kartu Visi, Misi Utama, dan Struktur Organisasi (Pusat Pengembangan Standar Mutu, Pusat Audit & Pengendalian Mutu, Pusat Pendampingan & Akreditasi).

3. **API Route `/api/spmi` (Full CRUD):**
   - `GET /api/spmi` — Daftar dokumen SPMI dengan filter `category` & pencarian `q`.
   - `POST /api/spmi` — Membuat dokumen SPMI baru.
   - `DELETE /api/spmi?id=` — Menghapus dokumen SPMI.
   - Mendukung koneksi database PostgreSQL (Drizzle ORM) dengan fallback data statis jika DB offline.

4. **Admin CMS Workspaces (`/admin/dashboard/*`):**
   - `/admin/dashboard/cms` — Manajemen Berita/Pengumuman/Event: tabel listing & pencarian, modal form tambah feed, dan **Component-Driven Layout Generator** (`sections` JSONB): tambah seksi `text` & `pdf_viewer`, hapus seksi.
   - `/admin/dashboard/dokumen` — Manajemen Dokumen Mutu & Monev: tabel listing, pencarian, modal tambah dokumen (Kategori Utama, Sub Kategori, Tahun, Unit, URL unduh), serta aksi hapus & unduh.
   - `/admin/dashboard/spmi` — Manajemen Dokumen SPMI: tabel listing (Judul, Kategori, Tahun), modal tambah dokumen, aksi hapus & unduh.
   - `/admin/dashboard/akreditasi` — Spreadsheet-style inline grid editor: tambah baris, edit sel (select Jenjang/Status), simpan, dan hapus data akreditasi prodi.
   - `/admin/dashboard/pengaturan` — Profil admin aktif (Nama, Email, Role, Status Sesi) + status sistem & database.

5. **Authentication Guard pada Admin Dashboard:**
   - Layout server component (`app/admin/dashboard/layout.tsx`) kini memeriksa sesi via `auth()` dari NextAuth v5 dan me-redirect ke `/admin/login` bila tidak terautentikasi.
   - Komponen client `DashboardShell.tsx` memisahkan logika sidebar/topbar dari guard server.

6. **API CRUD Expansions:**
   - `POST /api/feeds` — Membuat feed berita/pengumuman baru (dengan `sections` JSONB).
   - `PUT /api/feeds/[id]` & `DELETE /api/feeds/[id]` — Update & hapus feed.
   - `POST /api/dokumen` & `DELETE /api/dokumen?id=` — Tambah & hapus dokumen mutu.
   - `POST /api/akreditasi` & `DELETE /api/akreditasi?id=` — Tambah & hapus data akreditasi prodi.

### 🧪 Validasi Build
- `npm run build` menghasilkan **zero TypeScript errors** dan **21 route** berhasil dikompilasi (static + dynamic).
- Semua route baru terdaftar: `/spmi`, `/profil`, `/admin/dashboard/cms`, `/admin/dashboard/dokumen`, `/admin/dashboard/spmi`, `/admin/dashboard/akreditasi`, `/admin/dashboard/pengaturan`, `/api/spmi`.