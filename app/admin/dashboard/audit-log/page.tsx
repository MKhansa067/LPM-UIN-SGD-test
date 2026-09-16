"use client";

import React, { useEffect, useState } from "react";
import { Search, ShieldCheck, Clock, Activity, Filter } from "lucide-react";

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

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const actionColors: Record<string, string> = {
  LOGIN: "bg-blue-100 text-blue-800",
  LOGOUT: "bg-slate-100 text-slate-700",
  CREATE: "bg-emerald-100 text-emerald-800",
  UPDATE: "bg-amber-100 text-amber-800",
  DELETE: "bg-rose-100 text-rose-800",
};

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [actionFilter, setActionFilter] = useState("Semua");

  useEffect(() => {
    fetch("/api/audit-logs")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setLogs(data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = logs.filter((log) => {
    const matchAction = actionFilter === "Semua" || log.action === actionFilter;
    const matchQ =
      q.trim() === "" ||
      log.adminName.toLowerCase().includes(q.toLowerCase()) ||
      log.targetTable.toLowerCase().includes(q.toLowerCase()) ||
      stringifyDetails(log.details).toLowerCase().includes(q.toLowerCase());
    return matchAction && matchQ;
  });

  return (
    <div className="space-y-6">
      <div className="bg-emerald-900 text-white border border-emerald-950 rounded-xl p-5 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-950/50 rounded-lg border border-emerald-800">
            <Activity className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold">Log Aktivitas & Audit Keamanan</h1>
            <p className="text-[11px] text-emerald-200">
              Rincian tindakan administratif seluruh pengelola mutu
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex text-[11px] bg-emerald-950/60 text-emerald-200 px-2.5 py-1 rounded-full border border-emerald-800">
          Strict Security Active
        </span>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row gap-3 md:items-center justify-between">
        <div className="flex items-center space-x-1 text-xs text-slate-600 flex-wrap gap-y-1">
          <Filter className="w-4 h-4 text-emerald-800" />
          <span className="font-bold">Filter:</span>
          {["Semua", "LOGIN", "CREATE", "UPDATE", "DELETE"].map((a) => (
            <button
              key={a}
              onClick={() => setActionFilter(a)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                actionFilter === a
                  ? "bg-emerald-900 text-amber-400"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari log / admin / modul..."
            className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-900 focus:outline-none w-full md:w-64"
          />
        </div>
      </div>

<div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Pengelola</th>
                <th className="py-3 px-4">Aksi</th>
                <th className="py-3 px-4">Modul / Tabel</th>
                <th className="py-3 px-4">Keterangan</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    Memuat log aktivitas...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Tidak ada log yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                          {log.adminName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <span className="font-medium text-slate-900 block truncate">
                            {log.adminName}
                          </span>
                          <span className="text-[10px] text-slate-400">#{log.targetId ?? "-"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          actionColors[log.action] || "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600">{log.targetTable}</td>
                    <td className="py-3 px-4 text-slate-600">{stringifyDetails(log.details)}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{log.ipAddress}</td>
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(log.createdAt)}</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center space-x-1">
            <ShieldCheck className="w-4 h-4 text-emerald-900" />
            <span>Audit Trail Otomatis Disimpan Ke Database PostgreSQL</span>
          </div>
          <span>{filtered.length} Log Tercatat</span>
        </div>
      </div>
    </div>
  );
}