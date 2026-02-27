"use client";
import { getMarketOpportunities, MarketOpportunity } from "@/lib/market-data";
import { useState } from "react";
import Link from "next/link";
import { KATEGORI_PRODUK } from "@/lib/indonesia-regions";
import { ExternalLink, TrendingUp, Shield, Globe } from "lucide-react";


function MarketCard({ m, onClick }: { m: MarketOpportunity; onClick: () => void }) {
  const score = m.peluangScore;
  const color = score >= 85 ? "#2E7D52" : score >= 75 ? "#D4A017" : "#E07B20";
  return (
    <div
      onClick={onClick}
      style={{
        background: "white", borderRadius: 20, overflow: "hidden", cursor: "pointer",
        boxShadow: "0 4px 20px rgba(26,58,92,0.08)", border: "1px solid rgba(26,58,92,0.08)",
        transition: "transform 0.3s, box-shadow 0.3s",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 40px rgba(26,58,92,0.15)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(26,58,92,0.08)"; }}
    >
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1A3A5C, #0D2137)",
        padding: "24px 24px 20px", position: "relative",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ fontSize: 40 }}>{m.bendera}</div>
          <div style={{
            display: "flex", alignItems: "center", gap: 4,
            background: "rgba(212,160,23,0.15)", border: "1px solid rgba(212,160,23,0.3)",
            borderRadius: 100, padding: "4px 12px",
          }}>
            <TrendingUp size={12} color="#D4A017" />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#D4A017" }}>{m.demandGrowth}</span>
          </div>
        </div>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: "#F5F0E8", marginTop: 10 }}>{m.negara}</h3>
        <div style={{ fontSize: 13, color: "rgba(245,240,232,0.5)", marginTop: 2 }}>Impor: USD {m.nilaiImporJutaUsd} Juta</div>
      </div>

      {/* Body */}
      <div style={{ padding: "20px 24px" }}>
        {/* Peluang score */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 6, background: "rgba(26,58,92,0.08)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${score}%`, background: color, borderRadius: 3, transition: "width 1s" }} />
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color }}>{score}</span>
        </div>

        {/* Komoditas */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: "#8899AA", fontWeight: 600, marginBottom: 6 }}>Top Komoditas</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {m.topKomoditas.map(k => (
              <span key={k} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 100, background: "rgba(26,58,92,0.07)", color: "#1A3A5C", fontWeight: 500 }}>{k}</span>
            ))}
          </div>
        </div>

        {/* Barriers */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: "#8899AA", fontWeight: 600, marginBottom: 6 }}>
            <Shield size={12} style={{ display: "inline", marginRight: 4 }} />Persyaratan Utama
          </div>
          {m.barrierUtama.slice(0, 2).map(b => (
            <div key={b} style={{ fontSize: 12, color: "#B5341A", marginBottom: 3 }}>• {b}</div>
          ))}
          {m.barrierUtama.length > 2 && <div style={{ fontSize: 12, color: "#8899AA" }}>+{m.barrierUtama.length - 2} lainnya</div>}
        </div>

        <div style={{ fontSize: 12, color: "#5A6878", fontStyle: "italic", lineHeight: 1.5, borderTop: "1px solid rgba(26,58,92,0.07)", paddingTop: 12 }}>
          {m.highlight}
        </div>
      </div>
    </div>
  );
}

