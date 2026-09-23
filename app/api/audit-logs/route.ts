import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { lpmAuditLogs, lpmAdmins } from "@/lib/schema";
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

    let logs: AuditLogItem[] = [];

    try {
      const dbLogs = await db
        .select({
          id: lpmAuditLogs.id,
          action: lpmAuditLogs.action,
          targetTable: lpmAuditLogs.targetTable,
          targetId: lpmAuditLogs.targetId,
          details: lpmAuditLogs.details,
          ipAddress: lpmAuditLogs.ipAddress,
          createdAt: lpmAuditLogs.createdAt,
          adminId: lpmAuditLogs.adminId,
          adminName: lpmAdmins.name,
          adminUsername: lpmAdmins.username,
        })
        .from(lpmAuditLogs)
        .leftJoin(lpmAdmins, eq(lpmAuditLogs.adminId, lpmAdmins.id))
        .orderBy(desc(lpmAuditLogs.createdAt));

      if (dbLogs && dbLogs.length > 0) {
        logs = dbLogs.map((l) => ({
          id: l.id,
          adminName: l.adminName || l.adminUsername || (l.adminId ? `Admin #${l.adminId}` : "System Superadmin"),
          action: l.action,
          targetTable: l.targetTable || "-",
          targetId: l.targetId || undefined,
          details: l.details,
          ipAddress: l.ipAddress || "127.0.0.1",
          createdAt: l.createdAt ? l.createdAt.toISOString() : new Date().toISOString(),
        }));
      }
    } catch (err) {
      console.error("Error fetching audit logs:", err);
    }

    if (action && action !== "Semua") {
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
