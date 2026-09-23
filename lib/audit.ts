import { db } from "@/lib/db";
import { lpmAuditLogs } from "@/lib/schema";

interface AuditLogParams {
  adminId?: number | null;
  action: "LOGIN" | "LOGOUT" | "CREATE" | "UPDATE" | "DELETE";
  targetTable: string;
  targetId?: number | null;
  details: Record<string, unknown> | string;
  ipAddress?: string;
}

export async function recordAuditLog(params: AuditLogParams) {
  try {
    const detailsObj =
      typeof params.details === "string"
        ? { message: params.details }
        : params.details;

    await db.insert(lpmAuditLogs).values({
      adminId: params.adminId ?? 1,
      action: params.action,
      targetTable: params.targetTable,
      targetId: params.targetId ?? null,
      details: detailsObj,
      ipAddress: params.ipAddress || "127.0.0.1",
    });
  } catch (err) {
    console.error("Failed to record audit log to database:", err);
  }
}
