-- ============================================================
-- SETUP LENGKAP: LPM UIN SGD DATABASE
-- Gunakan di pgAdmin4 Query Tool
-- ============================================================
--
-- INSTRUKSI:
-- 1. Buka pgAdmin4 → connect ke PostgreSQL server
-- 2. Buka Query Tool pada database "postgres"
-- 3. Jalankan BAGIAN 1 (create role + database)
-- 4. Tutup Query Tool, buka Query Tool baru
-- 5. Ubah database ke "lpm_db" di connection dropdown
-- 6. Jalankan BAGIAN 2 (create tables + seed data)
--
-- Atau gunakan psql:
--   psql -U postgres -f docs/setup-db.sql
--   (perlu password superuser postgres)
-- ============================================================


-- ============================================================
-- BAGIAN 1: Jalankan di database "postgres" (sebagai superuser)
-- ============================================================

-- Buat role lpm_user (jika belum ada)
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'lpm_user') THEN
    CREATE ROLE lpm_user WITH LOGIN PASSWORD 'lpm_password';
    RAISE NOTICE 'Role lpm_user berhasil dibuat.';
  ELSE
    RAISE NOTICE 'Role lpm_user sudah ada, skip.';
  END IF;
END
$$;


-- ============================================================
-- BAGIAN 2: Jalankan di database "lpm_db"
-- Pertama buat database-nya dulu:
--   - Klik kanan "Databases" → Create → Database
--   - Nama: lpm_db, Owner: lpm_user
--   - Atau jalankan perintah SQL berikut di Query Tool postgres:
--     CREATE DATABASE lpm_db OWNER lpm_user;
-- ============================================================

-- Berikan hak akses ke lpm_user
-- (Jalankan ini di database postgres sebelum pindah ke lpm_db)
-- GRANT ALL PRIVILEGES ON DATABASE lpm_db TO lpm_user;

-- === PINDAH KE DATABASE lpm_db, lalu jalankan sisa script ini ===

-- Table 1: Admins
CREATE TABLE IF NOT EXISTS lpm_admins (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'admin',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Table 2: Feeds
CREATE TABLE IF NOT EXISTS lpm_feeds (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(300) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    published_date DATE NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    pdf_attachment_url TEXT DEFAULT '-',
    view_count INT NOT NULL DEFAULT 0,
    sections JSONB NOT NULL DEFAULT '[]',
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_by INT REFERENCES lpm_admins(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table 3: Documents
CREATE TABLE IF NOT EXISTS lpm_documents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    main_category VARCHAR(100) NOT NULL,
    sub_category VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    target_unit VARCHAR(100) NOT NULL DEFAULT 'Universitas',
    download_url TEXT NOT NULL,
    file_size VARCHAR(20),
    file_type VARCHAR(10) DEFAULT 'PDF',
    created_by INT REFERENCES lpm_admins(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table 4: SPMI Docs
CREATE TABLE IF NOT EXISTS lpm_spmi_docs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    file_url TEXT NOT NULL,
    year INT NOT NULL,
    description TEXT,
    created_by INT REFERENCES lpm_admins(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table 5: Accreditation
CREATE TABLE IF NOT EXISTS lpm_accreditation (
    id SERIAL PRIMARY KEY,
    program_name VARCHAR(255) NOT NULL,
    degree_level VARCHAR(50) NOT NULL,
    faculty VARCHAR(255) NOT NULL,
    rating VARCHAR(100) NOT NULL,
    accreditor VARCHAR(50) NOT NULL DEFAULT 'BAN-PT',
    expiration_date DATE NOT NULL,
    quarter_period VARCHAR(20) NOT NULL,
    semester_period VARCHAR(50) NOT NULL,
    sk_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by INT REFERENCES lpm_admins(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table 6: Audit Logs
CREATE TABLE IF NOT EXISTS lpm_audit_logs (
    id SERIAL PRIMARY KEY,
    admin_id INT REFERENCES lpm_admins(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    target_table VARCHAR(100),
    target_id INT,
    details JSONB DEFAULT '{}',
    ip_address VARCHAR(45),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_feeds_category ON lpm_feeds(category);
CREATE INDEX IF NOT EXISTS idx_feeds_published_date ON lpm_feeds(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_docs_main_category ON lpm_documents(main_category);
CREATE INDEX IF NOT EXISTS idx_accr_quarter ON lpm_accreditation(quarter_period);

-- Superadmin Account (password: admin123)
-- bcrypt hash verified with bcryptjs library
INSERT INTO lpm_admins (name, username, email, password_hash, role)
VALUES ('Super Admin LPM', 'admin', 'admin@lpm.uinsgd.ac.id', '$2b$12$CJb3Hv5wWWqYW6ZhZkJTsumI2Noe.pgIUsGeuR4WKCRwuyzv/XQU.', 'superadmin')
ON CONFLICT (username) DO NOTHING;

-- Berikan hak akses pada schema public untuk lpm_user
GRANT ALL ON ALL TABLES IN SCHEMA public TO lpm_user;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO lpm_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO lpm_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO lpm_user;

-- Verifikasi
SELECT id, name, username, email, role, is_active FROM lpm_admins;

