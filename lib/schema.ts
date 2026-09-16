import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  date,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

// 1. Tabel Admins
export const lpmAdmins = pgTable("lpm_admins", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 150 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 20 }).notNull().default("admin"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastLogin: timestamp("last_login"),
});

// 2. Tabel Feeds (Berita, Pengumuman, Event)
export const lpmFeeds = pgTable("lpm_feeds", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 300 }).notNull().unique(),
  category: varchar("category", { length: 50 }).notNull(), // 'Berita' | 'Pengumuman' | 'Event'
  publishedDate: date("published_date").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  pdfAttachmentUrl: text("pdf_attachment_url").default("-"),
  viewCount: integer("view_count").notNull().default(0),
  sections: jsonb("sections").notNull().default([]),
  isPublished: boolean("is_published").notNull().default(true),
  createdBy: integer("created_by").references(() => lpmAdmins.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// 3. Tabel Documents (Regulasi & Monev)
export const lpmDocuments = pgTable("lpm_documents", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  mainCategory: varchar("main_category", { length: 100 }).notNull(), // 'Dokumen Regulasi' | 'Monitoring & Evaluasi'
  subCategory: varchar("sub_category", { length: 100 }).notNull(), // 'AMI', 'AME', 'Renstra & RIP', 'Kebijakan', 'PPEPP', 'Laporan Survei', dll
  year: integer("year").notNull(),
  targetUnit: varchar("target_unit", { length: 100 })
    .notNull()
    .default("Universitas"),
  downloadUrl: text("download_url").notNull(),
  fileSize: varchar("file_size", { length: 20 }),
  fileType: varchar("file_type", { length: 10 }).default("PDF"),
  createdBy: integer("created_by").references(() => lpmAdmins.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 4. Tabel SPMI Docs
export const lpmSpmiDocs = pgTable("lpm_spmi_docs", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(), // 'Kebijakan SPMI' | 'PPEPP' | 'Standar Mutu' | 'Kebijakan Mutu'
  fileUrl: text("file_url").notNull(),
  year: integer("year").notNull(),
  description: text("description"),
  createdBy: integer("created_by").references(() => lpmAdmins.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 5. Tabel Accreditation
export const lpmAccreditation = pgTable("lpm_accreditation", {
  id: serial("id").primaryKey(),
  programName: varchar("program_name", { length: 255 }).notNull(),
  degreeLevel: varchar("degree_level", { length: 50 }).notNull(), // 'S1' | 'S2' | 'S3' | 'Profesi'
  faculty: varchar("faculty", { length: 255 }).notNull(),
  rating: varchar("rating", { length: 100 }).notNull(), // 'Unggul' | 'A' | 'Baik Sekali' | 'B' | 'Baik' | 'Internasional'
  accreditor: varchar("accreditor", { length: 50 })
    .notNull()
    .default("BAN-PT"),
  expirationDate: date("expiration_date").notNull(),
  quarterPeriod: varchar("quarter_period", { length: 20 }).notNull(), // 'Q1-2026', 'Q2-2026', dll
  semesterPeriod: varchar("semester_period", { length: 50 }).notNull(), // 'Ganjil 2025/2026', 'Genap 2025/2026'
  skUrl: text("sk_url"),
  isActive: boolean("is_active").notNull().default(true),
  createdBy: integer("created_by").references(() => lpmAdmins.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// 6. Tabel Audit Logs
export const lpmAuditLogs = pgTable("lpm_audit_logs", {
  id: serial("id").primaryKey(),
  adminId: integer("admin_id").references(() => lpmAdmins.id, {
    onDelete: "set null",
  }),
  action: varchar("action", { length: 50 }).notNull(), // 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT'
  targetTable: varchar("target_table", { length: 100 }),
  targetId: integer("target_id"),
  details: jsonb("details").default({}),
  ipAddress: varchar("ip_address", { length: 45 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Types TypeScript Inferred
export type Admin = typeof lpmAdmins.$inferSelect;
export type NewAdmin = typeof lpmAdmins.$inferInsert;
export type Feed = typeof lpmFeeds.$inferSelect;
export type NewFeed = typeof lpmFeeds.$inferInsert;
export type Document = typeof lpmDocuments.$inferSelect;
export type NewDocument = typeof lpmDocuments.$inferInsert;
export type SpmiDoc = typeof lpmSpmiDocs.$inferSelect;
export type Accreditation = typeof lpmAccreditation.$inferSelect;
export type AuditLog = typeof lpmAuditLogs.$inferSelect;
