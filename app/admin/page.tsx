"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  Globe, 
  Search, 
  LayoutDashboard, 
  FileText, 
  MoreVertical,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

interface AssessmentData {
  id: string;
  nama_usaha: string;
  pemilik: string;
  produk: string;
  skor_total: number;
  target_negara: string;
  created_at: string;
}

export default function AdminPage() {
  const [data, setData] = useState<AssessmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    setLoading(true);
    const { data: assessments, error } = await supabase
      .from('assessments')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching data:", error);
    } else {
      setData(assessments || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter(item => 
    item.nama_usaha?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.produk?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.pemilik?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: data.length,
    avgScore: data.length ? Math.round(data.reduce((acc, curr) => acc + (curr.skor_total || 0), 0) / data.length) : 0,
    ready: data.filter(item => (item.skor_total || 0) >= 80).length,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC" }}>
      <Navbar />
      
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "120px 24px 60px" }}>
        {/* Header Admin */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#D4A017", fontWeight: 700, fontSize: 13, marginBottom: 8, letterSpacing: "0.1em" }}>
              <ShieldCheck size={18} /> ADMIN CONSOLE
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 32, color: "#1A3A5C" }}>Monitoring UMKM Siap Ekspor</h1>
          </div>
          <button onClick={fetchData} style={{
            padding: "10px 20px", borderRadius: 10, border: "1px solid rgba(26,58,92,0.1)",
            background: "white", color: "#1A3A5C", fontWeight: 600, fontSize: 13, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8
          }}>
            Refresh Data
          </button>
        </div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginBottom: 40 }}>
          <StatCard icon={<Users color="#1A3A5C" />} label="Total UMKM Terdaftar" value={stats.total} color="#1A3A5C" />
          <StatCard icon={<TrendingUp color="#2E7D52" />} label="Rata-rata Skor ERS" value={`${stats.avgScore}%`} color="#2E7D52" />
          <StatCard icon={<CheckCircle2 color="#D4A017" />} label="Siap Ekspor (ERS ≥ 80)" value={stats.ready} color="#D4A017" />
          <StatCard icon={<Globe color="#2E6AA0" />} label="Wilayah Tercover" value="28" color="#2E6AA0" />
        </div>

        {/* Main Content Area */}
        <div style={{ background: "white", borderRadius: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.03)", border: "1px solid rgba(26,58,92,0.06)", overflow: "hidden" }}>
          {/* Table Toolbar */}
          <div style={{ padding: "24px", borderBottom: "1px solid rgba(26,58,92,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ position: "relative", width: 400 }}>
              <Search style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#8899AA" }} size={18} />
              <input 
                type="text" 
                placeholder="Cari Nama Usaha, Pemilik, atau Produk..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%", padding: "12px 12px 12px 42px", borderRadius: 12, border: "1.5px solid rgba(26,58,92,0.1)",
                  fontSize: 14, outline: "none", transition: "border-color 0.2s"
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <select style={{ padding: "10px 16px", borderRadius: 10, border: "1.5px solid rgba(26,58,92,0.1)", color: "#1A3A5C", fontSize: 13, fontWeight: 600 }}>
                <option>Semua Kategori</option>
                <option>Siap Ekspor</option>
                <option>Perlu Perbaikan</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(26,58,92,0.02)", textAlign: "left" }}>
                <th style={thStyle}>TANGGAL</th>
                <th style={thStyle}>UMKM / PEMILIK</th>
                <th style={thStyle}>PRODUK</th>
                <th style={thStyle}>TARGET</th>
                <th style={thStyle}>SKOR ERS</th>
                <th style={thStyle}>STATUS</th>
                <th style={thStyle}></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ padding: 60, textAlign: "center", color: "#8899AA" }}>Memuat database UMKM...</td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: 60, textAlign: "center", color: "#8899AA" }}>Belum ada data penilaian masuk.</td></tr>
              ) : filteredData.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid rgba(26,58,92,0.05)", transition: "background 0.2s" }} className="table-row-hover">
                  <td style={tdStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#8899AA", fontSize: 13 }}>
                      <Calendar size={14} />
                      {new Date(item.created_at).toLocaleDateString("id-ID", { day: '2-digit', month: 'short' })}
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 700, color: "#1A3A5C" }}>{item.nama_usaha}</div>
                    <div style={{ fontSize: 12, color: "#8899AA" }}>{item.pemilik}</div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ padding: "4px 10px", borderRadius: 6, background: "rgba(212,160,23,0.08)", color: "#D4A017", fontSize: 12, fontWeight: 700, display: "inline-block" }}>
                      {item.produk}
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ fontSize: 13, color: "#1A3A5C", display: "flex", alignItems: "center", gap: 6 }}>
                      <Globe size={14} /> {item.target_negara}
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 800, fontSize: 16, color: (item.skor_total || 0) >= 80 ? "#2E7D52" : (item.skor_total || 0) >= 60 ? "#D4A017" : "#B5341A" }}>
                      {item.skor_total || 0}
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <span style={{
                      padding: "4px 12px", borderRadius: 100, fontSize: 11, fontWeight: 700,
                      background: (item.skor_total || 0) >= 80 ? "rgba(46,125,82,0.1)" : (item.skor_total || 0) >= 60 ? "rgba(212,160,23,0.1)" : "rgba(181,52,26,0.1)",
                      color: (item.skor_total || 0) >= 80 ? "#2E7D52" : (item.skor_total || 0) >= 60 ? "#D4A017" : "#B5341A",
                    }}>
                      {(item.skor_total || 0) >= 80 ? "SIAP EKSPOR" : (item.skor_total || 0) >= 60 ? "READY TO UPGRADE" : "TAHAP AWAL"}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <button style={{ background: "none", border: "none", color: "#8899AA", cursor: "pointer" }}><MoreVertical size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .table-row-hover:hover { background: rgba(26,58,92,0.01); }
        th { font-family: var(--font-display); }
      `}</style>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string | number, color: string }) {
  return (
    <div style={{ background: "white", padding: "24px", borderRadius: 20, boxShadow: "0 4px 15px rgba(0,0,0,0.02)", border: "1px solid rgba(26,58,92,0.05)" }}>
      <div style={{ width: 42, height: 42, borderRadius: 12, background: `${color}10`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
        {icon}
      </div>
      <div style={{ fontSize: 13, color: "#8899AA", fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: "#1A3A5C", marginTop: 4 }}>{value}</div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: "16px 24px",
  fontSize: 11,
  fontWeight: 700,
  color: "#8899AA",
  letterSpacing: "0.1em"
};

const tdStyle: React.CSSProperties = {
  padding: "18px 24px",
  fontSize: 14
};
