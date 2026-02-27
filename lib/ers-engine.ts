// ERS (Export Readiness Score) Engine — Mock AI DSS

export interface ERSInput {
  legalitasScore: number;
  kualitasScore: number;
  kemasanScore: number;
  kapasitasScore: number;
  pasarScore: number;
  targetNegara: string;
  namaUsaha: string;
  namaProduk: string;
}

export interface ERSResult {
  ersTotal: number;
  tier: string;
  tierColor: string;
  tierBg: string;
  dimensionScores: Record<string, number>;
  priorityImprovements: string[];
  financingEligible: boolean;
  roadmap90Hari: RoadmapItem[];
  gapAnalysis: GapItem[];
}

export interface RoadmapItem {
  minggu: string;
  aksi: string;
  estimasiBiaya: string;
  prioritas: "HIGH" | "MEDIUM" | "LOW";
}

export interface GapItem {
  dimensi: string;
  temuan: string;
  rekomendasi: string;
  dampak: "TINGGI" | "SEDANG" | "RENDAH";
}

const WEIGHTS = {
  legalitas: 0.30,
  kualitas: 0.25,
  kemasan: 0.20,
  kapasitas: 0.15,
  pasar: 0.10,
};

const TIERS: Array<{ label: string; range: [number, number]; color: string; bg: string }> = [
  { label: "SIAP EKSPOR",       range: [80, 100], color: "#2E7D52", bg: "tier-siap"   },
  { label: "HAMPIR SIAP",       range: [60, 79],  color: "#D4A017", bg: "tier-hampir" },
  { label: "PERLU PERBAIKAN",   range: [40, 59],  color: "#E07B20", bg: "tier-perlu"  },
  { label: "BELUM SIAP",        range: [0,  39],  color: "#B5341A", bg: "tier-belum"  },
];

function computeRoadmap(scores: Record<string, number>): RoadmapItem[] {
  const items: RoadmapItem[] = [];

  if (scores.kemasan < 75) {
    items.push({ minggu: "1–2", aksi: "Revisi desain label kemasan — tambahkan elemen wajib negara tujuan (tanggal kadaluarsa, komposisi terjemahan)", estimasiBiaya: "Rp 500.000", prioritas: "HIGH" });
  }
  if (scores.legalitas < 80) {
    items.push({ minggu: "2–4", aksi: "Lengkapi dokumen legalitas: NIE/PIRT, Halal MUI, atau Merek Terdaftar yang belum ada", estimasiBiaya: "Rp 1.500.000", prioritas: "HIGH" });
  }
  if (scores.kualitas < 70) {
    items.push({ minggu: "3–5", aksi: "Uji laboratorium SNI/ISO di BBLK/BBPOM terdekat untuk sertifikasi kualitas", estimasiBiaya: "Rp 1.200.000", prioritas: "MEDIUM" });
  }
  if (scores.kapasitas < 70) {
    items.push({ minggu: "4–8", aksi: "Tingkatkan kapasitas produksi — pertimbangkan kerja sama koperasi atau konsorsium UMKM", estimasiBiaya: "Rp 5.000.000", prioritas: "MEDIUM" });
  }
  if (scores.pasar < 65) {
    items.push({ minggu: "6–9", aksi: "Ikuti pameran dagang internasional: Trade Expo Indonesia atau SIAL Interfood untuk network buyer", estimasiBiaya: "Rp 3.000.000", prioritas: "MEDIUM" });
  }
  items.push({ minggu: "8–12", aksi: "Daftarkan merek ke DJKI dan ajukan pembiayaan ekspor ke LPEI atau KUR Ekspor BRI/BNI/Mandiri", estimasiBiaya: "Rp 1.800.000", prioritas: "LOW" });

  return items;
}

function computeGaps(scores: Record<string, number>, negara: string): GapItem[] {
  const gaps: GapItem[] = [];
  const negaraLabel: Record<string, string> = {
    JP: "Jepang", US: "Amerika Serikat", DE: "Jerman", MY: "Malaysia", SA: "Arab Saudi", AU: "Australia", CN: "China", GB: "Inggris",
  };
  const nl = negaraLabel[negara] || negara;

  if (scores.kemasan < 75) gaps.push({ dimensi: "Kemasan", temuan: `Label kemasan belum memenuhi standar impor ${nl} — kemungkinan kurang elemen wajib seperti komposisi bahasa lokal`, rekomendasi: "Revisi label sesuai regulasi pelabelan negara tujuan; konsultasi dengan desainer kemasan ekspor", dampak: "TINGGI" });
  if (scores.legalitas < 80) gaps.push({ dimensi: "Legalitas", temuan: "Terdapat dokumen perizinan yang belum lengkap atau mendekati kadaluarsa", rekomendasi: "Segera perbarui nomor registrasi PIRT/NIE dan pastikan Halal MUI masih berlaku minimal 2 tahun", dampak: "TINGGI" });
  if (scores.kualitas < 70) gaps.push({ dimensi: "Kualitas", temuan: "Belum ada sertifikasi mutu internasional seperti ISO 22000 atau HACCP", rekomendasi: "Mulai dengan GMP (Good Manufacturing Practice) sebagai fondasi menuju HACCP", dampak: "SEDANG" });
  if (scores.kapasitas < 70) gaps.push({ dimensi: "Kapasitas", temuan: "Volume produksi bulanan di bawah minimum order kuantitas (MOQ) buyer internasional tipikal", rekomendasi: "Bentuk konsorsium dengan 2–3 UMKM sejenis untuk memenuhi MOQ bersama", dampak: "SEDANG" });
  if (scores.pasar < 65) gaps.push({ dimensi: "Potensi Pasar", temuan: `Produk belum terdaftar di platform e-commerce B2B internasional yang aktif di pasar ${nl}`, rekomendasi: "Daftarkan di Alibaba Global, Amazon Global Selling, dan portal ITPC negara tujuan", dampak: "RENDAH" });

  return gaps;
}

