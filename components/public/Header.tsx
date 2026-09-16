import React from "react";
import Link from "next/link";
import { Award, ShieldCheck } from "lucide-react";

export default function Header() {
  return (
    <div className="bg-white border-b border-slate-200 py-3.5 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Kiri Atas: Logo gabungan UIN SGD + BLU + Akreditasi Unggul */}
        <Link href="/" className="flex items-center space-x-4 group max-w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/logo-uin-blu-akre.webp"
            alt="Logo UIN Sunan Gunung Djati, BLU, dan Akreditasi Unggul"
            className="h-14 md:h-20 w-auto max-w-[55%] md:max-w-none object-contain transition-transform group-hover:scale-[1.02] drop-shadow-sm"
          />
          <div className="border-l border-slate-300 pl-4 shrink-0">
            <span className="text-[11px] uppercase font-extrabold tracking-widest text-emerald-900 block">
              Lembaga Penjaminan Mutu
            </span>
            <h1 className="text-sm md:text-lg font-black text-slate-900 tracking-tight leading-none mt-0.5">
              UIN SUNAN GUNUNG DJATI BANDUNG
            </h1>
            <p className="text-[10px] md:text-[11px] text-slate-500 font-medium mt-0.5">
              Pusat Penjaminan Mutu Internal &amp; Akreditasi Perguruan Tinggi
            </p>
          </div>
        </Link>

        {/* Accreditation & Quality Badges */}
        <div className="hidden lg:flex items-center space-x-3 text-xs shrink-0">
          <div className="flex items-center space-x-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg text-amber-900">
            <Award className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <span className="font-extrabold block text-[11px] uppercase leading-tight">
                Akreditasi Unggul
              </span>
              <span className="text-[10px] text-amber-800">
                BAN-PT No. 123/SK/BAN-PT
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-lg">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold block text-[11px] text-white leading-tight">
                Sertifikasi ISO 9001:2015
              </span>
              <span className="text-[10px] text-slate-400">
                Sistem Manajemen Mutu
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
