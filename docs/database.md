# 🗄️ Dokumentasi Database — LPM UIN SGD

Database menggunakan PostgreSQL yang diakses via Drizzle ORM.

---

## 📋 Tabel Database

### 1. `lpm_admins`
Penyimpanan akun admin pengelola portal.
- `id` (PK, Serial)
- `name` (Varchar 100)
- `username` (Varchar 50, Unique)
- `email` (Varchar 150, Unique)
- `password_hash` (Text, bcrypt cost 12)
- `role` (Varchar 20, default 'admin')
- `is_active` (Boolean, default true)
- `created_at`, `last_login`

### 2. `lpm_feeds`
Penyimpanan artikel Berita, Pengumuman, dan Event.
- `id` (PK, Serial)
- `title` (Varchar 255)
- `slug` (Varchar 300, Unique)
- `category` ('Berita' | 'Pengumuman' | 'Event')
- `published_date` (Date)
- `content` (Text)
- `image_url` (Text)
- `pdf_attachment_url` (Text, default '-')
- `view_count` (Int, default 0)
- `sections` (JSONB)
- `is_published` (Boolean, default true)
- `created_by` (FK -> lpm_admins.id)

### 3. `lpm_documents`
Dokumen Regulasi Mutu & Monitoring Evaluasi.
- `id` (PK, Serial)
- `title` (Varchar 255)
- `main_category` ('Dokumen Regulasi' | 'Monitoring & Evaluasi')
- `sub_category` ('AMI', 'AME', 'Pedoman Akademik', 'Renstra & RIP', 'HAKi', 'Sertifikasi', 'Laporan Monev', 'Uji Validitas', 'Laporan Survei')
- `year` (Int)
- `target_unit` (Varchar 100)
- `download_url` (Text)
- `file_size` (Varchar 20)

### 4. `lpm_spmi_docs`
Dokumen SPMI Khusus.
- `id` (PK, Serial)
- `title`, `category` ('Kebijakan SPMI' | 'PPEPP' | 'Standar Mutu' | 'Kebijakan Mutu'), `file_url`, `year`, `description`

### 5. `lpm_accreditation`
Data Akreditasi Institusi & Program Studi Real-Time.
- `id` (PK, Serial)
- `program_name`, `degree_level` ('S1'|'S2'|'S3'|'Profesi'), `faculty`, `rating` ('Unggul'|'A'|'Baik Sekali'|'B'|'Baik'|'Internasional'), `expiration_date`, `quarter_period` ('Q1-2026', dst), `semester_period` ('Ganjil 2025/2026', dst), `sk_url`

### 6. `lpm_audit_logs`
Log aktivitas admin.
- `id` (PK, Serial), `admin_id`, `action`, `target_table`, `target_id`, `details` (JSONB), `ip_address`, `created_at`
