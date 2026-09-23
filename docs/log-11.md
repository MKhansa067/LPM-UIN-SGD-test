# 📋 Log Perubahan — Iterasi 11 (v0.10.0)

**Tanggal:** 16 September 2026  
**Versi:** `v0.10.0`  
**Tipe:** `feat` | `fix` | `db` | `public` | `admin` | `ui`  
**Developer:** AI Agent (Cline)

---

## 📑 Ringkasan Eksekutif

Iterasi 11 menuntaskan **penghapusan seluruh data demo/hardcoded** pada sisi portal publik agar tampilan 100% membaca data riil dari database PostgreSQL yang dikelola melalui dashboard admin. Masalah utama yang dilaporkan user: dokumen yang sudah dihapus di dashboard admin (misal dokumen bawaan AMI) **masih tampil** di halaman publik `/dokumen` karena halaman tersebut menggunakan array statis (`mockDocs`) — bukan data API.

Selain itu ditambahkan:
- **Daftar sub-kategori Dokumen Mutu lengkap** (9 kategori) untuk dikelola admin.
- **Dua opsi file PDF** (upload file ATAU link eksternal) untuk dokumen mutu.
- **Tampilan list kosong (empty state)** di semua modul publik apabila database belum memiliki data.
- Halaman **Event** (`/feeds?category=Event`) kini mengikuti isi database: kosong jika admin belum menambahkan, riil jika sudah ditambahkan.

---

## 🐛 Masalah Yang Ditemukan (Issue Summary)

- **Halaman `/dokumen` (Dokumen Mutu)**: Memakai array `mockDocs` statis di dalam kode komponen. Akibatnya perubahan/hapus dokumen di dashboard admin **tidak pernah tercermin** di portal publik. Dokumen bawaan yang sudah dihapus admin tetap muncul.
- **Halaman `/feeds` (Berita & Pengumuman)**: Memakai array `feedsData` statis sehingga tidak sinkron dengan CMS.
- **Komponen `HomeFeeds.tsx` (Beranda)**: Inisialisasi state dengan `fallbackFeeds` statis dan hanya melakukan `setFeeds()` bila `data.length > 0`. Jika database kosong, beranda tetap menampilkan 6 berita/pengumuman demo.
- **Halaman `/spmi`**: Inisialisasi state dengan `fallbackDocs` statis (3 dokumen SPMI demo).
- **Halaman `/akreditasi`**: Memakai `mockAcc`, `pieData`, dan `barData` statis.
- **API `GET /api/feeds/[id]`**: Memiliki array `sampleFeeds` fallback sehingga `GET /feeds/1` tetap mengembalikan artikel demo meskipun database kosong / feed sudah dihapus.
- **Sub-kategori dokumen lama** (AMI, AME, Renstra & RIP, HAKi, Sertifikasi, dll.) tidak mencakup seluruh kategori yang diminta user.

---

## ⚡ Solusi & Perbaikan Yang Diterapkan

1. **`app/dokumen/page.tsx` (Portal Dokumen Mutu) — 100% Database Driven**:
   - **Hapus seluruh array statis `mockDocs`.**
   - Komponen kini `fetch("/api/dokumen")` dan merender data dari tabel `lpm_documents`.
   - Mendukung filter query `?sub=AMI|AME|Renstra|Kebijakan|PPEPP|Sertifikasi|Monev|Validitas|Survei` dari MegaMenu.
   - Menampilkan chip sub-kategori dinamis dan **empty state** ("Belum ada dokumen pada kategori ini") bila database kosong.

2. **`app/admin/dashboard/dokumen/page.tsx` (Dashboard Admin Dokumen)**:
   - **Sub-kategori diperbarui menjadi 9 kategori resmi:**
     - *Dokumen Regulasi:* `Audit Mutu Internal (AMI)`, `Audit Mutu Eksternal (AME)`, `Renstra & RIP LPM`, `Sertifikasi ISO`
     - *Monitoring & Evaluasi:* `Laporan Monev Pembelajaran`, `Laporan Survei Kepuasan`, `Uji Validitas Data SPMI`
     - *SPMI:* `Kebijakan Mutu SPMI`, `Siklus PPEPP`
   - **Dua opsi file PDF**: tombol **"Upload File PDF"** (memakai `POST /api/uploads`, mengisi `downloadUrl` otomatis) ATAU input **"Link PDF Eksternal"** manual.
   - Tampilkan status URL aktif dan **empty state** pada tabel daftar dokumen.

3. **`app/feeds/page.tsx` (Portal Berita & Pengumuman)**:
   - **Hapus array statis `feedsData`.**
   - Komponen diubah menjadi *client component* yang mengambil data dari `/api/feeds`.
   - Dukungan parameter `?category=Event|Berita|Pengumuman` (link "Event" di Navbar).
   - Menampilkan **empty state** bila tidak ada berita/pengumuman.

4. **`components/public/HomeFeeds.tsx` (Beranda)**:
   - **Hapus `fallbackFeeds`** dan inisialisasi `useState([])`.
   - `setFeeds(json.data)` dilakukan **selalu** (termasuk saat data kosong).
   - Jika database kosong, beranda menampilkan **"Belum ada berita yang dipublikasikan."** dan **"Belum ada pengumuman."**.

5. **`app/spmi/page.tsx` (Portal SPMI)**:
   - **Hapus `fallbackDocs`** dan inisialisasi `useState([])`.
   - Ambil data riil dari `/api/spmi` dengan fallback ke array kosong.
   - **Empty state** untuk kategori yang belum memiliki dokumen.

6. **`app/akreditasi/page.tsx` (Portal Akreditasi)**:
   - **Hapus `mockAcc`, `pieData`, `barData` statis.**
   - Ambil data riil dari `/api/akreditasi`.
   - Grafik pie & bar dihitung dinamis (`useMemo`) dari hasil API.
   - Filter jenjang dinamis dari data yang ada + **empty state**.

7. **`app/api/feeds/[id]/route.ts` (API Detail Feed)**:
   - **Hapus array `sampleFeeds` fallback.**
   - Kini mengembalikan `404 { success:false, error:"Artikel tidak ditemukan" }` bila ID tidak ada di database.

---

## 🧪 Hasil Pengujian & Validasi

| Pengujian | Status | Catatan |
|---|---|---|
| `npx tsc --noEmit` | ✅ Pass | 0 TypeScript Errors |
| `npm run build` | ✅ Pass | 29 Routes compiled cleanly (static + dynamic) |
| Sinkronisasi CRUD Admin → Portal Publik | ✅ Pass | Dokumen/feed yang dihapus admin tidak lagi muncul di portal |
| Empty State DB Kosong | ✅ Pass | Beranda, `/dokumen`, `/feeds`, `/spmi`, `/akreditasi` menampilkan pesan kosong yang bersih |
| Upload PDF + Link Eksternal | ✅ Pass | Dua opsi file tersedia di form Dokumen Mutu admin |

---

## 📁 File Yang Diubah

- `app/dokumen/page.tsx`
- `app/admin/dashboard/dokumen/page.tsx`
- `app/feeds/page.tsx`
- `components/public/HomeFeeds.tsx`
- `app/spmi/page.tsx`
- `app/akreditasi/page.tsx`
- `app/api/feeds/[id]/route.ts`
- `docs/log.md`