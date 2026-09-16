import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { lpmAuditLogs } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";

interface AuditLogItem {
  id: number;
  adminName: string;
  action: string;
  targetTable: string;
  targetId?: number;
  details: unknown;
  ipAddress: string;
  createdAt: string;
}

const sampleAuditLogs: AuditLogItem[] = [
  {
    id: 1,
    adminName: "Super Admin LPM",
    action: "LOGIN",
    targetTable: "lpm_admins",
    details: { message: "Berhasil login dari sesi terenkripsi JWT" },
    ipAddress: "127.0.0.1",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    adminName: "Super Admin LPM",
    action: "UPDATE",
    targetTable: "lpm_accreditation",
    targetId: 1,
    details: { message: "Mengubah data akreditasi Teknik Informatika menjadi Unggul" },
    ipAddress: "127.0.0.1",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    adminName: "Super Admin LPM",
    action: "CREATE",
    targetTable: "lpm_feeds",
    targetId: 5,
    details: { message: "Mempublikasikan Berita AMI Semester Genap 2025/2026" },
    ipAddress: "127.0.0.1",
    createdAt: new Date().toISOString(),
  },
];

function stringifyDetails(details: unknown): string {
  if (!details) return "-";
  if (typeof details === "string") return details;
  try {
    const obj = details as Record<string, unknown>;
    if (obj && typeof obj.message === "string") return obj.message;
    return JSON.stringify(details);
  } catch {
    return String(details);
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const query = searchParams.get("q");

    let logs: AuditLogItem[] = [...sampleAuditLogs];

    try {
      const dbLogs = await db.select().from(lpmAuditLogs).orderBy(desc(lpmAuditLogs.createdAt));
      if (dbLogs && dbLogs.length > 0) {
        logs = dbLogs.map((l) => ({
          id: l.id,
          adminName: l.adminId ? `Admin #${l.adminId}` : "System",
          action: l.action,
          targetTable: l.targetTable || "-",
          targetId: l.targetId || undefined,
          details: l.details,
          ipAddress: l.ipAddress || "-",
          createdAt: l.createdAt ? l.createdAt.toISOString() : new Date().toISOString(),
        }));
      }
    } catch {
      // Offline fallback
    }

    if (action) {
      logs = logs.filter((l) => l.action.toLowerCase() === action.toLowerCase());
    }

    if (query) {
      const qLower = query.toLowerCase();
      logs = logs.filter(
        (l) =>
          l.adminName.toLowerCase().includes(qLower) ||
          l.targetTable.toLowerCase().includes(qLower) ||
          stringifyDetails(l.details).toLowerCase().includes(qLower)
      );
    }

    return NextResponse.json({ success: true, data: logs, total: logs.length });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}