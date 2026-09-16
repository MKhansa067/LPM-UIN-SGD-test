import React from "react";
import { Award, CheckCircle2, TrendingUp, Users, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function BentoStats() {
  return (
    <section className="py-10 px-4 md:px-8 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto space-y-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-500 block">
              Ringkasan Real-Time SPMI
            </span>
            <h2 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
              Dashboard Capaian Mutu & Evaluasi
            </h2>
          </div>
          <Link
            href="/akreditasi"
            className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-900 hover:text-emerald-700"
          >
            <span>Buka Dashboard Analitik</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3-Card Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 uppercase">Status Akreditasi</span>
              <div className="p-1.5 bg-emerald-100 text-emerald-900 rounded">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="my-3 flex items-center space-x-3">
              <div className="w-14 h-14 shrink-0 flex items-center justify-center bg-emerald-900 rounded-full text-amber-400 font-extrabold text-sm border-2 border-amber-400">
                78.4%
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Target Unggul Terlampaui</h3>
                <p className="text-[11px] text-slate-500">54 dari 69 Prodi Meraih Peringkat Unggul / A.</p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between">
              <span>BAN-PT Q1 2026</span>
              <span className="font-bold text-emerald-900">+12% vs 2025</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 uppercase">Siklus AMI Aktif</span>
              <div className="p-1.5 bg-slate-900 text-amber-400 rounded">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="my-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-800 font-semibold">1. Desk Evaluation</span>
                <span className="text-emerald-700 font-bold">Selesai</span>
              </div>
              <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                <div className="bg-emerald-900 h-full w-full"></div>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-emerald-950 font-bold">2. Visitasi Assessor</span>
                <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded text-[9px] font-bold">Aktif</span>
              </div>
              <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-2/3"></div>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between">
              <span>Genap 2025/2026</span>
              <span className="font-bold text-slate-800">42 Assessor</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 uppercase">Indeks Kepuasan</span>
              <div className="p-1.5 bg-amber-500 text-slate-900 rounded">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="my-3">
              <div className="flex items-baseline space-x-1.5">
                <span className="text-2xl font-black text-slate-900">94.2</span>
                <span className="text-[11px] font-bold text-emerald-700">/ 100 Sangat Puas</span>
              </div>
              <div className="mt-2 flex items-center space-x-1 text-[11px] text-emerald-900 bg-emerald-50 p-1.5 rounded border border-emerald-200">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>+3.4 Poin dibanding TA 2024/2025</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between">
              <span>12.450 Responden</span>
              <Link href="/dokumen?sub=Survei" className="font-bold text-emerald-900 hover:underline">
                Unduh PDF
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