export function calculateERS(input: ERSInput): ERSResult {
  const scores = {
    legalitas:  Math.min(100, Math.max(0, input.legalitasScore)),
    kualitas:   Math.min(100, Math.max(0, input.kualitasScore)),
    kemasan:    Math.min(100, Math.max(0, input.kemasanScore)),
    kapasitas:  Math.min(100, Math.max(0, input.kapasitasScore)),
    pasar:      Math.min(100, Math.max(0, input.pasarScore)),
  };

  const ersTotal = Math.round(
    scores.legalitas  * WEIGHTS.legalitas +
    scores.kualitas   * WEIGHTS.kualitas  +
    scores.kemasan    * WEIGHTS.kemasan   +
    scores.kapasitas  * WEIGHTS.kapasitas +
    scores.pasar      * WEIGHTS.pasar
  );

  const tier = TIERS.find(t => ersTotal >= t.range[0] && ersTotal <= t.range[1]) || TIERS[3];

  const sorted = Object.entries(scores).sort((a, b) => a[1] - b[1]);
  const priorityImprovements = sorted.slice(0, 2).map(([k]) => k);

  return {
    ersTotal,
    tier: tier.label,
    tierColor: tier.color,
    tierBg: tier.bg,
    dimensionScores: scores,
    priorityImprovements,
    financingEligible: ersTotal >= 60,
    roadmap90Hari: computeRoadmap(scores),
    gapAnalysis: computeGaps(scores, input.targetNegara),
  };
}

export interface PackagingAnalysisResult {
  score: number;
  insights: { id: string; label: string; status: "success" | "warning" | "error"; detail: string }[];
}

export function mockAnalyzePackaging(files: File[], negara: string): Promise<PackagingAnalysisResult> {
  return new Promise(resolve => {
    setTimeout(() => {
      const score = files.length > 0 ? 55 + Math.floor(Math.random() * 30) : 30;
      
      const insights: PackagingAnalysisResult["insights"] = [
        { id: "material", label: "Material Kemasan", status: "success", detail: "Plastik food grade (PET/ALU) terdeteksi, aman untuk ekspor." },
        { id: "expiry", label: "Tanda Kedaluarsa", status: score > 70 ? "success" : "warning", detail: score > 70 ? "Tanggal kedaluarsa terbaca jelas." : "Logo kedaluarsa kecil, disarankan diperbesar." },
      ];

      if (negara === "JP") {
        insights.push({ id: "lang", label: "Standard Pelabelan (Jepang)", status: "error", detail: "Karakter Kanji/Katakana belum terdeteksi pada label komposisi." });
      } else {
        insights.push({ id: "lang", label: "Standard Pelabelan", status: "warning", detail: "Terjemahan bahasa Inggris sudah ada, namun perlu review grammar." });
      }

      insights.push({ id: "nutrition", label: "Informasi Nilai Gizi", status: "success", detail: "Tabel nutrisi standar FDA terdeteksi." });

      resolve({ score: Math.min(score, 100), insights });
    }, 2200);
  });
}

export function mockValidateDocument(jenis: string): Promise<{ valid: boolean; skor: number; pesan: string }> {
  return new Promise(resolve => {
    setTimeout(() => {
      const validDocs: Record<string, { skor: number; pesan: string }> = {
        PIRT:  { skor: 85, pesan: "Nomor PIRT terverifikasi aktif di database Dinas Kesehatan" },
        NIE:   { skor: 92, pesan: "NIE BPOM valid dan terdaftar dalam sistem BPOM Online" },
        HALAL: { skor: 90, pesan: "Sertifikat Halal MUI aktif, berlaku s.d. 2027" },
        SNI:   { skor: 88, pesan: "SNI terdaftar dan produk lolos uji standar kualitas" },
        MEREK: { skor: 80, pesan: "Merek terdaftar di DJKI, status: TERDAFTAR" },
      };
      const result = validDocs[jenis] || { skor: 70, pesan: "Dokumen diterima dan diverifikasi secara manual" };
      resolve({ valid: true, skor: result.skor, pesan: result.pesan });
    }, 1500);
  });
}
