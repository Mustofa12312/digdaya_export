"use client";
import Link from "next/link";
import { Play, ArrowRight } from "lucide-react";
import { useState } from "react";
import JourneyTracker from "@/components/JourneyTracker";

const VIDEO_GUIDES = [
  { id: 1, judul: "Kisah Bu Sari: Dari Dapur ke Jepang", durasi: "1:12", emoji: "👩‍🍳", deskripsi: "Bagaimana Bu Sari dari Bantul berhasil mengekspor keripik tempenya ke Jepang dengan bantuan DIGDAYA." },
  { id: 2, judul: "Cara Foto Kemasan yang Benar", durasi: "0:58", emoji: "📸", deskripsi: "Tips praktis memfoto kemasan agar AI dapat membaca semua elemen label dengan akurat." },
  { id: 3, judul: "Memahami Skor ERS Anda", durasi: "1:30", emoji: "📊", deskripsi: "Penjelasan 5 dimensi penilaian dan cara meningkatkan skor untuk menyamai standar ekspor." },
  { id: 4, judul: "Cara Upload Dokumen Legalitas", durasi: "0:45", emoji: "📋", deskripsi: "Panduan foto dokumen NIE, PIRT, Halal MUI yang berkualitas cukup untuk verifikasi OCR." },
  { id: 5, judul: "Mengajukan KUR Ekspor via DIGDAYA", durasi: "2:10", emoji: "🏦", deskripsi: "Langkah demi langkah menggunakan skor ERS sebagai bukti ajukan pembiayaan ekspor." },
];

