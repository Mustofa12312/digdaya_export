"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, TrendingUp, Shield, Zap, Globe, Users, Award, ChevronDown } from "lucide-react";

function AnimatedCounter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const step = target / 60;
          const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(start));
          }, 20);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 42, color: "#D4A017" }}>
      {prefix}{count.toLocaleString("id-ID")}{suffix}
    </div>
  );
}

const USPs = [
  {
    icon: <Zap size={28} color="#D4A017" />,
    title: "AI Compliance Engine",
    desc: "Analisis foto kemasan & dokumen dalam hitungan detik. Dapatkan skor kesiapan ekspor per regulasi negara tujuan.",
    tag: "Computer Vision + OCR",
  },
  {
    icon: <Shield size={28} color="#D4A017" />,
    title: "ERS sebagai Bukti Kredit",
    desc: "Skor ERS Anda terintegrasi dengan SLIK OJK — menjadi aset digital untuk pengajuan KUR Ekspor tanpa agunan.",
    tag: "Integrasi OJK & LPEI",
  },
  {
    icon: <Globe size={28} color="#D4A017" />,
    title: "Zero-Barrier UX",
    desc: "Antarmuka 12 bahasa daerah, navigasi berbasis ikon, panduan video sinematik — desain untuk UMKM pelosok desa.",
    tag: "PWA Offline-First",
  },
];

const STATS = [
  { target: 50000, suffix: "+", label: "UMKM Terdampak (Target)", icon: <Users size={22} color="#D4A017" /> },
  { target: 8, label: "Negara Tujuan Ekspor", icon: <Globe size={22} color="#D4A017" /> },
  { target: 5, suffix: " Jt", prefix: "USD ", label: "Nilai Ekspor Difasilitasi", icon: <TrendingUp size={22} color="#D4A017" /> },
  { target: 200, suffix: "+", label: "Kabupaten/Kota", icon: <Award size={22} color="#D4A017" /> },
];

const STEPS = [
  { no: "01", icon: "📸", title: "Foto Kemasan & Dokumen", desc: "Upload foto kemasan produk dan dokumen legalitas (NIE, PIRT, Halal, SNI)" },
  { no: "02", icon: "🤖", title: "AI Menganalisis", desc: "Sistem AI membandingkan kemasan & dokumen Anda dengan regulasi 8 negara tujuan ekspor" },
  { no: "03", icon: "📊", title: "Dapatkan ERS Score", desc: "Skor kesiapan ekspor 0–100 dengan breakdown 5 dimensi dan roadmap perbaikan 90 hari" },
  { no: "04", icon: "🚀", title: "Terhubung ke Buyer & Bank", desc: "Langsung ajukan pembiayaan ekspor ke LPEI/KUR dan temukan buyer potensial" },
];

