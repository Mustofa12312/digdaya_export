import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tentang Kami — DIGDAYA Export Advisor",
  description: "Tim di balik DIGDAYA Export Advisor — platform AI kesiapan ekspor UMKM Indonesia untuk PIDI Hackathon 2026.",
};

const TEAM = [
  { nama: "Lead Product & AI", inisial: "D", warna: "#1A3A5C", deskripsi: "Merancang arsitektur DSS dan prompt engineering Gemini Vision untuk analisis kemasan" },
  { nama: "UX & Growth", inisial: "A", warna: "#D4A017", deskripsi: "Mendesain user journey zero-barrier untuk UMKM pelosok desa dengan cognitive load minimal" },
  { nama: "Backend & Data", inisial: "R", warna: "#2E7D52", deskripsi: "Membangun weighted scoring algorithm ERS dan integrasi API BPOM, DJKI, ITC Trade Map" },
  { nama: "Frontend & DevOps", inisial: "F", warna: "#E07B20", deskripsi: "Mengimplementasikan Next.js PWA offline-first dan pipeline CI/CD untuk demo hackathon" },
];

const TIMELINE = [
  { waktu: "Hari 1", aksi: "Riset masalah UMKM ekspor, wawancara 5 pelaku usaha lokal" },
  { waktu: "Hari 2", aksi: "Desain sistem DSS & weighted scoring, wireframing UI hyper-local" },
  { waktu: "Hari 3", aksi: "Implementasi AI Compliance Engine + Assessment Wizard" },
  { waktu: "Hari 4", aksi: "Integrasi ERS Dashboard, Market Explorer, Impact mapping" },
  { waktu: "Hari 5", aksi: "Polish UI, pengujian end-to-end, penyusunan presentasi" },
];

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--krem-linen)", paddingTop: 80 }} className="page-enter">
      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg, #0D2137, #1A3A5C)", padding: "60px 24px 80px", textAlign: "center" }} className="pattern-batik-dark">
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#D4A017", letterSpacing: "0.08em", marginBottom: 14 }}>TENTANG KAMI</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,44px)", color: "#F5F0E8", lineHeight: 1.2, marginBottom: 16 }}>
            Mengapa Kami Membangun<br />
            <span style={{ color: "#D4A017" }}>DIGDAYA Export Advisor</span>
          </h1>
          <p style={{ fontSize: 16, color: "rgba(245,240,232,0.72)", lineHeight: 1.8 }}>
            Sebanyak <strong style={{ color: "#D4A017" }}>64,2 juta UMKM</strong> beroperasi di Indonesia, namun kurang dari 4% yang berhasil mengekspor produknya. Hambatan terbesar bukan ketiadaan produk bagus — tapi ketidaktahuan soal <em>apa yang perlu dibenahi</em> sebelum ekspor. DIGDAYA hadir untuk menjawab itu.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "56px 24px 60px" }}>
        {/* Problem Statement */}
        <div style={{ background: "white", borderRadius: 20, padding: "36px", boxShadow: "0 4px 20px rgba(26,58,92,0.07)", marginBottom: 32 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "#1A3A5C", marginBottom: 20 }}>💡 Masalah yang Kami Selesaikan</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
            {[
              { icon: "📚", prob: "Informasi Tersebar", sol: "Portal ekspor biasa hanya list regulasi statis. UMKM tidak tahu mana yang relevan untuk produk mereka." },
              { icon: "🔍", prob: "Tidak Ada Validasi Aktif", sol: "Tidak ada sistem yang menganalisis kondisi aktual produk dan membandingkannya dengan standar negara tujuan." },
              { icon: "🏦", prob: "Akses Pembiayaan Sulit", sol: "UMKM tidak punya dokumen yang cukup untuk ajukan KUR Ekspor tanpa agunan — ERS mengisi gap ini." },
              { icon: "📱", prob: "Barrier Literasi Digital", sol: "Platform ekspor tidak dirancang untuk pengguna dengan literasi digital minimal di daerah 2G/3G." },
            ].map((p, i) => (
              <div key={i} style={{ padding: "20px", borderRadius: 12, background: "rgba(26,58,92,0.04)", border: "1px solid rgba(26,58,92,0.08)" }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{p.icon}</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "#B5341A", marginBottom: 8 }}>❌ {p.prob}</div>
                <div style={{ fontSize: 13, color: "#5A6878", lineHeight: 1.6 }}>{p.sol}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div style={{ background: "white", borderRadius: 20, padding: "36px", boxShadow: "0 4px 20px rgba(26,58,92,0.07)", marginBottom: 32 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "#1A3A5C", marginBottom: 24 }}>👥 Tim Pengembang</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20 }}>
            {TEAM.map((t, i) => (
              <div key={i} style={{ textAlign: "center", padding: "24px 16px", borderRadius: 16, border: "1px solid rgba(26,58,92,0.08)", background: "rgba(26,58,92,0.02)" }}>
                <div style={{
                  width: 64, height: 64, borderRadius: "50%", margin: "0 auto 14px",
                  background: `linear-gradient(135deg, ${t.warna}, ${t.warna}bb)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, color: "white",
                }}>{t.inisial}</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "#1A3A5C", marginBottom: 8 }}>{t.nama}</div>
                <div style={{ fontSize: 12, color: "#8899AA", lineHeight: 1.5 }}>{t.deskripsi}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Development Timeline */}
        <div style={{ background: "white", borderRadius: 20, padding: "36px", boxShadow: "0 4px 20px rgba(26,58,92,0.07)", marginBottom: 32 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "#1A3A5C", marginBottom: 24 }}>🗓️ Timeline Pengembangan Hackathon</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {TIMELINE.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 16 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #D4A017, #F0C040)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 12, color: "#1A3A5C", flexShrink: 0 }}>{i + 1}</div>
                  {i < TIMELINE.length - 1 && <div style={{ width: 2, height: 36, background: "rgba(212,160,23,0.2)", margin: "6px 0" }} />}
                </div>
                <div style={{ paddingBottom: i < TIMELINE.length - 1 ? 18 : 0, paddingTop: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#D4A017" }}>{t.waktu}</span>
                  <div style={{ fontSize: 14, color: "#1A3A5C", marginTop: 3 }}>{t.aksi}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div style={{ background: "linear-gradient(135deg, #1A3A5C, #0D2137)", borderRadius: 20, padding: "32px", color: "#F5F0E8", marginBottom: 32 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, marginBottom: 20 }}>⚙️ Tech Stack</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
            {[
              { cat: "Frontend", items: ["Next.js 14 (App Router)", "TypeScript", "Tailwind CSS"] },
              { cat: "AI Engine", items: ["Gemini 1.5 Pro (Vision)", "Whisper STT", "Custom OCR Pipeline"] },
              { cat: "Charts & UX", items: ["Recharts", "Framer Motion", "react-dropzone"] },
              { cat: "Backend (Planned)", items: ["FastAPI (Python)", "PostgreSQL + pgvector", "Celery + Redis"] },
            ].map((s, i) => (
              <div key={i} style={{ padding: "16px", background: "rgba(255,255,255,0.07)", borderRadius: 12 }}>
                <div style={{ fontSize: 12, color: "#D4A017", fontWeight: 700, marginBottom: 8 }}>{s.cat}</div>
                {s.items.map(item => <div key={item} style={{ fontSize: 13, color: "rgba(245,240,232,0.7)", marginBottom: 4 }}>• {item}</div>)}
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <Link href="/assessment" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "linear-gradient(135deg, #D4A017, #F0C040)", color: "#1A3A5C",
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17,
            padding: "16px 40px", borderRadius: 14, textDecoration: "none",
            boxShadow: "0 6px 24px rgba(212,160,23,0.35)",
          }}>
            🚀 Coba DIGDAYA Sekarang →
          </Link>
        </div>
      </div>
    </div>
  );
}
