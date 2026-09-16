import React from "react";
import { Activity, ShieldCheck, UserCheck, Clock } from "lucide-react";

interface AuditItem {
  id: number;
  adminName: string;
  action: string;
  targetTable: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

const sampleAuditLogs: AuditItem[] = [
  {
    id: 1,
    adminName: "Super Admin LPM",
    action: "LOGIN",
    targetTable: "lpm_admins",
    details: "Berhasil login dari sesi terenkripsi JWT",
    timestamp: "Baru saja",
    ipAddress: "127.0.0.1",
  },
  {
    id: 2,
    adminName: "Super Admin LPM",
    action: "UPDATE",
    targetTable: "lpm_accreditation",
    details: "Mengubah data akreditasi Teknik Informatika menjadi Unggul",
    timestamp: "10 menit lalu",
    ipAddress: "127.0.0.1",
  },
  {
    id: 3,
    adminName: "Super Admin LPM",
    action: "CREATE",
    targetTable: "lpm_feeds",
    details: "Mempublikasikan Berita AMI Semester Genap 2025/2026",
    timestamp: "1 jam lalu",
    ipAddress: "127.0.0.1",
  },
];

export default function AuditLog() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-emerald-900" />
          <h2 className="text-sm font-bold text-slate-900">
            Log Aktivitas & Audit Keamanan Real-Time
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
            {sampleAuditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-3 font-medium text-slate-900 flex items-center space-x-2">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-900" />
                  <span>{log.adminName}</span>
                </td>
                <td className="py-3 px-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.action === "LOGIN"
                        ? "bg-blue-100 text-blue-800"
                        : log.action === "CREATE"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {log.action}
                  </span>
                </td>
                <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                  {log.targetTable}
                </td>
                <td className="py-3 px-3 text-slate-600">{log.details}</td>
                <td className="py-3 px-3 text-slate-400 whitespace-nowrap flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{log.timestamp}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center space-x-1">
          <ShieldCheck className="w-4 h-4 text-emerald-900" />
          <span>Audit Trail Otomatis Disimpan Ke Database PostgreSQL</span>
        </div>
        <span className="text-[11px] text-slate-400">Total 3 Log Tercatat</span>
      </div>
    </div>
  );
}
