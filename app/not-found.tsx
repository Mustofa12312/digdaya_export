import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Halaman Tidak Ditemukan — DIGDAYA Export Advisor",
};

export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", textAlign: "center", padding: "24px",
      background: "linear-gradient(160deg, #0D2137, #1A3A5C)",
    }} className="pattern-batik-dark">
      <div style={{ fontSize: 80, marginBottom: 20 }}>🧭</div>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 96, color: "#D4A017", lineHeight: 1, marginBottom: 16 }}>404</div>
      <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 28, color: "#F5F0E8", marginBottom: 12 }}>
        Halaman Tidak Ditemukan
      </h1>
      <p style={{ fontSize: 16, color: "rgba(245,240,232,0.6)", maxWidth: 420, marginBottom: 40 }}>
        Sepertinya Anda tersesat di lautan ekspor. Tidak apa-apa — kami akan antarkan kembali ke jalur yang benar.
      </p>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/" style={{
          padding: "14px 32px", borderRadius: 12,
          background: "linear-gradient(135deg, #D4A017, #F0C040)", color: "#1A3A5C",
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, textDecoration: "none",
          boxShadow: "0 4px 20px rgba(212,160,23,0.4)",
        }}>🏠 Kembali ke Beranda</Link>
        <Link href="/assessment" style={{
          padding: "14px 32px", borderRadius: 12,
          background: "rgba(255,255,255,0.1)", color: "#F5F0E8",
          fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 16, textDecoration: "none",
          border: "1px solid rgba(255,255,255,0.15)",
        }}>🚀 Mulai Validasi</Link>
      </div>
    </div>
  );
}
