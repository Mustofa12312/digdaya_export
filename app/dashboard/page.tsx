"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { calculateERS, ERSResult } from "@/lib/ers-engine";
import { getMarketByCode } from "@/lib/market-data";
import ERSGauge from "@/components/ERSGauge";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
} from "recharts";
import toast from "react-hot-toast";
import Link from "next/link";
import { Printer, Share2, SlidersHorizontal, ChevronDown, ChevronUp, ArrowLeft, Award, Globe } from "lucide-react";
import confetti from "canvas-confetti";

const DIMENSION_LABELS: Record<string, string> = {
  legalitas: "Legalitas", kualitas: "Kualitas", kemasan: "Kemasan", kapasitas: "Kapasitas", pasar: "Pasar",
};
const DIMENSION_WEIGHTS: Record<string, number> = {
  legalitas: 30, kualitas: 25, kemasan: 20, kapasitas: 15, pasar: 10,
};

// ─── Animated Counter ────────────────────────────────────────────────────────
function useAnimatedValue(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
}

// ─── Skeleton ────────────────────────────────────────────────────────────────
function ChartSkeleton() {
  return (
    <div style={{ padding: 28, background: "white", borderRadius: 20, boxShadow: "0 4px 20px rgba(26,58,92,0.07)" }}>
      <div className="skeleton" style={{ height: 22, width: "50%", marginBottom: 20 }} />
      <div className="skeleton" style={{ height: 200, borderRadius: 12 }} />
    </div>
  );
}

