import React from "react";
import TopHeader from "@/components/public/TopHeader";
import Header from "@/components/public/Header";
import Navbar from "@/components/public/Navbar";
import Hero from "@/components/public/Hero";
import HomeFeeds from "@/components/public/HomeFeeds";
import BentoStats from "@/components/public/BentoStats";
import Footer from "@/components/public/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      {/* 1. Top Contact & Social Bar */}
      <TopHeader />

      {/* 2. Main Branding Header Bar (Logo UIN+BLU+Akreditasi di kiri atas) */}
      <Header />

      {/* 3. Sticky Navigation Bar */}
      <Navbar />

      {/* 4. Hero Banner Utama (logo-lpm.webp di tengah) */}
      <Hero />

      {/* 5. Berita (dengan foto dokumentasi) & Pengumuman */}
      <HomeFeeds />

      {/* 6. Dashboard Capaian Mutu & Evaluasi */}
      <BentoStats />

      {/* 7. Public Footer UIN SGD */}
      <Footer />
    </div>
  );
}

