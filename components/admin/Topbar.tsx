"use client";

import React from "react";
import { Menu, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useSession } from "next-auth/react";

interface TopbarProps {
  onToggleSidebar: () => void;
}

export default function Topbar({ onToggleSidebar }: TopbarProps) {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 h-16 px-4 md:px-8 flex items-center justify-between shadow-xs">
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-sm font-bold text-slate-900">
            LPM UIN Sunan Gunung Djati Bandung
          </h1>
          <p className="text-[11px] text-slate-500 hidden sm:block">
            Sistem Penjaminan Mutu & Portal Akreditasi
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Status Indicator */}
        <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium rounded-full">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
          <span>Sistem Aktif & Terhubung</span>
        </div>

        {/* User Role Badge */}
        <div className="flex items-center space-x-2 text-xs border-l border-slate-200 pl-4">
          <div className="text-right hidden sm:block">
            <span className="font-semibold text-slate-800 block leading-tight">
              {session?.user?.name || "Admin LPM"}
            </span>
            <span className="text-[10px] text-emerald-900 uppercase font-bold tracking-wider">
              {(session?.user as { role?: string })?.role || "Superadmin"}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 font-bold flex items-center justify-center text-xs">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
        </div>
      </div>
    </header>
  );
}