// ─── What-If Simulator ───────────────────────────────────────────────────────
function WhatIfSimulator({ base, onClose }: { base: Record<string, number>; onClose: () => void }) {
  const [sims, setSims] = useState({ ...base });

  const simERS = Math.round(
    sims.legalitas * 0.30 + sims.kualitas * 0.25 +
    sims.kemasan * 0.20 + sims.kapasitas * 0.15 + sims.pasar * 0.10
  );
  const diff = simERS - Math.round(
    base.legalitas * 0.30 + base.kualitas * 0.25 +
    base.kemasan * 0.20 + base.kapasitas * 0.15 + base.pasar * 0.10
  );
  const tierColor = simERS >= 80 ? "#2E7D52" : simERS >= 60 ? "#D4A017" : simERS >= 40 ? "#E07B20" : "#B5341A";
  const tierLabel = simERS >= 80 ? "SIAP EKSPOR" : simERS >= 60 ? "HAMPIR SIAP" : simERS >= 40 ? "PERLU PERBAIKAN" : "BELUM SIAP";

  return (
    <div style={{ background: "linear-gradient(135deg, rgba(26,58,92,0.04), rgba(212,160,23,0.04))", borderRadius: 20, padding: "28px", border: "1.5px solid rgba(212,160,23,0.2)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "#1A3A5C" }}>🎛️ What-If Simulator</h3>
          <p style={{ fontSize: 13, color: "#8899AA", marginTop: 2 }}>Geser slider untuk simulasi peningkatan ERS</p>
        </div>
        <button onClick={onClose} style={{ background: "rgba(26,58,92,0.08)", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", color: "#1A3A5C", fontSize: 13 }}>✕ Tutup</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        {Object.entries(sims).map(([k, v]) => (
          <div key={k}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#1A3A5C" }}>
                {DIMENSION_LABELS[k]} <span style={{ color: "#8899AA", fontWeight: 400 }}>({DIMENSION_WEIGHTS[k]}%)</span>
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {v > base[k] && <span style={{ fontSize: 11, color: "#2E7D52", fontWeight: 700 }}>+{v - base[k]}</span>}
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: v >= 75 ? "#2E7D52" : v >= 55 ? "#D4A017" : "#B5341A" }}>{v}</span>
              </div>
            </div>
            <input
              type="range" min={0} max={100} value={v}
              onChange={e => setSims(s => ({ ...s, [k]: parseInt(e.target.value) }))}
              className="slider-input"
            />
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "20px 24px", background: "white", borderRadius: 14, border: "1px solid rgba(26,58,92,0.1)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "#8899AA", marginBottom: 4 }}>ERS Simulasi</div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 40, color: tierColor }}>{simERS}</div>
          <div style={{ fontSize: 12, color: tierColor, fontWeight: 700 }}>{tierLabel}</div>
        </div>
        <div style={{ width: 1, height: 60, background: "rgba(26,58,92,0.1)" }} />
        <div>
          <div style={{ fontSize: 13, color: "#8899AA", marginBottom: 6 }}>Perubahan dari ERS asli:</div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, color: diff >= 0 ? "#2E7D52" : "#B5341A" }}>
            {diff >= 0 ? "+" : ""}{diff} poin
          </div>
          <div style={{ fontSize: 12, color: "#8899AA", marginTop: 4 }}>
            {simERS >= 60 && Math.round(base.legalitas * 0.30 + base.kualitas * 0.25 + base.kemasan * 0.20 + base.kapasitas * 0.15 + base.pasar * 0.10) < 60
              ? "🎉 Sudah layak pembiayaan OJK!" : diff > 0 ? "📈 Skor meningkat!" : ""}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Content ────────────────────────────────────────────────────────────
function DashboardContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [result, setResult] = useState<ERSResult | null>(null);
  const [namaUsaha, setNamaUsaha] = useState("");
  const [namaProduk, setNamaProduk] = useState("");
  const [targetNegara, setTargetNegara] = useState("JP");
  const [showFinancing, setShowFinancing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [chartsReady, setChartsReady] = useState(false);
  const [baseScores, setBaseScores] = useState<Record<string, number>>({});
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Try URL params first, then localStorage fallback
    let searchString = params.toString();
    if (!params.get("namaUsaha") && typeof window !== "undefined") {
      const saved = localStorage.getItem("digdaya_last_assessment");
      if (saved) { searchString = saved; }
    }

    const sp = new URLSearchParams(searchString);
    const na = sp.get("namaUsaha") || "UMKM Saya";
    const np = sp.get("namaProduk") || "Produk Saya";
    const tn = sp.get("targetNegara") || "JP";
    const scores = {
      legalitasScore:  parseFloat(sp.get("legalitas") || "70"),
      kualitasScore:   parseFloat(sp.get("kualitas") || "72"),
      kemasanScore:    parseFloat(sp.get("kemasan") || "65"),
      kapasitasScore:  parseFloat(sp.get("kapasitas") || "60"),
      pasarScore:      parseFloat(sp.get("pasar") || "68"),
    };
    setNamaUsaha(na); setNamaProduk(np); setTargetNegara(tn);
    setBaseScores({ legalitas: scores.legalitasScore, kualitas: scores.kualitasScore, kemasan: scores.kemasanScore, kapasitas: scores.kapasitasScore, pasar: scores.pasarScore });

    const ers = calculateERS({ namaUsaha: na, namaProduk: np, targetNegara: tn, ...scores });
    setResult(ers);
    
    if (ers.ersTotal >= 80) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    }

    // Delay charts to show skeleton first
    setTimeout(() => setChartsReady(true), 600);
  }, [params]);

  const animatedScore = useAnimatedValue(result?.ersTotal ?? 0, 1400);

  const handlePrint = () => {
    window.print();
    toast.success("Membuka dialog cetak/PDF…");
  };

  const handleShareWA = () => {
    if (!result) return;
    const market = getMarketByCode(targetNegara);
    const text = encodeURIComponent(
      `🌏 *DIGDAYA Export Advisor — Laporan ERS*\n\n` +
      `Usaha: *${namaUsaha}*\nProduk: *${namaProduk}*\n` +
      `Target Ekspor: ${market?.bendera} *${market?.negara}*\n\n` +
      `📊 *Export Readiness Score: ${result.ersTotal}/100*\n` +
      `Status: *${result.tier}*\n\n` +
      `Legalitas: ${result.dimensionScores.legalitas} | Kualitas: ${result.dimensionScores.kualitas}\n` +
      `Kemasan: ${result.dimensionScores.kemasan} | Kapasitas: ${result.dimensionScores.kapasitas}\n\n` +
      `${result.financingEligible ? "✅ Layak pembiayaan ekspor (KUR/LPEI)" : "⚠️ Belum layak, ikuti roadmap perbaikan"}\n\n` +
      `_Diperiksa oleh DIGDAYA Export Advisor — digdaya.id_`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleSubmitFinancing = () => {
    setSubmitted(true);
    setShowFinancing(false);
    toast.success("Profil ERS berhasil dikirim ke pipeline OJK/LPEI! Estimasi verifikasi: 3–5 hari kerja.", { duration: 5000 });
  };

  if (!result) return (
    <div style={{ minHeight: "100vh", background: "var(--krem-linen)", paddingTop: 88, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", border: "3px solid rgba(212,160,23,0.3)", borderTopColor: "#D4A017", animation: "spin 0.9s linear infinite" }} />
      <div style={{ fontFamily: "var(--font-display)", color: "#1A3A5C", fontSize: 17 }}>Menghitung Export Readiness Score…</div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const market = getMarketByCode(targetNegara);
  const radarData = Object.entries(result.dimensionScores).map(([k, v]) => ({ subject: DIMENSION_LABELS[k], score: v, fullMark: 100 }));
  const barData = Object.entries(result.dimensionScores).map(([k, v]) => ({ name: DIMENSION_LABELS[k], value: v, weight: DIMENSION_WEIGHTS[k] }));

  return (
    <div style={{ minHeight: "100vh", background: "var(--krem-linen)", paddingTop: 88 }} className="page-enter" ref={printRef}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0D2137, #1A3A5C)", padding: "36px 24px 56px", textAlign: "center" }} className="pattern-batik-dark">
        <div style={{ fontSize: 13, color: "#D4A017", fontWeight: 600, letterSpacing: "0.08em", marginBottom: 10 }}>EXPORT READINESS SCORE</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(20px,4vw,34px)", color: "#F5F0E8", marginBottom: 4 }}>{namaUsaha}</h1>
        <p style={{ color: "rgba(245,240,232,0.6)", fontSize: 15 }}>{namaProduk} · {market?.bendera} {market?.negara}</p>
      </div>

      <div style={{ maxWidth: 1100, margin: "-32px auto 0", padding: "0 24px 60px" }}>
        {/* Action Bar — no-print */}
        <div className="no-print" style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginBottom: 16, flexWrap: "wrap" }}>
          <button onClick={() => router.push("/assessment")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10, border: "1.5px solid rgba(26,58,92,0.2)", background: "white", color: "#1A3A5C", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            <ArrowLeft size={14} /> Ulangi
          </button>
          <button onClick={() => setShowSimulator(s => !s)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10, border: "1.5px solid rgba(212,160,23,0.4)", background: "rgba(212,160,23,0.07)", color: "#1A3A5C", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            <SlidersHorizontal size={14} color="#D4A017" /> What-If Simulator {showSimulator ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
          <button onClick={handlePrint} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10, border: "none", background: "rgba(26,58,92,0.09)", color: "#1A3A5C", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            <Printer size={14} /> Export PDF
          </button>
          <button onClick={() => setShowCertificate(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #2E7D52, #3FA86E)", color: "white", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, cursor: "pointer", boxShadow: "0 4px 12px rgba(46,125,82,0.2)" }}>
            <Award size={14} /> Lihat Sertifikat
          </button>
          <button onClick={handleShareWA} className="share-btn share-wa">
            <Share2 size={14} /> Bagikan ke WhatsApp
          </button>
        </div>

        {/* What-If Simulator */}
        {showSimulator && (
          <div style={{ marginBottom: 24 }}>
            <WhatIfSimulator base={baseScores} onClose={() => setShowSimulator(false)} />
          </div>
        )}

        {/* ERS Score Card */}
        <div style={{
          background: "white", borderRadius: 20, padding: "40px 36px",
          boxShadow: "0 10px 50px rgba(26,58,92,0.12)", border: "1px solid rgba(212,160,23,0.15)",
          display: "grid", gridTemplateColumns: "auto 1fr", gap: 40, alignItems: "center",
          marginBottom: 24,
        }} className="print-page dash-main-grid">
          {/* Gauge */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <ERSGauge score={animatedScore} tierColor={result.tierColor} size={200} />
            <div style={{
              padding: "8px 20px", borderRadius: 100, fontSize: 14, fontWeight: 700,
              fontFamily: "var(--font-display)", color: result.tierColor,
              background: `${result.tierColor}18`, border: `1.5px solid ${result.tierColor}40`,
            }}>{result.tier}</div>
          </div>

          {/* Dimension breakdown */}
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px,1fr))", gap: 14, marginBottom: 24 }}>
              {Object.entries(result.dimensionScores).map(([k, v]) => (
                <div key={k} style={{ padding: "14px 16px", borderRadius: 12, background: "rgba(26,58,92,0.04)", border: "1px solid rgba(26,58,92,0.08)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: "#8899AA", fontWeight: 600 }}>{DIMENSION_LABELS[k]}</span>
                    <span style={{ fontSize: 11, color: "#8899AA" }}>{DIMENSION_WEIGHTS[k]}%</span>
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, color: v >= 75 ? "#2E7D52" : v >= 55 ? "#D4A017" : "#B5341A" }}>{v}</div>
                  <div style={{ height: 4, background: "rgba(26,58,92,0.08)", borderRadius: 2, marginTop: 8 }}>
                    <div style={{ height: "100%", width: `${v}%`, borderRadius: 2, background: v >= 75 ? "#2E7D52" : v >= 55 ? "#D4A017" : "#B5341A", transition: "width 1.2s ease" }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="no-print" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {result.financingEligible && !submitted && (
                <button onClick={() => setShowFinancing(true)} style={{ padding: "12px 24px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #2E7D52, #3FA86E)", color: "white", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 16px rgba(46,125,82,0.3)" }}>
                  🏦 Ajukan Pembiayaan Ekspor
                </button>
              )}
              {submitted && (
                <div style={{ padding: "12px 24px", borderRadius: 12, background: "rgba(46,125,82,0.1)", border: "1px solid rgba(46,125,82,0.3)", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: "#2E7D52" }}>
                  ✅ Pengajuan Terkirim ke OJK
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }} className="dash-grid-2">
          {chartsReady ? (
            <>
              <div style={{ background: "white", borderRadius: 20, padding: "28px 24px", boxShadow: "0 4px 20px rgba(26,58,92,0.07)" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "#1A3A5C", marginBottom: 20 }}>📡 Radar 5 Dimensi</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(26,58,92,0.1)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: "#5A6878", fontFamily: "Inter" }} />
                    <Radar name="ERS" dataKey="score" stroke="#D4A017" fill="#D4A017" fillOpacity={0.15} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background: "white", borderRadius: 20, padding: "28px 24px", boxShadow: "0 4px 20px rgba(26,58,92,0.07)" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "#1A3A5C", marginBottom: 20 }}>📊 Skor per Dimensi</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={barData} layout="vertical" margin={{ left: 10 }}>
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: "#5A6878" }} width={70} />
                    <Tooltip formatter={(v: unknown) => [`${v}/100`, "Skor"]} contentStyle={{ borderRadius: 10, fontFamily: "Inter" }} />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                      {barData.map((entry, i) => <Cell key={i} fill={entry.value >= 75 ? "#2E7D52" : entry.value >= 55 ? "#D4A017" : "#B5341A"} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <><ChartSkeleton /><ChartSkeleton /></>
          )}
        </div>

        {/* Gap Analysis */}
        {result.gapAnalysis.length > 0 && (
          <div style={{ background: "white", borderRadius: 20, padding: "28px 28px", boxShadow: "0 4px 20px rgba(26,58,92,0.07)", marginBottom: 24 }} className="print-page">
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "#1A3A5C", marginBottom: 20 }}>🔍 Gap Analysis</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {result.gapAnalysis.map((g, i) => (
                <div key={i} style={{
                  padding: "16px 20px", borderRadius: 12,
                  background: g.dampak === "TINGGI" ? "rgba(181,52,26,0.04)" : g.dampak === "SEDANG" ? "rgba(224,123,32,0.04)" : "rgba(26,58,92,0.04)",
                  border: `1px solid ${g.dampak === "TINGGI" ? "rgba(181,52,26,0.2)" : g.dampak === "SEDANG" ? "rgba(224,123,32,0.2)" : "rgba(26,58,92,0.1)"}`,
                  display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px 16px",
                }}>
                  <span style={{ padding: "2px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: g.dampak === "TINGGI" ? "#B5341A" : g.dampak === "SEDANG" ? "#E07B20" : "#8899AA", color: "white", whiteSpace: "nowrap", alignSelf: "start", marginTop: 2 }}>{g.dampak}</span>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#1A3A5C" }}><strong>{g.dimensi}:</strong> {g.temuan}</div>
                  <div />
                  <div style={{ fontSize: 13, color: "#5A6878" }}>💡 {g.rekomendasi}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Roadmap */}
        <div style={{ background: "white", borderRadius: 20, padding: "28px 28px", boxShadow: "0 4px 20px rgba(26,58,92,0.07)", marginBottom: 24 }} className="print-page">
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "#1A3A5C", marginBottom: 20 }}>🗺️ Roadmap 90 Hari Menuju Ekspor</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {result.roadmap90Hari.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 16 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: r.prioritas === "HIGH" ? "linear-gradient(135deg,#B5341A,#D94523)" : r.prioritas === "MEDIUM" ? "linear-gradient(135deg,#E07B20,#F5A030)" : "linear-gradient(135deg,#2E7D52,#3FA86E)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, color: "white", flexShrink: 0 }}>{i + 1}</div>
                  {i < result.roadmap90Hari.length - 1 && <div style={{ width: 2, height: 40, background: "rgba(26,58,92,0.08)", margin: "6px 0" }} />}
                </div>
                <div style={{ paddingBottom: i < result.roadmap90Hari.length - 1 ? 20 : 0 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#8899AA" }}>Minggu {r.minggu}</span>
                    <span style={{ fontSize: 10, padding: "1px 8px", borderRadius: 100, fontWeight: 700, background: r.prioritas === "HIGH" ? "rgba(181,52,26,0.1)" : r.prioritas === "MEDIUM" ? "rgba(224,123,32,0.1)" : "rgba(46,125,82,0.1)", color: r.prioritas === "HIGH" ? "#B5341A" : r.prioritas === "MEDIUM" ? "#E07B20" : "#2E7D52" }}>{r.prioritas}</span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#1A3A5C", marginBottom: 4 }}>{r.aksi}</div>
                  <div style={{ fontSize: 12, color: "#8899AA" }}>Estimasi: {r.estimasiBiaya}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market info */}
        {market && (
          <div style={{ background: "linear-gradient(135deg,#1A3A5C,#0D2137)", borderRadius: 20, padding: "28px 28px", color: "#F5F0E8", marginBottom: 24 }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, marginBottom: 16 }}>{market.bendera} Pasar {market.negara} — Data & Peluang</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 16 }}>
              {[
                { label: "Pertumbuhan Demand", val: market.demandGrowth },
                { label: "Nilai Impor (USD)", val: `${market.nilaiImporJutaUsd} Jt` },
                { label: "Skor Peluang", val: `${market.peluangScore}/100` },
              ].map(s => (
                <div key={s.label} style={{ padding: 16, background: "rgba(255,255,255,0.07)", borderRadius: 12 }}>
                  <div style={{ fontSize: 12, color: "rgba(245,240,232,0.5)", marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, color: "#D4A017" }}>{s.val}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, padding: "14px 18px", background: "rgba(212,160,23,0.1)", borderRadius: 10, border: "1px solid rgba(212,160,23,0.25)", fontSize: 14, color: "rgba(245,240,232,0.8)", fontStyle: "italic" }}>
              💡 {market.highlight}
            </div>
          </div>
        )}

        {/* Navigation CTA */}
        <div className="no-print" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/markets" style={{ padding: "13px 28px", borderRadius: 12, border: "1.5px solid rgba(26,58,92,0.2)", color: "#1A3A5C", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15, textDecoration: "none", background: "white" }}>
            🌍 Jelajahi Pasar Lain
          </Link>
          <Link href="/impact" style={{ padding: "13px 28px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#1A3A5C,#2E6AA0)", color: "white", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15, textDecoration: "none" }}>
            📈 Lihat Dampak Nasional
          </Link>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(13,33,55,0.92)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={() => setShowCertificate(false)}>
          <div style={{
            background: "white", width: "100%", maxWidth: 840,
            borderRadius: 0, padding: 0, position: "relative",
            boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
            overflow: "hidden"
          }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: 40, border: "15px solid #1A3A5C", position: "relative" }} className="pattern-batik">
              {/* Certificate Inner Border */}
              <div style={{ border: "2px solid #D4A017", padding: "40px", textAlign: "center", background: "rgba(255,255,255,0.95)" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1A3A5C", letterSpacing: "0.2em", marginBottom: 20 }}>DIGDAYA EXPORT ADVISOR</div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, color: "#1A3A5C", marginBottom: 4 }}>SERTIFIKAT KESIAPAN EKSPOR</h2>
                <div style={{ width: 60, height: 2, background: "#D4A017", margin: "16px auto 24px" }} />
                
                <p style={{ fontSize: 15, color: "#5A6878", marginBottom: 8 }}>Sertifikat ini diberikan kepada:</p>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 800, color: "#D4A017", marginBottom: 8 }}>{namaUsaha}</div>
                <p style={{ fontSize: 15, color: "#5A6878", marginBottom: 32 }}>atas keberhasilan mencapai standar kelayakan ekspor untuk produk:</p>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#1A3A5C", marginBottom: 40 }}>{namaProduk}</div>

                <div style={{ display: "flex", justifyContent: "center", gap: 60, marginBottom: 40 }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 12, color: "#8899AA", marginBottom: 4 }}>Negara Tujuan</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#1A3A5C" }}>{market?.negara}</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 12, color: "#8899AA", marginBottom: 4 }}>ERS Score</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: result.tierColor }}>{result.ersTotal}</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 12, color: "#8899AA", marginBottom: 4 }}>Tier Level</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: result.tierColor }}>{result.tier}</div>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 40 }}>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 11, color: "#8899AA" }}>ID Sertifikat:</div>
                    <div style={{ fontSize: 11, color: "#1A3A5C", fontWeight: 600 }}>DGDY-{Math.random().toString(36).substring(7).toUpperCase()}-2026</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ width: 100, height: 100, background: "rgba(26,58,92,0.05)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed rgba(26,58,92,0.2)", marginBottom: 10 }}>
                      <Globe size={40} color="rgba(26,58,92,0.2)" />
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#1A3A5C" }}>Digital Verification Center</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "#D4A017", fontSize: 24, marginBottom: 8 }}>DIGDAYA</div>
                    <div style={{ fontSize: 11, color: "#8899AA" }}>Diterbitkan pada:</div>
                    <div style={{ fontSize: 11, color: "#1A3A5C", fontWeight: 600 }}>{new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ background: "#F8FAFC", padding: "16px 24px", display: "flex", justifyContent: "flex-end", gap: 12 }}>
               <button onClick={handlePrint} style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "#1A3A5C", color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Unduh Sebagai PDF</button>
               <button onClick={() => setShowCertificate(false)} style={{ padding: "10px 20px", borderRadius: 8, border: "1px solid rgba(26,58,92,0.2)", background: "white", color: "#64748B", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Tutup</button>
            </div>
          </div>
        </div>
      )}

      {/* Financing Modal */}
      {showFinancing && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(13,33,55,0.8)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={() => setShowFinancing(false)}>
          <div style={{ background: "white", borderRadius: 20, padding: "36px", maxWidth: 520, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "#1A3A5C", marginBottom: 8 }}>🏦 Ajukan Pembiayaan Ekspor</h2>
            <p style={{ fontSize: 14, color: "#8899AA", marginBottom: 24 }}>Skor ERS <strong style={{ color: "#2E7D52" }}>{result.ersTotal}/100</strong> memenuhi syarat pembiayaan ekspor.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {["KUR Ekspor — BRI (s.d. Rp 500 Juta)", "KUR Ekspor — BNI (s.d. Rp 500 Juta)", "LPEI — Buyer's Credit", "Asuransi Ekspor — LPEI"].map(opt => (
                <label key={opt} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "12px 16px", borderRadius: 10, background: "rgba(26,58,92,0.04)", border: "1px solid rgba(26,58,92,0.1)" }}>
                  <input type="checkbox" defaultChecked style={{ width: 16, height: 16, accentColor: "#2E7D52" }} />
                  <span style={{ fontSize: 14, color: "#1A3A5C" }}>{opt}</span>
                </label>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleSubmitFinancing} style={{ flex: 1, padding: "13px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#2E7D52,#3FA86E)", color: "white", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
                ✅ Kirim ke Pipeline OJK/LPEI
              </button>
              <button onClick={() => setShowFinancing(false)} style={{ padding: "13px 20px", borderRadius: 12, border: "1.5px solid rgba(26,58,92,0.15)", background: "white", color: "#8899AA", fontFamily: "var(--font-body)", cursor: "pointer" }}>Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, background: "var(--krem-linen)" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", border: "3px solid rgba(212,160,23,0.3)", borderTopColor: "#D4A017", animation: "spin 0.9s linear infinite" }} />
        <p style={{ fontFamily: "var(--font-display)", color: "#1A3A5C", fontSize: 17 }}>Memuat dashboard…</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
