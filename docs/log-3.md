# 📋 Log Perubahan — LPM UIN SGD (v0.4.0 - Iterasi 3)

**Versi:** `v0.4.0`
**Tanggal:** 2026-09-10
**Tipe:** `feat` | `ui` | `public` | `api`
**Developer:** AI Agent (Cline)

---

### ✅ Yang Ditambahkan
1. **Public CMS Feeds Listing & Archive Selector (`/feeds`):**
   - Halaman daftar Berita & Pengumuman publik dengan Filter Kategori (Semua, Berita, Pengumuman).
   - Widget Arsip Berita (Pilihan Tahun 2016-2026) untuk aksesibilitas historis berita.
   - Bilah pencarian kata kunci real-time & indikator pembaca (`dilihat X kali`).

2. **Public Feed Detail Module with Scrollable PDF Viewer (`/feeds/[id]`):**
   - Artikel detail lengkap dengan judul, tanggal rilis, jumlah pembaca, dan banner instansi.
   - Pemicu otomatis penambahan jumlah pembaca (*view counter*) via API `POST /api/feeds/[id]/view`.
   - Modul **Readable PDF Viewer Embed Frame** yang dapat di-scroll langsung pada pengumuman yang memiliki lampiran PDF, lengkap dengan tombol unduh langsung & Google Drive.

3. **Public Repositori Dokumen Mutu Hub (`/dokumen`):**
   - Sistem pencarian & penyaringan multi-kategori (Dokumen Regulasi, Monitoring & Evaluasi, SPMI).
   - Filter sub-kategori (AMI, AME, Renstra & RIP, Kebijakan, PPEPP, Laporan Survei, Sertifikasi ISO).
   - Tabel direktori dokumen publik dengan tombol aksi *Unduh PDF*.

4. **Real-time Accreditation Dashboard Page (`/akreditasi`):**
   - Visualisasi grafik Recharts (Pie Chart sebaran peringkat Unggul & Baik Sekali; Bar Chart sebaran per jenjang S1/S2/S3).
   - Filter Toggle *Real-time Triwulan* (Q1-2026, Q4-2025, dll) vs *Rekap Per Semester* (Genap 2025/2026, Ganjil 2025/2026).
   - Tabel interaktif program studi terakreditasi BAN-PT & LAM dengan pencarian nama prodi, filter jenjang, dan tautan unduh SK.

5. **API Route Handlers:**
   - `GET /api/feeds` — Mengembalikan daftar berita/pengumuman dengan pencarian & filter tahun.
   - `GET /api/feeds/[id]` — Mengembalikan detail artikel feed.
   - `POST /api/feeds/[id]/view` — Menambah counter jumlah pembaca secara real-time.
   - `GET /api/dokumen` — Mengembalikan daftar repositori dokumen mutu.
   - `GET /api/akreditasi` — Mengembalikan data akreditasi prodi & statistik visualisasi.
