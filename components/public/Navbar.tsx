"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ExternalLink, Menu, X } from "lucide-react";
import MegaMenu from "./MegaMenu";

export default function Navbar() {
  const pathname = usePathname();
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tautanDropdown, setTautanDropdown] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-700 hover:text-slate-900 rounded hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="font-bold text-xs text-slate-900 ml-2">Navigasi LPM</span>
          </div>

          <div className="hidden md:flex items-center space-x-1 text-xs font-semibold text-slate-700 w-full justify-between">
            <div className="flex items-center space-x-1">
              <Link
                href="/"
                className={`px-3 py-1.5 rounded transition-colors ${
                  pathname === "/" ? "bg-emerald-900 text-white font-bold" : "hover:bg-slate-100 hover:text-emerald-900"
                }`}
              >
                Beranda
              </Link>

              <Link href="/profil" className="px-3 py-1.5 rounded hover:bg-slate-100 hover:text-emerald-900">
                Profil
              </Link>

              <div className="relative" onMouseEnter={() => setMegaMenuOpen(true)}>
                <button className="flex items-center space-x-1 px-3 py-1.5 rounded hover:bg-slate-100 hover:text-emerald-900">
                  <span>Dokumen Mutu</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>

              <Link href="/spmi" className="px-3 py-1.5 rounded hover:bg-slate-100 hover:text-emerald-900">
                SPMI
              </Link>

              <Link
                href="/akreditasi"
                className="flex items-center space-x-1 px-3 py-1.5 rounded hover:bg-slate-100 hover:text-emerald-900 font-bold"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                <span>Akreditasi</span>
              </Link>

              <Link href="/feeds?category=Event" className="px-3 py-1.5 rounded hover:bg-slate-100">
                Event
              </Link>
              <Link href="/tentang-kami" className="px-3 py-1.5 rounded hover:bg-slate-100">
                Tentang
              </Link>
            </div>

            <div
              className="relative"
              onMouseEnter={() => setTautanDropdown(true)}
              onMouseLeave={() => setTautanDropdown(false)}
            >
              <button className="flex items-center space-x-1 px-3 py-1 bg-slate-100 hover:bg-emerald-900 hover:text-white rounded">
                <span>Tautan</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {tautanDropdown && (
                <div className="absolute top-full right-0 w-48 bg-white border border-slate-200 rounded shadow-md py-1 z-50">
                  <Link
                    href="/tautan"
                    onClick={() => setTautanDropdown(false)}
                    className="flex items-center justify-between px-3 py-1.5 hover:bg-emerald-50 text-slate-700"
                  >
                    <span className="font-bold text-emerald-900">Semua Tautan Resmi</span>
                    <ExternalLink className="w-3 h-3 text-amber-500" />
                  </Link>
                  <div className="border-t border-slate-100 my-1"></div>
                  <a href="https://siakad.uinsgd.ac.id" target="_blank" rel="noreferrer" className="flex items-center justify-between px-3 py-1.5 hover:bg-emerald-50 text-slate-700">
                    <span>SIAKAD UIN</span>
                    <ExternalLink className="w-3 h-3 text-amber-500" />
                  </a>
                  <a href="https://banpt.or.id" target="_blank" rel="noreferrer" className="flex items-center justify-between px-3 py-1.5 hover:bg-emerald-50 text-slate-700">
                    <span>BAN-PT</span>
                    <ExternalLink className="w-3 h-3 text-amber-500" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {megaMenuOpen && <MegaMenu onClose={() => setMegaMenuOpen(false)} />}

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-1 text-xs font-semibold text-slate-800">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-emerald-900 font-bold">
            Beranda
          </Link>
          <Link href="/profil" onClick={() => setMobileMenuOpen(false)} className="block py-1.5">
            Profil LPM
          </Link>
          <Link href="/tentang-kami" onClick={() => setMobileMenuOpen(false)} className="block py-1.5">
            Tentang Kami
          </Link>
          <Link href="/dokumen" onClick={() => setMobileMenuOpen(false)} className="block py-1.5">
            Dokumen Mutu & Monev
          </Link>
          <Link href="/spmi" onClick={() => setMobileMenuOpen(false)} className="block py-1.5">
            SPMI
          </Link>
          <Link href="/akreditasi" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-emerald-900 font-bold">
            Data Akreditasi
          </Link>
          <div className="border-t border-slate-100 pt-2 mt-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Informasi</span>
          </div>
          <Link href="/feeds" onClick={() => setMobileMenuOpen(false)} className="block py-1.5">
            Berita & Pengumuman
          </Link>
          <Link href="/feeds?category=Event" onClick={() => setMobileMenuOpen(false)} className="block py-1.5">
            Event
          </Link>
          <div className="border-t border-slate-100 pt-2 mt-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Lainnya</span>
          </div>
          <Link href="/tautan" onClick={() => setMobileMenuOpen(false)} className="block py-1.5">
            Tautan
          </Link>
        </div>
      )}
    </nav>
  );
}
