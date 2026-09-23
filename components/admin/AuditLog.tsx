"use client";

import React, { useEffect, useState } from "react";
import { Activity, ShieldCheck, UserCheck, Clock } from "lucide-react";

interface AuditItem {
  id: number;
  adminName: string;
  action: string;
  targetTable: string;
  details: unknown;
  createdAt: string;
  ipAddress: string;
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

function formatRelativeTime(isoString: string): string {
  if (!isoString) return "Baru saja";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;

  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSec < 10) return "Baru saja";
  if (diffSec < 60) return `${diffSec} detik lalu`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours} jam lalu`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} hari lalu`;

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AuditLog() {
  const [logs, setLogs] = useState<AuditItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/audit-logs")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setLogs(data.data.slice(0, 5)); // Take top 5 for dashboard overview
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-emerald-900" />
          <h2 className="text-sm font-bold text-slate-900">
            Log Aktivitas & Audit Keamanan Real-Time (PostgreSQL)
          </h2>
        </div>
        <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-mono">
          Strict Security Active
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
              <th className="py-2.5 px-3">Pengelola</th>
              <th className="py-2.5 px-3">Aksi</th>
              <th className="py-2.5 px-3">Modul / Tabel</th>
              <th className="py-2.5 px-3">Keterangan Aktivitas</th>
              <th className="py-2.5 px-3">Waktu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  Memuat log aktivitas dari database...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  Belum ada log aktivitas tercatat di database.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-medium text-slate-900 flex items-center space-x-2">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-900 shrink-0" />
                    <span className="truncate">{log.adminName}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.action === "LOGIN"
                          ? "bg-blue-100 text-blue-800"
                          : log.action === "CREATE"
                          ? "bg-emerald-100 text-emerald-800"
                          : log.action === "DELETE"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                    {log.targetTable}
                  </td>
                  <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
                    {stringifyDetails(log.details)}
                  </td>
                  <td className="py-3 px-3 text-slate-400 whitespace-nowrap flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatRelativeTime(log.createdAt)}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center space-x-1">
          <ShieldCheck className="w-4 h-4 text-emerald-900" />
          <span>Audit Trail Otomatis Disimpan Ke Database PostgreSQL</span>
        </div>
        <span className="text-[11px] text-slate-400">
          Total {logs.length} Log Tercatat
        </span>
      </div>
    </div>
  );
}

