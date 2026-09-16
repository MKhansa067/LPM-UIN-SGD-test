"use client";

import React from "react";

/**
 * Hero / Banner utama Beranda.
 * `public/assets/logo-lpm.webp` adalah gambar banner lengkap LPM
 * (logo kampus + Lembaga Penjaminan Mutu + gedung + logo akreditasi),
 * jadi ditampilkan sebagai banner utama yang lebar di tengah halaman.
 */
export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-white via-slate-50 to-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
        {/* Banner utama di tengah */}
        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-xl ring-1 ring-slate-200/70 bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/logo-lpm.webp"
            alt="Banner Lembaga Penjaminan Mutu UIN Sunan Gunung Djati Bandung"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
}
