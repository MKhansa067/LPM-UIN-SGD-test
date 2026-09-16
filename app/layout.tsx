import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Lembaga Penjaminan Mutu | UIN Sunan Gunung Djati Bandung",
  description:
    "Portal Resmi & Sistem Penjaminan Mutu Internal (SPMI) UIN Sunan Gunung Djati Bandung. Informasi Akreditasi, Dokumen Mutu, Berita dan Pengumuman.",
  icons: {
    icon: "/assets/logo-lpm.webp",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full bg-slate-50 antialiased">
      <body className="min-h-full flex flex-col font-sans text-slate-900 bg-slate-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

