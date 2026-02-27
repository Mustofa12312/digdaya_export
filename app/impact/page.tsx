"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts";
import Link from "next/link";


const PROVINSI_DATA = [
  { name: "Jawa Tengah", umkm: 8420, eligible: 3210, color: "#1A3A5C" },
  { name: "Jawa Timur", umkm: 7890, eligible: 2890, color: "#234E7A" },
  { name: "Jawa Barat", umkm: 6540, eligible: 2100, color: "#2E6AA0" },
  { name: "Sumatra Utara", umkm: 4200, eligible: 1540, color: "#D4A017" },
  { name: "Sulawesi Sel.", umkm: 3100, eligible: 980, color: "#E07B20" },
  { name: "Bali", umkm: 2800, eligible: 1200, color: "#2E7D52" },
  { name: "Aceh", umkm: 1900, eligible: 780, color: "#8899AA" },
];

const TIER_DATA = [
  { name: "Siap Ekspor (≥80)", value: 18, color: "#2E7D52" },
  { name: "Hampir Siap (60–79)", value: 34, color: "#D4A017" },
  { name: "Perlu Perbaikan (40–59)", value: 31, color: "#E07B20" },
  { name: "Belum Siap (<40)", value: 17, color: "#B5341A" },
];

const KPI_DATA = [
  { icon: "🏭", value: "34.820", label: "UMKM Dinilai", sub: "Sejak Januari 2026", color: "#1A3A5C" },
  { icon: "✅", value: "18.240", label: "Layak Pembiayaan", sub: "ERS ≥ 60 (52.4%)", color: "#2E7D52" },
  { icon: "💰", value: "USD 2.3M", label: "Nilai Ekspor Difasilitasi", sub: "Q1 2026 (kumulatif)", color: "#D4A017" },
  { icon: "🏦", value: "4.190", label: "Pengajuan KUR Ekspor", sub: "Diproses 3–5 hari kerja", color: "#234E7A" },
  { icon: "🌍", value: "128", label: "Kabupaten/Kota", sub: "Dari target 200+", color: "#E07B20" },
  { icon: "📈", value: "73%", label: "Peningkatan ERS", sub: "UMKM ikuti roadmap 90 hari", color: "#3FA86E" },
];

const TREND_DATA = [
  { bulan: "Okt 25", umkm: 1200 },
  { bulan: "Nov 25", umkm: 2800 },
  { bulan: "Des 25", umkm: 4100 },
  { bulan: "Jan 26", umkm: 6800 },
  { bulan: "Feb 26", umkm: 9200 },
  { bulan: "Mar 26", umkm: 11520 },
];

const PARTNER_LOGOS = [
  { nama: "Bank Indonesia", logo: "🏦", peran: "Data Neraca Perdagangan" },
  { nama: "OJK / SLIK", logo: "🛡️", peran: "Integrasi Kredit Ekspor" },
  { nama: "LPEI", logo: "🌐", peran: "Pembiayaan Ekspor" },
  { nama: "Kemendag", logo: "⚖️", peran: "Regulasi & Kebijakan" },
  { nama: "BPOM", logo: "🔬", peran: "Validasi Nomor NIE/PIRT" },
  { nama: "DJKI", logo: "™️", peran: "Verifikasi Merek" },
];

