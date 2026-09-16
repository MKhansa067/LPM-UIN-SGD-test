# 📋 Log Perubahan — LPM UIN SGD (v0.6.0 - Iterasi 5)

**Versi:** `v0.6.0`
**Tanggal:** 2026-09-10
**Tipe:** `feat` | `ui` | `public` | `admin` | `api`
**Developer:** AI Agent (Cline)

---

### ✅ Yang Ditambahkan

1. **Public Tautan Module (`/tautan`):**
   - Halaman direktori tautan resmi yang dikategorikan (Lembaga & Kementerian, UIN SGD, Akademik & Penelitian, Standar & Kelembagaan, Jurnal & Publikasi, Lainnya).
   - Setiap kategori memiliki kartu dengan header berwarna (emerald, blue, amber, violet, rose, slate), deskripsi tautan, dan ikon eksternal link.
   - Badge jumlah tautan per kategori + total ringkasan global (6 kategori, 21 tautan resmi).
   - Info box catatan penting dengan kontak LPM.

2. **Public Tentang Kami Module (`/tentang-kami`):**
   - Halaman visi & misi LPM: kartu Visi (emerald-950) dengan 3 poin visi dan kartu Misi (nomor urut) dengan 4 poin misi.
   - Struktur organisasi 3 pusat: Pusat Pengembangan Standar Mutu, Pusat Audit & Pengendalian Mutu, Pusat Pendampingan & Akreditasi — masing-masing dengan deskripsi dan 3 tugas utama + ikon (Sparkles, Target, Eye).
   - Kartu kontak lembaga (Alamat, Telepon, Email) dengan ikon lucide.

3. **Feed Detail Sections Renderer (`/feeds/[id]`):**
   - Komponen rendering dinamis untuk `sections` JSONB dari CMS.
   - Seksi `text` dirender sebagai blok teks kelabu dengan `whitespace-pre-line`.
   - Seksi `pdf_viewer` dirender sebagai viewer iframe emerald-950 dengan tombol unduh dan toolbar tersembunyi (`#toolbar=0`).
   - Mendukung banyak seksi dengan penomoran "DOKUMEN SEKSI N".

4. **Admin Audit Log Page (`/admin/dashboard/audit-log`):**
   - Halaman penuh untuk memantau log aktivitas & keamanan admin.
   - Filter aksi (Semua/LOGIN/CREATE/UPDATE/DELETE) dan pencarian teks di seluruh field (pengelola, modul, keterangan).
   - Tabel responsif dengan badge berwarna per aksi, avatar inisial, timestamp `id-ID` yang diformat dengan `toLocaleString`.
   - Loading state, empty state, dan footer "Audit Trail PostgreSQL".

5. **Admin User Management Page (`/admin/dashboard/users`):**
   - CRUD akun admin pengelola: tabel (Admin, Username, Role, Status, Login Terakhir, Aksi), pencarian.
   - Modal form "Tambah Admin Baru" dengan validasi client-side, pilihan role (Admin/Superadmin/Editor), password minimum 6 karakter.
   - Hapus admin dengan dialog konfirmasi.

6. **API `/api/audit-logs` (GET):**
   - Mengambil log audit dari tabel `lpm_audit_logs` (Drizzle ORM) dengan fallback data sampel.
   - Filter `action` dan `q` (pencarian text).
   - Helper `stringifyDetails` untuk membungkus kolom `details` JSONB.

7. **API `/api/admin/users` (GET/POST/DELETE):**
   - `GET` — daftar admin dari `lpm_admins` (Drizzle) dengan fallback sampel.
   - `POST` — buat admin baru dengan hashing password bcrypt (10 salt rounds).
   - `DELETE` — hapus admin berdasarkan ID.

8. **Navigasi & Shell Enhancement:**
   - Sidebar admin: menu baru "Kelola Admin" (`/admin/dashboard/users`) dan "Log Aktivitas" (`/admin/dashboard/audit-log`).
   - Navbar desktop: tautan "Tentang" baru (`/tentang-kami`), dropdown Tautan kini mengarah ke halaman `/tautan` penuh + tautan cepat SIAKAD & BAN-PT.
   - Menu mobile lengkap: Beranda, Profil LPM, Tentang Kami, Dokumen Mutu & Monev, SPMI, Data Akreditasi, Berita & Pengumuman, Event, Tautan.
   - Menghapus placeholder kosong `app/(public)/` yang sudah digantikan halaman root.

9. **Docs Update:**
   - `docs/api.md`: dokumentasi section 4 (Audit Logs), 5 (Admin Users), renumbering Health Check ke 6.
   - `docs/log.md`: masuk ke v0.6.0.

### 🧪 Validasi Build
- `npm run build` menghasilkan **zero TypeScript errors** dan **27 route** berhasil dikompilasi.
- Route baru terdaftar: `/tautan`, `/tentang-kami`, `/admin/dashboard/audit-log`, `/admin/dashboard/users`, `/api/audit-logs`, `/api/admin/users`.
- Semua UI berbahasa Indonesia konsisten dengan standar desain emerald/amber, flat modern, glassmorphism, dan responsive.