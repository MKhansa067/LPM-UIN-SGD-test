import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, ExternalLink, ShieldCheck } from "lucide-react";
import { SocialMediaLinks } from "./SocialIcons";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t-4 border-emerald-900 pt-10 pb-6 px-4 md:px-8 text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-slate-800">
        {/* Brand & Address Column */}
        <div className="md:col-span-5 space-y-3">
          <div className="flex items-center space-x-3 flex-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/logo-uin-blu-akre.webp"
              alt="Logo UIN SGD, BLU & Akreditasi Unggul"
              className="h-10 md:h-12 w-auto object-contain"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/logo-lpm.webp"
              alt="Logo LPM UIN SGD"
              className="h-10 md:h-12 w-auto object-contain rounded-md bg-white p-1"
            />
            <div>
              <span className="font-bold text-white text-xs block leading-tight">
                LPM UIN SUNAN GUNUNG DJATI
              </span>
              <span className="text-[10px] text-amber-400 font-medium">
                Bandung, Jawa Barat
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed max-w-sm">
            Lembaga Penjaminan Mutu (LPM) UIN Sunan Gunung Djati Bandung memelihara dan meningkatkan mutu pendidikan tinggi secara berkelanjutan melalui SPMI.
          </p>

          <div className="space-y-1.5 text-[11px] text-slate-400">
            <div className="flex items-start space-x-2">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>Gedung Rektorat Lt. 3, Jl. A.H. Nasution No. 105, Cipadung, Bandung</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>(022) 7800525</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>lpm@uinsgd.ac.id</span>
            </div>
          </div>

          {/* Sosial Media */}
          <SocialMediaLinks size="md" />
        </div>

        {/* Quick Links Nav 1 */}
        <div className="md:col-span-2 space-y-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider border-l-2 border-amber-400 pl-2">
            Dokumen Mutu
          </h3>
          <ul className="space-y-1 text-[11px] text-slate-400">
            <li><Link href="/dokumen?sub=AMI" className="hover:text-amber-400">Audit Mutu Internal</Link></li>
            <li><Link href="/dokumen?sub=AME" className="hover:text-amber-400">Audit Mutu Eksternal</Link></li>
            <li><Link href="/dokumen?sub=Renstra" className="hover:text-amber-400">Renstra LPM</Link></li>
            <li><Link href="/dokumen?sub=Kebijakan" className="hover:text-amber-400">Kebijakan SPMI</Link></li>
            <li><Link href="/dokumen?sub=Survei" className="hover:text-amber-400">Laporan Survei</Link></li>
          </ul>
        </div>

        {/* Quick Links Nav 2 */}
        <div className="md:col-span-2 space-y-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider border-l-2 border-amber-400 pl-2">
            Sistem SPMI
          </h3>
          <ul className="space-y-1 text-[11px] text-slate-400">
            <li><Link href="/spmi#ppepp" className="hover:text-amber-400">Siklus PPEPP</Link></li>
            <li><Link href="/spmi#standar" className="hover:text-amber-400">Standar Mutu</Link></li>
            <li><Link href="/spmi#manual" className="hover:text-amber-400">Manual Borang</Link></li>
            <li><Link href="/akreditasi" className="hover:text-amber-400">Data Akreditasi</Link></li>
            <li><Link href="/admin/login" className="hover:text-amber-400">Portal Admin</Link></li>
          </ul>
        </div>

        {/* External Links */}
        <div className="md:col-span-3 space-y-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider border-l-2 border-amber-400 pl-2">
            Tautan Resmi
          </h3>
          <ul className="space-y-1 text-[11px] text-slate-400">
            <li>
              <a href="https://uinsgd.ac.id" target="_blank" rel="noreferrer" className="flex items-center justify-between hover:text-amber-400">
                <span>Portal Resmi UIN SGD</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </li>
            <li>
              <a href="https://kemenag.go.id" target="_blank" rel="noreferrer" className="flex items-center justify-between hover:text-amber-400">
                <span>Kementerian Agama RI</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </li>
            <li>
              <a href="https://banpt.or.id" target="_blank" rel="noreferrer" className="flex items-center justify-between hover:text-amber-400">
                <span>BAN-PT Resmi</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-4 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-500 gap-2">
        <div className="flex items-center space-x-1">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>© {new Date().getFullYear()} LPM UIN Sunan Gunung Djati Bandung. All Rights Reserved.</span>
        </div>
        <span>Next.js &amp; PostgreSQL SPMI Portal</span>
      </div>
    </footer>
  );
}