export default function ImpactPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--krem-linen)", paddingTop: 80 }}>
      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg, #0D2137, #1A3A5C)", padding: "56px 24px 72px", textAlign: "center" }} className="pattern-batik-dark">
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#D4A017", letterSpacing: "0.08em", marginBottom: 14 }}>DAMPAK NASIONAL</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 4vw, 44px)", color: "#F5F0E8", lineHeight: 1.2, marginBottom: 16 }}>
            Mengukur Perubahan Nyata<br />
            <span style={{ color: "#D4A017" }}>bagi UMKM Indonesia</span>
          </h1>
          <p style={{ fontSize: 16, color: "rgba(245,240,232,0.7)" }}>
            Dashboard agregat data DIGDAYA — membantu Bank Indonesia & OJK memetakan UMKM layak pembiayaan ekspor di seluruh nusantara.
          </p>
        </div>
      </section>

      {/* KPI Cards */}
      <div style={{ maxWidth: 1100, margin: "-28px auto 0", padding: "0 24px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 16, marginBottom: 32 }}>
          {KPI_DATA.map((k, i) => (
            <div key={i} style={{
              background: "white", borderRadius: 16, padding: "24px 20px",
              boxShadow: "0 4px 20px rgba(26,58,92,0.08)",
              borderLeft: `4px solid ${k.color}`,
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{k.icon}</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, color: k.color }}>{k.value}</div>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#1A3A5C", marginTop: 2 }}>{k.label}</div>
              <div style={{ fontSize: 12, color: "#8899AA", marginTop: 4 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
          {/* Trend chart */}
          <div style={{ background: "white", borderRadius: 20, padding: "28px", boxShadow: "0 4px 20px rgba(26,58,92,0.07)" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "#1A3A5C", marginBottom: 20 }}>📈 Tren Pendaftaran UMKM</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={TREND_DATA}>
                <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: "#8899AA" }} />
                <YAxis tick={{ fontSize: 11, fill: "#8899AA" }} />
                <Tooltip contentStyle={{ borderRadius: 10, fontFamily: "Inter", border: "1px solid rgba(26,58,92,0.1)" }} formatter={(v: unknown) => [`${Number(v).toLocaleString("id-ID")} UMKM`]} />
                <Bar dataKey="umkm" fill="#1A3A5C" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tier pie */}
          <div style={{ background: "white", borderRadius: 20, padding: "28px", boxShadow: "0 4px 20px rgba(26,58,92,0.07)" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "#1A3A5C", marginBottom: 20 }}>🎯 Distribusi Tier ERS</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={TIER_DATA} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, value }) => `${value}%`} labelLine={false}>
                  {TIER_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                <Tooltip formatter={(v: unknown) => [`${v}%`]} contentStyle={{ borderRadius: 10, fontFamily: "Inter" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Indonesia Heatmap Visual */}
        <div style={{ background: "white", borderRadius: 20, padding: "32px", boxShadow: "0 4px 20px rgba(26,58,92,0.07)", marginBottom: 28 }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "#1A3A5C" }}>🗺️ Heatmap Kesiapan Ekspor Nasional</h3>
            <p style={{ fontSize: 13, color: "#8899AA", marginTop: 4 }}>Arahkan kursor ke wilayah untuk melihat populasi UMKM</p>
          </div>
          
          <div style={{ position: "relative", width: "100%", height: 350, background: "rgba(26,58,92,0.02)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }} className="map-container">
             <svg viewBox="0 0 800 350" style={{ width: "90%", height: "auto" }}>
               {/* Sumatra */}
               <path d="M50,150 L150,50 L250,150 L220,180 L180,250 Z" fill="#1A3A5C" fillOpacity="0.85" stroke="white" strokeWidth="2" className="island-path">
                 <title>Sumatera: 12.430 UMKM · Indeks: Tinggi</title>
               </path>
               {/* Jawa */}
               <path d="M260,260 L450,260 L450,280 L260,280 Z" fill="#D4A017" fillOpacity="0.95" stroke="white" strokeWidth="2" className="island-path">
                 <title>Jawa: 45.210 UMKM · Indeks: Sangat Tinggi</title>
               </path>
               {/* Kalimantan */}
               <path d="M300,50 L450,50 L450,180 L300,180 Z" fill="#1A3A5C" fillOpacity="0.65" stroke="white" strokeWidth="2" className="island-path">
                 <title>Kalimantan: 8.120 UMKM · Indeks: Menengah</title>
               </path>
               {/* Sulawesi */}
               <path d="M480,80 L550,80 L550,220 L480,220 L510,150 Z" fill="#1A3A5C" fillOpacity="0.5" stroke="white" strokeWidth="2" className="island-path">
                 <title>Sulawesi: 9.650 UMKM · Indeks: Menengah</title>
               </path>
               {/* Papua */}
               <path d="M650,150 L780,150 L780,250 L650,250 Z" fill="#1A3A5C" fillOpacity="0.3" stroke="white" strokeWidth="2" className="island-path">
                 <title>Papua: 2.340 UMKM · Indeks: Tahap Awal</title>
               </path>
               {/* Dots for other islands */}
               <circle cx="500" cy="270" r="10" fill="#2E7D52" opacity="0.6" className="island-path"><title>Bali & Nusa Tenggara</title></circle>
               <circle cx="530" cy="275" r="8" fill="#2E7D52" opacity="0.5" className="island-path"><title>Maluku</title></circle>
               <circle cx="560" cy="280" r="12" fill="#2E7D52" opacity="0.7" className="island-path"><title>Papua Barat</title></circle>
             </svg>

             {/* Legend */}
             <div style={{ position: "absolute", bottom: 16, right: 16, background: "rgba(255,255,255,0.9)", padding: "10px", borderRadius: 8, border: "1px solid rgba(26,58,92,0.1)", fontSize: 11 }}>
               <div style={{ fontWeight: 700, marginBottom: 6, color: "#1A3A5C" }}>Indeks Kesiapan</div>
               <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                 <div style={{ width: 12, height: 12, background: "#D4A017" }} /> <span>Sangat Tinggi (Jawa)</span>
               </div>
               <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                 <div style={{ width: 12, height: 12, background: "#1A3A5C", opacity: 0.3 }} /> <span>Tahap Awal</span>
               </div>
             </div>
          </div>
          <style>{`
            .island-path { transition: all 0.3s ease; cursor: pointer; }
            .island-path:hover { transform: scale(1.02); fill-opacity: 1; filter: drop-shadow(0 4px 8px rgba(212,160,23,0.3)); }
          `}</style>
        </div>

        {/* Provinsi breakdown */}
        <div style={{ background: "white", borderRadius: 20, padding: "28px", boxShadow: "0 4px 20px rgba(26,58,92,0.07)", marginBottom: 28 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "#1A3A5C", marginBottom: 20 }}>📊 UMKM per Provinsi — Top 7</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {PROVINSI_DATA.map((p, i) => {
              const pct = Math.round((p.eligible / p.umkm) * 100);
              return (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "150px 1fr auto auto", gap: 16, alignItems: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1A3A5C" }}>{p.name}</div>
                  <div style={{ height: 8, background: "rgba(26,58,92,0.06)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(p.umkm / 8420) * 100}%`, background: "rgba(26,58,92,0.25)", borderRadius: 4 }} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1A3A5C", textAlign: "right" }}>{p.umkm.toLocaleString("id-ID")}</div>
                  <div style={{ fontSize: 12, color: "#2E7D52", fontWeight: 600, textAlign: "right", whiteSpace: "nowrap" }}>{pct}% layak</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* OJK/BI Integration section */}
        <div style={{ background: "linear-gradient(135deg, #1A3A5C, #0D2137)", borderRadius: 20, padding: "36px 32px", marginBottom: 28, color: "#F5F0E8" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, marginBottom: 8 }}>🏛️ Bagaimana Data Kami Membantu BI & OJK</h3>
          <p style={{ color: "rgba(245,240,232,0.65)", fontSize: 15, marginBottom: 28, maxWidth: 680 }}>
            Setiap penilaian ERS yang dilakukan UMKM menghasilkan data terstruktur yang dianonimkan dan dikirimkan ke ekosistem keuangan nasional untuk mendukung kebijakan pembiayaan ekspor.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
            {[
              { inst: "Bank Indonesia", manfaat: "Peta sebaran UMKM berorientasi ekspor per wilayah; data untuk kebijakan devisa & neraca perdagangan", icon: "🏦" },
              { inst: "OJK / SLIK", manfaat: "ERS ≥ 60 otomatis terflag sebagai Export-Ready Borrower — menggantikan agunan fisik untuk KUR Ekspor", icon: "🛡️" },
              { inst: "LPEI", manfaat: "Pipeline UMKM tervalidasi AI untuk Buyer's Credit & Asuransi Ekspor — tanpa proposal manual dari UMKM", icon: "🌐" },
              { inst: "Kemendag & BKPM", manfaat: "Dashboard komoditas unggulan & heatmap kapasitas nasional untuk perumusan kebijakan ekspor UMKM", icon: "⚖️" },
            ].map((item, i) => (
              <div key={i} style={{ padding: "20px", background: "rgba(255,255,255,0.07)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{item.inst}</div>
                <div style={{ fontSize: 13, color: "rgba(245,240,232,0.6)", lineHeight: 1.5 }}>{item.manfaat}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Partner logos */}
        <div style={{ background: "white", borderRadius: 20, padding: "32px", boxShadow: "0 4px 20px rgba(26,58,92,0.07)" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "#1A3A5C", marginBottom: 24, textAlign: "center" }}>🤝 Ekosistem Mitra Integrasi</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 }}>
            {PARTNER_LOGOS.map((p, i) => (
              <div key={i} style={{
                textAlign: "center", padding: "20px 12px", borderRadius: 14,
                background: "rgba(26,58,92,0.04)", border: "1px solid rgba(26,58,92,0.1)",
              }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>{p.logo}</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "#1A3A5C", marginBottom: 4 }}>{p.nama}</div>
                <div style={{ fontSize: 11, color: "#8899AA" }}>{p.peran}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <Link href="/assessment" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "linear-gradient(135deg, #D4A017, #F0C040)", color: "#1A3A5C",
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17,
            padding: "16px 40px", borderRadius: 14, textDecoration: "none",
            boxShadow: "0 6px 24px rgba(212,160,23,0.35)",
          }}>
            Bergabung & Dapatkan ERS Score Anda →
          </Link>
        </div>
      </div>
    </div>
  );
}