export default function OnboardingPage() {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const [step, setStep] = useState(1);

  return (
    <div style={{ minHeight: "100vh", background: "var(--krem-linen)", paddingTop: 80 }}>
      {/* Hero */}
      <section style={{
        background: "linear-gradient(160deg, #0D2137 0%, #1A3A5C 100%)",
        padding: "60px 24px 80px", textAlign: "center",
        position: "relative", overflow: "hidden",
      }} className="pattern-batik-dark">
        <div style={{ maxWidth: 700, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#D4A017", letterSpacing: "0.08em", marginBottom: 16 }}>PANDUAN MEMULAI</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 4vw, 46px)", color: "#F5F0E8", marginBottom: 16, lineHeight: 1.2 }}>
            Selamat Datang di<br />
            <span style={{ color: "#D4A017" }}>DIGDAYA Export Advisor</span>
          </h1>
          <p style={{ fontSize: 17, color: "rgba(245,240,232,0.7)", marginBottom: 40 }}>
            Tonton video panduan singkat ini, lalu mulai validasi ekspor Anda dalam 3 menit.
          </p>

          {/* Main video placeholder */}
          <div style={{
            position: "relative", borderRadius: 20, overflow: "hidden",
            background: "linear-gradient(135deg, #1A3A5C, #0D2137)",
            border: "2px solid rgba(212,160,23,0.25)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }} onClick={() => setActiveVideo(1)}>
            {/* Sinematic background visual */}
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 120, opacity: 0.08 }}>🌾</div>
            </div>
            <div style={{ position: "absolute", bottom: 24, left: 28, textAlign: "left" }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "#F5F0E8" }}>Kisah Bu Sari</div>
              <div style={{ fontSize: 13, color: "rgba(245,240,232,0.6)", marginTop: 2 }}>Dari Bantul ke Tokyo — Perjalanan Ekspor UMKM</div>
            </div>
            <button style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "linear-gradient(135deg, #D4A017, #F0C040)",
              border: "none", display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", boxShadow: "0 8px 30px rgba(212,160,23,0.5)",
              position: "relative", zIndex: 2,
              animation: "pulse-glow 2s ease-in-out infinite",
            }}>
              <Play size={28} color="#1A3A5C" fill="#1A3A5C" style={{ marginLeft: 3 }} />
            </button>
          </div>
        </div>
      </section>

      {/* Journey tracker mockup */}
      <section style={{ background: "white", padding: "48px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "#1A3A5C" }}>
              Perjalanan Ekspor Anda
            </h2>
            <p style={{ fontSize: 14, color: "#8899AA", marginTop: 6 }}>Cukup 5 langkah sederhana untuk validasi ekspor Anda</p>
          </div>
          <JourneyTracker currentStep={step} />
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24 }}>
            {[1,2,3,4,5].map(s => (
              <button key={s} onClick={() => setStep(s)} style={{
                padding: "6px 14px", borderRadius: 8, border: "none",
                background: step === s ? "rgba(212,160,23,0.15)" : "rgba(26,58,92,0.06)",
                color: step === s ? "#D4A017" : "#8899AA",
                fontSize: 13, cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 600,
              }}>{s}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Video library */}
      <section style={{ padding: "52px 24px 80px", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "#1A3A5C", marginBottom: 24 }}>
          📹 Perpustakaan Video Panduan
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
          {VIDEO_GUIDES.map(v => (
            <div key={v.id} className="glass-card-light" style={{
              overflow: "hidden", cursor: "pointer", transition: "transform 0.3s, box-shadow 0.3s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 30px rgba(26,58,92,0.12)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
            onClick={() => setActiveVideo(v.id)}
            >
              {/* Thumbnail */}
              <div style={{
                height: 130, background: "linear-gradient(135deg, #1A3A5C, #2E6AA0)",
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative",
              }}>
                <div style={{ fontSize: 52 }}>{v.emoji}</div>
                <div style={{
                  position: "absolute", bottom: 10, right: 10,
                  background: "rgba(0,0,0,0.6)", color: "white",
                  fontSize: 11, padding: "2px 8px", borderRadius: 4, fontFamily: "var(--font-body)",
                }}>{v.durasi}</div>
                <div style={{
                  position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: 0, transition: "opacity 0.2s",
                }} className="play-overlay">
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: "rgba(212,160,23,0.9)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Play size={18} color="#1A3A5C" fill="#1A3A5C" style={{ marginLeft: 2 }} />
                  </div>
                </div>
              </div>
              <div style={{ padding: "16px 18px" }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "#1A3A5C", marginBottom: 6 }}>{v.judul}</div>
                <div style={{ fontSize: 12, color: "#8899AA", lineHeight: 1.5 }}>{v.deskripsi}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Video modal */}
        {activeVideo !== null && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(13,33,55,0.92)", zIndex: 999,
            display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
          }} onClick={() => setActiveVideo(null)}>
            <div style={{
              background: "#1A3A5C", borderRadius: 20, overflow: "hidden",
              maxWidth: 720, width: "100%",
              border: "2px solid rgba(212,160,23,0.3)",
              boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
            }} onClick={e => e.stopPropagation()}>
              <div style={{
                aspectRatio: "16/9", background: "linear-gradient(135deg, #0D2137, #1A3A5C)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16,
              }}>
                <div style={{ fontSize: 72 }}>{VIDEO_GUIDES.find(v => v.id === activeVideo)?.emoji}</div>
                <div style={{ fontSize: 14, color: "rgba(245,240,232,0.6)", fontStyle: "italic" }}>
                  [Demo Hackathon — Video akan diintegrasikan Cloudflare Stream]
                </div>
              </div>
              <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "#F5F0E8" }}>
                    {VIDEO_GUIDES.find(v => v.id === activeVideo)?.judul}
                  </div>
                </div>
                <button onClick={() => setActiveVideo(null)} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#F5F0E8", padding: "8px 16px", borderRadius: 8, cursor: "pointer" }}>✕ Tutup</button>
              </div>
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 48 }}>
          <Link href="/assessment" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17,
            background: "linear-gradient(135deg, #D4A017, #F0C040)",
            color: "#1A3A5C", textDecoration: "none",
            padding: "16px 40px", borderRadius: 14,
            boxShadow: "0 6px 24px rgba(212,160,23,0.4)",
          }}>
            Saya Siap — Mulai Validasi <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
