import React from "react";
import { Phone, Mail, Globe, Search, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { SocialMediaLinks } from "./SocialIcons";

export default function TopHeader() {
  return (
    <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 md:px-8 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        {/* Contact Info */}
        <div className="flex items-center space-x-6 text-[11px]">
          <a
            href="tel:0227800525"
            className="flex items-center space-x-1.5 hover:text-amber-400 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span>(022) 7800525</span>
          </a>
          <a
            href="mailto:lpm@uinsgd.ac.id"
            className="flex items-center space-x-1.5 hover:text-amber-400 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-amber-400" />
            <span>lpm@uinsgd.ac.id</span>
          </a>
          <span className="hidden lg:inline text-slate-600">|</span>
          <span className="hidden lg:inline text-slate-400">
            Jl. A.H. Nasution No. 105, Cipadung, Bandung
          </span>
        </div>

        {/* Right Tools & Media */}
        <div className="flex items-center space-x-3 md:space-x-4 text-[11px]">
          {/* Pencarian Dokumen */}
          <form
            action="/dokumen"
            method="get"
            className="hidden sm:flex items-center bg-slate-800 border border-slate-700 rounded-full overflow-hidden focus-within:border-amber-400/60 transition-colors"
          >
            <input
              name="q"
              type="text"
              placeholder="Search dokumen..."
              className="bg-transparent text-slate-200 placeholder:text-slate-500 text-[11px] px-3 py-1 w-28 focus:outline-none focus:w-40 transition-all"
            />
            <button
              type="submit"
              title="Cari"
              className="px-2 py-1 text-slate-400 hover:text-amber-400 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Sosial Media (referensi: top bar FB, Twitter, IG, YT) */}
          <SocialMediaLinks size="sm" />

          <span className="text-slate-700">|</span>

          {/* Language Switch */}
          <div className="flex items-center space-x-1 font-semibold">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-amber-400">ID</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400 hover:text-white cursor-pointer">EN</span>
          </div>

          <span className="text-slate-700 hidden md:inline">|</span>

          {/* Quick Admin Access */}
          <Link
            href="/admin/login"
            className="hidden md:inline-flex items-center space-x-1 bg-emerald-900 hover:bg-emerald-800 text-amber-400 font-semibold px-2.5 py-1 rounded transition-colors"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Portal Admin</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

