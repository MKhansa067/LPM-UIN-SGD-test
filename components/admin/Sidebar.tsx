"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Newspaper,
  FolderKanban,
  ShieldCheck,
  Award,
  Settings,
  LogOut,
  X,
  ExternalLink,
  Activity,
  UserCircle2,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { name: "Overview Analytics", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Kelola CMS Feed", href: "/admin/dashboard/cms", icon: Newspaper },
  { name: "Kelola Dokumen Mutu", href: "/admin/dashboard/dokumen", icon: FolderKanban },
  { name: "Kelola SPMI", href: "/admin/dashboard/spmi", icon: ShieldCheck },
  { name: "Data Akreditasi", href: "/admin/dashboard/akreditasi", icon: Award },
  { name: "Kelola Admin", href: "/admin/dashboard/users", icon: UserCircle2 },
  { name: "Log Aktivitas", href: "/admin/dashboard/audit-log", icon: Activity },
  { name: "Pengaturan Admin", href: "/admin/dashboard/pengaturan", icon: Settings },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <>
      {/* Backdrop Mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header Branding */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center space-x-3">
            <Image
              src="/assets/logo-lpm.webp"
              alt="Logo LPM"
              width={36}
              height={36}
              className="h-9 w-auto"
            />
            <div>
              <span className="font-bold text-white text-sm block leading-tight">
                LPM UIN SGD
              </span>
              <span className="text-[10px] text-amber-400 font-medium">
                Workspace Admin
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="md:hidden text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Link to Public Portal */}
        <div className="px-4 py-3 border-b border-slate-800">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between text-xs bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-colors"
          >
            <span>Lihat Website Publik</span>
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin/dashboard"
                ? pathname === "/admin/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-900 text-white font-semibold shadow-xs"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Admin Profile & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-emerald-900 text-amber-400 flex items-center justify-center font-bold text-xs">
              {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">
                {session?.user?.name || "Administrator"}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {session?.user?.email || "admin@lpm.uinsgd.ac.id"}
              </p>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="w-full flex items-center justify-center space-x-2 text-xs bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-red-100 py-2 rounded-lg border border-red-900/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Sistem</span>
          </button>
        </div>
      </aside>
    </>
  );
}
