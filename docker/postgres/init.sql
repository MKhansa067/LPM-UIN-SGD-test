-- ============================================================
-- INITIAL SQL DATABASE SETUP FOR LPM UIN SGD
-- ============================================================

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

-- Initial Superadmin Account (password: admin123)
-- bcrypt hash for 'admin123' (verified with bcryptjs): $2b$12$CJb3Hv5wWWqYW6ZhZkJTsumI2Noe.pgIUsGeuR4WKCRwuyzv/XQU.
INSERT INTO lpm_admins (name, username, email, password_hash, role)
VALUES ('Super Admin LPM', 'admin', 'admin@lpm.uinsgd.ac.id', '$2b$12$CJb3Hv5wWWqYW6ZhZkJTsumI2Noe.pgIUsGeuR4WKCRwuyzv/XQU.', 'superadmin')
ON CONFLICT (username) DO NOTHING;
