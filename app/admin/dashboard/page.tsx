import React from "react";
import Link from "next/link";
import {
  Newspaper,
  Eye,
  FolderKanban,
  Award,
  PlusCircle,
  Upload,
  Edit,
  TrendingUp,
} from "lucide-react";
import AuditLog from "@/components/admin/AuditLog";

export default function AdminDashboardOverview() {
  const stats = [
    {
      title: "Total Konten Feed",
      value: "24",
      subtext: "Berita, Pengumuman, Event",
      icon: Newspaper,
      color: "bg-emerald-900 text-white",
    },
    {
      title: "Total Pembaca Artikel",
      value: "14,820",
      subtext: "Akumulasi view count",
      icon: Eye,
      color: "bg-slate-900 text-amber-400",
    },
    {
      title: "Dokumen Registrasi",
      value: "86",
      subtext: "Regulasi, Monev & SPMI",
      icon: FolderKanban,
      color: "bg-emerald-900 text-white",
    },
    {
      title: "Prodi Akreditasi Unggul",
      value: "78%",
      subtext: "Target 2026 Terlampaui",
      icon: Award,
      color: "bg-amber-500 text-slate-900",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-emerald-900 text-white border border-emerald-950 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-amber-400 block mb-1">
            LPM UIN Sunan Gunung Djati Bandung
          </span>
          <h1 className="text-xl font-bold tracking-tight">
            Selamat Datang di Workspace Pengelola Mutu
          </h1>
          <p className="text-xs text-emerald-100 mt-1 max-w-2xl">
            Pusat kendali Sistem Penjaminan Mutu Internal (SPMI), Akreditasi Real-Time, dan Pengelolaan Media Informasi Lembaga.
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-emerald-950/60 px-3 py-2 rounded-lg border border-emerald-800 text-xs text-emerald-200">
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <span>Status Server: <strong>Optimal & Connected</strong></span>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                  {stat.value}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {stat.subtext}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color} shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions Shortcuts */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
          Aksi Cepat Pengelolaan Data
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/dashboard/cms"
            className="flex items-center space-x-3 p-4 bg-slate-50 border border-slate-200 rounded-lg hover:border-emerald-900 hover:bg-emerald-50/50 transition-colors group"
          >
            <div className="p-2 bg-emerald-900 text-white rounded-md group-hover:scale-105 transition-transform">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="font-semibold text-xs text-slate-900 block">
                Tambah Konten CMS
              </span>
              <span className="text-[11px] text-slate-500">
                Buat Berita atau Pengumuman
              </span>
            </div>
          </Link>

          <Link
            href="/admin/dashboard/dokumen"
            className="flex items-center space-x-3 p-4 bg-slate-50 border border-slate-200 rounded-lg hover:border-emerald-900 hover:bg-emerald-50/50 transition-colors group"
          >
            <div className="p-2 bg-slate-900 text-amber-400 rounded-md group-hover:scale-105 transition-transform">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <span className="font-semibold text-xs text-slate-900 block">
                Upload Dokumen Mutu
              </span>
              <span className="text-[11px] text-slate-500">
                Regulasi, Monev & SPMI
              </span>
            </div>
          </Link>

          <Link
            href="/admin/dashboard/akreditasi"
            className="flex items-center space-x-3 p-4 bg-slate-50 border border-slate-200 rounded-lg hover:border-emerald-900 hover:bg-emerald-50/50 transition-colors group"
          >
            <div className="p-2 bg-amber-500 text-slate-900 rounded-md group-hover:scale-105 transition-transform">
              <Edit className="w-5 h-5" />
            </div>
            <div>
              <span className="font-semibold text-xs text-slate-900 block">
                Update Data Akreditasi
              </span>
              <span className="text-[11px] text-slate-500">
                Grid Tabel Editor Realtime
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Audit Log Stream Component */}
      <AuditLog />
    </div>
  );
}
