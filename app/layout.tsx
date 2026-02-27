import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "DIGDAYA Export Advisor — Validasi Kesiapan Ekspor UMKM Indonesia",
  description: "Platform AI terdepan untuk membantu UMKM Indonesia memvalidasi kesiapan ekspor ke pasar global. Dapatkan Export Readiness Score (ERS) dalam hitungan menit.",
  keywords: "UMKM, ekspor, validasi kesiapan ekspor, export readiness, Indonesia, AI advisor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <Navbar />
        <main>{children}</main>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1A3A5C",
              color: "#F5F0E8",
              fontFamily: "Inter, sans-serif",
              borderRadius: "12px",
              border: "1px solid rgba(212,160,23,0.3)",
            },
          }}
        />
      </body>
    </html>
  );
}
