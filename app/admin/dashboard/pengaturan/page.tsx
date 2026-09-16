"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { Settings, User, ShieldCheck, Database, Clock, Server } from "lucide-react";

export default function AdminPengaturanPage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs uppercase font-bold text-amber-500 tracking-wider block">System Settings</span>
        <h1 className="text-xl font-bold text-slate-900">Pengaturan Admin & Status Sistem</h1>
      </div>

      {/* Profile Info */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2 mb-4">
          <User className="w-4 h-4 text-emerald-900" />
          <h2 className="text-sm font-bold text-slate-900">Profil Admin Aktif</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <span className="text-slate-500 font-semibold block mb-1">Nama Lengkap</span>
            <span className="text-slate-900 font-bold">{session?.user?.name || "Administrator"}</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <span className="text-slate-500 font-semibold block mb-1">Email / Username</span>
            <span className="text-slate-900 font-bold">{session?.user?.email || "admin@lpm.uinsgd.ac.id"}</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <span className="text-slate-500 font-semibold block mb-1">Role</span>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded text-[11px] font-bold">{(session?.user as { role?: string })?.role || "Superadmin"}</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <span className="text-slate-500 font-semibold block mb-1">Status Sesi</span>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded text-[11px] font-bold flex items-center space-x-1 w-fit">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              <span>Sesi Aktif (8 Jam)</span>
            </span>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2 mb-4">
          <Server className="w-4 h-4 text-emerald-900" />
          <h2 className="text-sm font-bold text-slate-900">Status Sistem & Database</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
            <Database className="w-6 h-6 text-emerald-800 mx-auto mb-2" />
            <span className="text-emerald-900 font-bold block">PostgreSQL</span>
            <span className="text-emerald-700 text-[11px]">Connected</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
            <ShieldCheck className="w-6 h-6 text-emerald-800 mx-auto mb-2" />
            <span className="text-emerald-900 font-bold block">Auth System</span>
            <span className="text-emerald-700 text-[11px]">JWT Active</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
            <Clock className="w-6 h-6 text-slate-600 mx-auto mb-2" />
            <span className="text-slate-900 font-bold block">Server Time</span>
            <span className="text-slate-600 text-[11px]">{new Date().toLocaleString("id-ID")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}