export default function MarketsPage() {
  const markets = getMarketOpportunities();
  const [selected, setSelected] = useState<MarketOpportunity | null>(null);
  const [filterHS, setFilterHS] = useState("");

  return (
    <div style={{ minHeight: "100vh", background: "var(--krem-linen)", paddingTop: 80 }}>
      {/* Hero */}
      <section style={{
        background: "linear-gradient(160deg, #0D2137, #1A3A5C)",
        padding: "56px 24px 72px", textAlign: "center",
      }} className="pattern-batik-dark">
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#D4A017", letterSpacing: "0.08em", marginBottom: 14 }}>PETA PELUANG EKSPOR</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 4vw, 44px)", color: "#F5F0E8", marginBottom: 16, lineHeight: 1.2 }}>
            8 Pasar Global untuk Produk UMKM Indonesia
          </h1>
          <p style={{ fontSize: 16, color: "rgba(245,240,232,0.7)", marginBottom: 32 }}>
            Data permintaan impor diperbarui dari ITC Trade Map 2025. Temukan negara tujuan paling relevan untuk produk Anda.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, maxWidth: 600, margin: "0 auto" }}>
            {[{ val: "8", label: "Negara Tujuan" }, { val: "17", label: "Kategori HS" }, { val: "92%", label: "Akurasi Data" }, { val: "Fresh", label: "Data 2025" }].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, color: "#D4A017" }}>{s.val}</div>
                <div style={{ fontSize: 12, color: "rgba(245,240,232,0.5)", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter */}
      <div style={{ background: "white", padding: "20px 24px", borderBottom: "1px solid rgba(26,58,92,0.08)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <Globe size={18} color="#8899AA" />
          <span style={{ fontSize: 14, color: "#8899AA", fontWeight: 500 }}>Filter Kategori Produk:</span>
          <select value={filterHS} onChange={e => setFilterHS(e.target.value)} style={{
            padding: "7px 14px", borderRadius: 8, border: "1.5px solid rgba(26,58,92,0.15)",
            fontSize: 13, fontFamily: "var(--font-body)", color: "#1A3A5C", background: "white",
          }}>
            <option value="">Semua Kategori</option>
            {KATEGORI_PRODUK.map(k => <option key={k.kode} value={k.kode}>{k.kode} — {k.label}</option>)}
          </select>
          <div style={{ fontSize: 13, color: "#8899AA" }}>Menampilkan {markets.length} negara tujuan</div>
        </div>
      </div>

      {/* Cards grid */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24, marginBottom: 48 }}>
          {markets.map(m => <MarketCard key={m.kode} m={m} onClick={() => setSelected(m)} />)}
        </div>

        {/* CTA */}
        <div style={{
          textAlign: "center", padding: "48px", background: "linear-gradient(135deg, #1A3A5C, #0D2137)",
          borderRadius: 20, color: "#F5F0E8",
        }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, marginBottom: 12 }}>
            Siap Mulai Validasi Produk Anda?
          </h2>
          <p style={{ color: "rgba(245,240,232,0.6)", marginBottom: 28, fontSize: 15 }}>
            Pilih negara tujuan dan dapatkan ERS Score + roadmap perbaikan dalam 3 menit.
          </p>
          <Link href="/assessment" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "linear-gradient(135deg, #D4A017, #F0C040)", color: "#1A3A5C",
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16,
            padding: "14px 36px", borderRadius: 14, textDecoration: "none",
            boxShadow: "0 4px 20px rgba(212,160,23,0.4)",
          }}>
            Mulai Validasi Gratis <ExternalLink size={16} />
          </Link>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(13,33,55,0.85)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={() => setSelected(null)}>
          <div style={{ background: "white", borderRadius: 24, maxWidth: 580, width: "100%", overflow: "hidden", boxShadow: "0 24px 70px rgba(0,0,0,0.4)" }} onClick={e => e.stopPropagation()}>
            <div style={{ background: "linear-gradient(135deg, #1A3A5C, #0D2137)", padding: "28px 28px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 44 }}>{selected.bendera}</span>
                  <div>
                    <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "#F5F0E8" }}>{selected.negara}</h2>
                    <div style={{ fontSize: 13, color: "rgba(245,240,232,0.5)" }}>Skor Peluang: {selected.peluangScore}/100</div>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#F5F0E8", borderRadius: 8, padding: "6px 12px", cursor: "pointer" }}>✕</button>
              </div>
            </div>
            <div style={{ padding: "24px 28px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
                <div style={{ textAlign: "center", padding: 16, background: "rgba(26,58,92,0.05)", borderRadius: 10 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: "#D4A017" }}>{selected.demandGrowth}</div>
                  <div style={{ fontSize: 11, color: "#8899AA" }}>Pertumbuhan</div>
                </div>
                <div style={{ textAlign: "center", padding: 16, background: "rgba(26,58,92,0.05)", borderRadius: 10 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: "#D4A017" }}>${selected.nilaiImporJutaUsd}M</div>
                  <div style={{ fontSize: 11, color: "#8899AA" }}>Nilai Impor</div>
                </div>
                <div style={{ textAlign: "center", padding: 16, background: "rgba(26,58,92,0.05)", borderRadius: 10 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: "#D4A017" }}>{selected.ersMinimum}+</div>
                  <div style={{ fontSize: 11, color: "#8899AA" }}>ERS Minimum</div>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#1A3A5C", marginBottom: 8 }}>Persyaratan Regulasi</div>
                {selected.barrierUtama.map(b => <div key={b} style={{ fontSize: 13, color: "#B5341A", marginBottom: 4 }}>🔴 {b}</div>)}
              </div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#1A3A5C", marginBottom: 8 }}>Komoditas Unggulan</div>
                {selected.topKomoditas.map(k => <div key={k} style={{ fontSize: 13, color: "#2E7D52", marginBottom: 4 }}>✅ {k}</div>)}
              </div>
              <div style={{ padding: "14px", background: "rgba(212,160,23,0.07)", border: "1px solid rgba(212,160,23,0.2)", borderRadius: 10, fontSize: 13, color: "#5A6878", fontStyle: "italic", marginBottom: 20 }}>
                💡 {selected.highlight}
              </div>
              <Link href={`/assessment?negara=${selected.kode}`} style={{
                display: "block", textAlign: "center",
                background: "linear-gradient(135deg, #D4A017, #F0C040)", color: "#1A3A5C",
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15,
                padding: "13px", borderRadius: 12, textDecoration: "none",
              }}>→ Validasi Produk Saya untuk {selected.negara}</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
