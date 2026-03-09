"use client";
import Link from "next/link";
import { Play, ArrowRight } from "lucide-react";
import { useState } from "react";
import JourneyTracker from "@/components/JourneyTracker";

const VIDEO_GUIDES = [
  { id: 1, judul: "OPTIMALKAN PRODUK GULA AREN HINGGA TEMBUS PASAR DUNIA", durasi: "1:12", emoji: "👩‍🍳", deskripsi: "I Gusti Ayu Ngurah Megawati, petani milenial asal Pacitan, Jawa Timur berhasil mengoptimalkan produksi gula aren hingga menembus pasar ekspor mancanegara.", youtubeUrl: "https://www.youtube.com/embed/dGuoitHsw24?autoplay=1", thumbnailUrl: "https://img.youtube.com/vi/dGuoitHsw24/maxresdefault.jpg" },
  { id: 2, judul: "Tips Foto Produk Menggunakan HP Agar Terlihat Profesional", durasi: "5:21", emoji: "📸", deskripsi: "Cara praktis memfoto produk UMKM hanya dengan smartphone. Membuat kemasan lebih menonjol dan jelas terbaca.", youtubeUrl: "https://www.youtube.com/embed/99mynr-NWSs?autoplay=1", thumbnailUrl: "https://img.youtube.com/vi/99mynr-NWSs/maxresdefault.jpg" },
  { id: 3, judul: "Cara Memulai Ekspor untuk UMKM (Standar Ekspor)", durasi: "3:45", emoji: "📊", deskripsi: "Pelajari kriteria, regulasi, dan dimensi penilaian standar kualitas agar produk UMKM Anda siap tembus pasar dunia.", youtubeUrl: "https://www.youtube.com/embed/J5Fm8veevgE?autoplay=1", thumbnailUrl: "https://img.youtube.com/vi/J5Fm8veevgE/maxresdefault.jpg" },
  { id: 4, judul: "Tutorial Daftar Sertifikat Halal Gratis (SEHATI)", durasi: "4:12", emoji: "📋", deskripsi: "Langkah mudah mendaftar Sertifikat Halal Kemenag secara online (Self-Declare) khusus untuk pelaku Usaha Mikro dan Kecil.", youtubeUrl: "https://www.youtube.com/embed/Y1UAh5y5gus?autoplay=1", thumbnailUrl: "https://img.youtube.com/vi/Y1UAh5y5gus/maxresdefault.jpg" },
  { id: 5, judul: "Syarat & Cara Mengajukan KUR Ekspor UMKM", durasi: "6:30", emoji: "🏦", deskripsi: "Panduan lengkap syarat administrasi pengajuan KUR sebagai modal tambahan untuk operasional ekspor UMKM.", youtubeUrl: "https://www.youtube.com/embed/UxE7TTW3EbU?autoplay=1", thumbnailUrl: "https://img.youtube.com/vi/UxE7TTW3EbU/maxresdefault.jpg" },
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
        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#D4A017", letterSpacing: "0.08em", marginBottom: 16 }}>PANDUAN MEMULAI</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 4vw, 46px)", color: "#F5F0E8", marginBottom: 16, lineHeight: 1.2 }}>
            Selamat Datang di<br />
            <span style={{ color: "#D4A017" }}>DIGDAYA Export Advisor</span>
          </h1>
          <p style={{ fontSize: 17, color: "rgba(245,240,232,0.7)", marginBottom: 40 }}>
            Tonton video panduan singkat ini, lalu mulai validasi ekspor Anda dalam 10 menit.
          </p>

          <div style={{
            position: "relative", borderRadius: 20, overflow: "hidden",
            background: "linear-gradient(135deg, #1A3A5C, #0D2137)",
            border: "2px solid rgba(212,160,23,0.25)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/7yUitsWTqho?autoplay=0&rel=0" 
              title="Wirausaha Muda Sukses Membangun Desa Lewat Produk Olahan Pisang Banana Chips" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              allowFullScreen
              style={{ position: "absolute", inset: 0 }}
            ></iframe>
          </div>
          
          <div style={{ textAlign: "left", marginTop: 16 }}>
             <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "#F5F0E8" }}>
               Wirausaha Muda Sukses Membangun Desa Lewat Produk Olahan Pisang Banana Chips
             </h2>
             <div style={{ fontSize: 14, color: "rgba(245,240,232,0.6)", marginTop: 6 }}>
               Inspirasi sukses perjalanan ekspor UMKM lokal menuju pasar global
             </div>
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
                height: 130, background: v.thumbnailUrl ? `url(${v.thumbnailUrl}) center/cover no-repeat` : "linear-gradient(135deg, #1A3A5C, #2E6AA0)",
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative",
              }}>
                {!v.thumbnailUrl && <div style={{ fontSize: 52 }}>{v.emoji}</div>}
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
                position: "relative",
              }}>
                {VIDEO_GUIDES.find(v => v.id === activeVideo)?.youtubeUrl ? (
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={VIDEO_GUIDES.find(v => v.id === activeVideo)?.youtubeUrl} 
                    title={VIDEO_GUIDES.find(v => v.id === activeVideo)?.judul}
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                    style={{ position: "absolute", inset: 0 }}
                  ></iframe>
                ) : (
                  <>
                    <div style={{ fontSize: 72 }}>{VIDEO_GUIDES.find(v => v.id === activeVideo)?.emoji}</div>
                    <div style={{ fontSize: 14, color: "rgba(245,240,232,0.6)", fontStyle: "italic" }}>
                      [Demo Hackathon — Video akan diintegrasikan Cloudflare Stream]
                    </div>
                  </>
                )}
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