const TESTIMONIALS = [
  { nama: "Bu Sari Dewi", usaha: "Keripik Rempah Sari Murni, Bantul", skor: 84, negara: "🇯🇵 Jepang", kutipan: "Saya tidak menyangka kemasan saya hanya perlu sedikit perbaikan untuk ekspor ke Jepang." },
  { nama: "Pak Ahmad Basri", usaha: "Kopi Gayo Premium, Aceh Tengah", skor: 91, negara: "🇺🇸 Amerika & 🇩🇪 Jerman", kutipan: "ERS saya 91 — langsung dihubungi LPEI untuk fasilitas pembiayaan ekspor 150 juta." },
  { nama: "Ibu Rahayu", usaha: "Tenun Troso Jepara", skor: 73, negara: "🇦🇺 Australia", kutipan: "Dalam 3 bulan ikuti roadmap, skor naik dari 52 ke 73 dan kini ada buyer dari Melbourne." },
];

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      {/* HERO */}
      <section style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #0D2137 0%, #1A3A5C 55%, #0F2A44 100%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden", paddingTop: 80,
      }} className="pattern-batik-dark">
        {/* Floating orbs */}
        <div style={{ position: "absolute", top: "15%", left: "8%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,160,23,0.12) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "20%", right: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(46,125,82,0.1) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 860, textAlign: "center", padding: "0 24px", position: "relative", zIndex: 2 }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28,
            background: "rgba(212,160,23,0.12)", border: "1px solid rgba(212,160,23,0.35)",
            borderRadius: 100, padding: "7px 18px",
          }}>
            <span style={{ fontSize: 16 }}>🏆</span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: "#D4A017", letterSpacing: "0.04em" }}>
              PIDI · DIGDAYA HACKATHON 2026
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(36px, 6vw, 68px)",
            color: "#F5F0E8", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 24,
          }}>
            Penasihat Ekspor AI
            <br />
            <span style={{ background: "linear-gradient(135deg, #D4A017, #F0C040)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              untuk UMKM Indonesia
            </span>
          </h1>

          <p style={{ fontSize: "clamp(16px, 2vw, 19px)", color: "rgba(245,240,232,0.72)", lineHeight: 1.7, marginBottom: 40, maxWidth: 640, margin: "0 auto 40px" }}>
            Validasi kesiapan ekspor produk Anda ke 8 pasar global dalam hitungan menit. 
            AI kami menganalisis kemasan, dokumen, dan kapasitas produksi — hasilnya menjadi bukti layak kredit di OJK.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 56 }}>
            <Link href="/assessment" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17,
              background: "linear-gradient(135deg, #D4A017, #F0C040)",
              color: "#1A3A5C", textDecoration: "none",
              padding: "16px 36px", borderRadius: 14,
              boxShadow: "0 6px 30px rgba(212,160,23,0.45)",
              transition: "all 0.3s",
            }}>
              Mulai Validasi Gratis <ArrowRight size={18} />
            </Link>
            <Link href="/onboarding" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 16,
              background: "rgba(255,255,255,0.08)", color: "#F5F0E8",
              textDecoration: "none", padding: "16px 32px", borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.15)",
              transition: "all 0.3s",
            }}>
              ▶ Lihat Video Panduan
            </Link>
          </div>

          {/* Mini trust row */}
          <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
            {["🏦 Terintegrasi OJK/SLIK", "🛡️ Data Aman & Terenkripsi", "🌐 8 Pasar Global", "⚡ Hasil dalam 3 Menit"].map(t => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(245,240,232,0.6)", fontFamily: "var(--font-body)" }}>
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* Scroll arrow */}
        <div style={{ position: "absolute", bottom: 32, animation: "float 2s ease-in-out infinite" }}>
          <ChevronDown size={28} color="rgba(212,160,23,0.6)" />
        </div>
      </section>

      {/* STATS SECTION */}
      <section style={{ background: "white", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 0 }}>
            {STATS.map((s, i) => (
              <div key={i} style={{
                textAlign: "center", padding: 36,
                borderRight: i < STATS.length - 1 ? "1px solid rgba(26,58,92,0.08)" : "none",
              }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>{s.icon}</div>
                <AnimatedCounter target={s.target} suffix={s.suffix} prefix={s.prefix} />
                <div style={{ fontSize: 14, color: "#8899AA", fontFamily: "var(--font-body)", marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USP SECTION */}
      <section style={{ background: "var(--krem-linen)", padding: "88px 24px" }} className="pattern-batik">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#D4A017", letterSpacing: "0.08em", marginBottom: 10, fontFamily: "var(--font-body)" }}>KEUNGGULAN KAMI</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 4vw, 42px)", color: "#1A3A5C", lineHeight: 1.2 }}>
              Bukan Sekadar Portal Informasi Ekspor
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 24 }}>
            {USPs.map((u, i) => (
              <div key={i} className="glass-card-light" style={{
                padding: 32,
                transition: "transform 0.3s, box-shadow 0.3s",
                cursor: "default",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 48px rgba(26,58,92,0.12)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: 14,
                  background: "linear-gradient(135deg, rgba(212,160,23,0.12), rgba(212,160,23,0.05))",
                  border: "1px solid rgba(212,160,23,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 20,
                }}>{u.icon}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 19, color: "#1A3A5C", marginBottom: 10 }}>{u.title}</h3>
                <p style={{ fontSize: 14, color: "#5A6878", lineHeight: 1.7 }}>{u.desc}</p>
                <div style={{
                  marginTop: 18, display: "inline-block",
                  background: "rgba(26,58,92,0.07)", borderRadius: 100,
                  padding: "5px 14px", fontSize: 12, fontWeight: 600, color: "#1A3A5C",
                }}>{u.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: "#1A3A5C", padding: "88px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#D4A017", letterSpacing: "0.08em", marginBottom: 10 }}>CARA KERJA</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px, 4vw, 40px)", color: "#F5F0E8" }}>
              Dari Foto Kemasan ke Pasar Global
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 4 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ position: "relative", padding: "32px 24px", textAlign: "center" }}>
                {i < STEPS.length - 1 && (
                  <div style={{ position: "absolute", right: 0, top: "40%", width: 4, height: 4, borderTop: "2px dashed rgba(212,160,23,0.3)", borderRight: "2px dashed rgba(212,160,23,0.3)", transform: "rotate(45deg)" }} />
                )}
                <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(212,160,23,0.5)", marginBottom: 12, letterSpacing: "0.05em" }}>{s.no}</div>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{s.icon}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "#F5F0E8", marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "rgba(245,240,232,0.6)", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ background: "white", padding: "88px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#D4A017", letterSpacing: "0.08em", marginBottom: 10 }}>KISAH SUKSES</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px, 4vw, 40px)", color: "#1A3A5C" }}>
              Mereka Sudah Membuktikannya
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="glass-card-light" style={{ padding: 28, transition: "transform 0.3s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
                  <div style={{
                    width: 50, height: 50, borderRadius: "50%",
                    background: `hsl(${i * 60 + 200}, 50%, 55%)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "white", flexShrink: 0,
                  }}>{t.nama[0]}</div>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "#1A3A5C" }}>{t.nama}</div>
                    <div style={{ fontSize: 12, color: "#8899AA", marginTop: 2 }}>{t.usaha}</div>
                  </div>
                </div>
                <blockquote style={{ fontSize: 14, color: "#3A5070", lineHeight: 1.7, fontStyle: "italic", marginBottom: 16 }}>
                  &ldquo;{t.kutipan}&rdquo;
                </blockquote>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, color: "#2E7D52" }}>{t.skor}</span>
                    <span style={{ fontSize: 13, color: "#8899AA" }}>ERS</span>
                  </div>
                  <div style={{ fontSize: 13, color: "#5A6878" }}>{t.negara}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{
        background: "linear-gradient(135deg, #D4A017, #F0C040)",
        padding: "72px 24px", textAlign: "center",
      }} className="pattern-batik">
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 4vw, 44px)", color: "#1A3A5C", lineHeight: 1.2, marginBottom: 18 }}>
            Siap Membawa Produk Anda ke Pasar Dunia?
          </h2>
          <p style={{ fontSize: 17, color: "rgba(26,58,92,0.8)", marginBottom: 36 }}>
            Gratis. Cepat. Akurat. Mulai validasi dalam 3 menit.
          </p>
          <Link href="/assessment" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18,
            background: "#1A3A5C", color: "#F5F0E8", textDecoration: "none",
            padding: "18px 44px", borderRadius: 16,
            boxShadow: "0 8px 30px rgba(26,58,92,0.35)",
          }}>
            Cek Kesiapan Ekspor Sekarang <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0D2137", padding: "40px 24px", textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: "#D4A017", marginBottom: 8 }}>DIGDAYA</div>
        <div style={{ fontSize: 13, color: "rgba(245,240,232,0.4)", fontFamily: "var(--font-body)" }}>
          © 2026 DIGDAYA Export Advisor · PIDI Hackathon 2026 · Membangun UMKM Indonesia Mendunia
        </div>
      </footer>
    </div>
  );
}
