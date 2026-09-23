# 📋 Log Perubahan — Iterasi 9 (v0.9.0)

**Tanggal:** 16 September 2026  
**Versi:** `v0.9.0`  
**Tipe:** `feat` | `fix` | `db` | `audit` | `api` | `admin`  
**Developer:** AI Agent (Cline)

---

## 📑 Ringkasan Eksekutif

Iterasi 9 berfokus pada penyelesaian trial-and-error autentikasi database, pencatatan permanent log aktivitas admin (*Audit Trail*) ke PostgreSQL, transparansi data riil tanpa mock fallback statis yang membingungkan, serta pembuatan statistik realtime pada dashboard admin.

---

## ⚡ Perubahan & Perbaikan Utama

### 1. Database Connection & Dynamic Log Aktivitas Permanen (`lpm_audit_logs`)
- **Helper Central Log (`lib/audit.ts`)**: Membuat fungsi `recordAuditLog()` untuk menyisipkan setiap aktivitas admin secara permanen ke tabel `lpm_audit_logs` di PostgreSQL.
- **Pencatatan Otomatis Setiap Aksi Admin**:
  - **Login (`lib/auth.ts`)**: Mencatat log saat admin berhasil login via NextAuth Credentials.
  - **Kelola Feed (`/api/feeds`, `/api/feeds/[id]`)**: Mencatat aksi `CREATE`, `UPDATE`, `PATCH` (draft/publish), dan `DELETE` artikel feed.
  - **Kelola Dokumen (`/api/dokumen`)**: Mencatat aksi `CREATE` dan `DELETE` dokumen mutu/regulasi/monev.
  - **Kelola SPMI (`/api/spmi`)**: Mencatat aksi `CREATE` dan `DELETE` dokumen SPMI.
  - **Kelola Akreditasi (`/api/akreditasi`)**: Mencatat aksi `CREATE` / `UPDATE` dan `DELETE` data akreditasi prodi.
  - **Kelola Admin (`/api/admin/users`)**: Mencatat aksi `CREATE` dan `DELETE` akun pengelola.
- **Dynamic API Audit Log (`GET /api/audit-logs`)**: Melakukan `LEFT JOIN` dari tabel `lpm_audit_logs` ke `lpm_admins` untuk menampilkan nama admin yang melakukan aksi, aksi, tabel target, rincian aktivitas, IP address, dan timestamp ISO.
- **Visualisasi Log Real-Time (`components/admin/AuditLog.tsx`)**:
  - Menghapus array data sampel statis ("1 jam yang lalu", "10 menit yang lalu").
  - Menampilkan 5 log terbaru dari database dengan kalkulasi relative time dinamis ("Baru saja", "X detik lalu", "X menit lalu", "X jam lalu").

### 2. Pengosongan Data Sample Fallback Statis (True Database Single Source of Truth)
- **Problem**: Pada CMS Feed, Dokumen Mutu, SPMI, dan Data Akreditasi, ketika menambahkan item baru, data bawaan/sampel hilang lalu muncul kembali saat refresh karena adanya array fallback statis in-memory.
- **Solusi**: Menghapus seluruh array sampel statis (`fallbackFeeds`, `sampleDocuments`, `sampleSpmiDocs`, `sampleAccreditations`, `sampleAdmins`).
- Tabel di halaman admin maupun portal publik sekarang **100% membaca data riil dari database PostgreSQL**. Jika tabel di DB kosong, UI menampilkan empty state yang bersih tanpa data hantu yang muncul-tenggelam.

### 3. Dynamic Views Count & Overview Dashboard Stats (`/api/admin/stats`)
- **Peningkatan Counter Views**: Setiap kali halaman detail publik `/feeds/[id]` dibuka, endpoint `POST /api/feeds/[id]/view` menambahkan +1 `view_count` di database secara persisten.
- **Overview Dashboard Real-Time (`/api/admin/stats`)**:
  - **Total Konten Feed**: Dihitung dari total baris di tabel `lpm_feeds`.
  - **Total Pembaca Artikel**: Dihitung dari akumulasi `SUM(view_count)` seluruh feed di database.
  - **Dokumen Registrasi**: Dihitung dari gabungan jumlah dokumen di `lpm_documents` dan `lpm_spmi_docs`.
  - **Prodi Akreditasi Unggul**: Dihitung secara persentase dinamis dari data prodi berpredikat *Unggul* / *Internasional* / *A* pada `lpm_accreditation`.

---

## 🧪 Hasil Pengujian & Validasi

| Pengujian | Status | Catatan |
|---|---|---|
| `tsc --noEmit` | ✅ Pass | 0 TypeScript Errors |
| Dynamic Audit Logging | ✅ Pass | Setiap aksi CRUD & Login tersimpan ke `lpm_audit_logs` |
| Hapus Mock Array Fallback | ✅ Pass | Tidak ada data bawaan hantu pada Feed/Dokumen/SPMI/Akreditasi |
| Real-time Overview Stats | ✅ Pass | Feed count, total views, dokumen, dan persentase akreditasi dibaca dari DB |

---

## 📌 Kesimpulan
Seluruh fitur audit log, views, dan manajemen data kini beroperasi secara dinamis berbasis database PostgreSQL tanpa ketergantungan pada mock data statis. Log aktivitas tercatat secara permanen untuk audit trail keamanan lembaga.
