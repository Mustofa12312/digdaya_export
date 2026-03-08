"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import JourneyTracker from "@/components/JourneyTracker";
import FileUploadZone from "@/components/FileUploadZone";
import { PROVINSI_LIST, KATEGORI_PRODUK, BAHASA_DAERAH } from "@/lib/indonesia-regions";
import { getMarketOpportunities } from "@/lib/market-data";
import { analyzePackagingWithAIAction } from "@/app/actions/gemini";
import { supabase } from "@/lib/supabase";
import { useAssessmentStore } from "@/lib/store";
import { mockAnalyzePackaging } from "@/lib/ers-engine";
import { validateDocumentAction } from "@/app/actions/document";
import toast from "react-hot-toast";
import { Loader2, Mic, MicOff, FlaskConical, Volume2, VolumeX, CheckCircle, AlertTriangle, XCircle } from "lucide-react";



const MARKETS = getMarketOpportunities();

// ─── Demo data for quick fill ───────────────────────────────────────────────
const DEMO_PROFILE = {
  namaUsaha: "Kopi Gayo Bu Aminah",
  pemilikNama: "Siti Aminah Lubis",
  noTelepon: "081234567890",
  provinsi: "Aceh",
  kabupaten: "Aceh Tengah",
  bahasaDaerah: "id",
};
const DEMO_PRODUK = {
  namaProduk: "Kopi Arabika Gayo Premium Specialty",
  kategoriHS: "0901",
  kapasitasBulanan: "500",
  satuan: "kg",
};

const TRANSLATIONS: Record<string, Record<string, string>> = {
  id: {
    title: "Formulir Validasi UMKM",
    subtitle: "Isi langkah demi langkah — hanya 3–5 menit",
    next: "Lanjut",
    back: "Kembali",
    finish: "Hitung ERS Saya",
    profile: "Profil Usaha",
    product: "Data Produk",
    packaging: "Foto Kemasan",
    legality: "Dokumen Legalitas",
    market: "Pasar Tujuan",
    assistant_on: "Asisten Suara Aktif",
    assistant_off: "Aktifkan Panduan Suara",
  },
  jv: {
    title: "Formulir Validasi UMKM",
    subtitle: "Isian langkah demi langkah — namung 3–5 menit",
    next: "Lajeng",
    back: "Wangsul",
    finish: "Etang ERS Kulo",
    profile: "Profil Usaha",
    product: "Data Produk",
    packaging: "Foto Wadah",
    legality: "Layang Legalitas",
    market: "Negoro Tujuan",
    assistant_on: "Asisten Swanten Aktif",
    assistant_off: "Aktifke Panduan Swanten",
  },
  su: {
    title: "Formulir Validasi UMKM",
    subtitle: "Eusi hambalan demi hambalan — mung 3–5 menit",
    next: "Lajeng",
    back: "Wangsul",
    finish: "Itung ERS Abdi",
    profile: "Profil Usaha",
    product: "Data Produk",
    packaging: "Poto Bungkus",
    legality: "Dokumen Legalitas",
    market: "Nagara Tujuan",
    assistant_on: "Asisten Sora Aktif",
    assistant_off: "Aktifkeun Pitulung Sora",
  }
};

// Digdaya FormData sudah dihandle di Zustand (lib/store.ts)

function useVoiceAssistant() {
  const [enabled, setEnabled] = useState(false);

  const speak = useCallback((text: string) => {
    if (!enabled || typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID";
    utterance.rate = 1.1;
    window.speechSynthesis.speak(utterance);
  }, [enabled]);

  return { enabled, setEnabled, speak };
}

// ─── Voice Input Hook ────────────────────────────────────────────────────────
function useVoiceInput() {
  const [recording, setRecording] = useState<string | null>(null);
  const recognitionRef = useRef<unknown>(null);

  const start = useCallback((fieldId: string, onResult: (v: string) => void) => {
    if (typeof window === "undefined" || !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      toast.error("Browser Anda tidak mendukung input suara"); return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRec: new () => { lang: string; interimResults: boolean; maxAlternatives: number; onresult: ((e: any) => void) | null; onerror: (() => void) | null; onend: (() => void) | null; start(): void; stop(): void; } | undefined =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) return;
    const rec = new SpeechRec();
    if (!rec) return;
    rec.lang = "id-ID";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e: { results: { [x: number]: { [x: number]: { transcript: string } } } }) => { onResult(e.results[0][0].transcript); setRecording(null); };
    rec.onerror = () => { setRecording(null); toast.error("Gagal menangkap suara"); };
    rec.onend = () => setRecording(null);
    rec.start();
    recognitionRef.current = rec;
    setRecording(fieldId);
    toast.success("Mulai bicara…", { icon: "🎤", duration: 2000 });
  }, []);

  const stop = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (recognitionRef.current as any)?.stop();
    setRecording(null);
  }, []);

  return { recording, start, stop };
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function VoiceInput({ id, label, value, onChange, placeholder }: { id: string; label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  const { start, stop, recording } = useVoiceInput();
  const isRec = recording === id;

  return (
    <div className="flex flex-col gap-2">
      <label style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>{label}</label>
      <div style={{
        position: "relative", display: "flex", alignItems: "center",
        background: "white",
        border: isRec ? "1.5px solid #D4A017" : "1.5px solid #E5E7EB",
        borderRadius: 12,
        overflow: "hidden",
        transition: "all 0.2s",
        boxShadow: isRec ? "0 0 0 3px rgba(212,160,23,0.12)" : "none",
      }}>
        <input
          type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", padding: "13px 16px", fontSize: 15, color: "#111827" }}
        />
        <button
          type="button"
          onClick={() => isRec ? stop() : start(id, onChange)}
          style={{
            flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
            width: 40, height: 40, margin: "4px", borderRadius: 10, border: "none",
            background: isRec ? "#FEF2F2" : "#F3F4F6",
            color: isRec ? "#EF4444" : "#6B7280",
            cursor: "pointer", transition: "all 0.2s",
          }}
          title={isRec ? "Berhenti merekam" : "Input suara"}
        >
          {isRec ? <MicOff size={17} style={{ animation: "pulse 1s infinite" }} /> : <Mic size={17} />}
        </button>
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="flex flex-col gap-2">
      <label style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>{label}</label>
      <div style={{ position: "relative" }}>
        <select
          value={value} onChange={e => onChange(e.target.value)}
          style={{
            width: "100%", appearance: "none", background: "white",
            padding: "13px 44px 13px 16px", border: "1.5px solid #E5E7EB", borderRadius: 12,
            fontSize: 15, color: value ? "#111827" : "#9CA3AF", outline: "none", cursor: "pointer",
          }}
        >
          <option value="">— Pilih —</option>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#9CA3AF" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </div>
    </div>
  );
}

function DemoBanner({ onFill }: { onFill: () => void }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 16,
      background: "#FFFBEB", border: "1.5px solid #FDE68A",
      borderRadius: 16, padding: "14px 16px", marginBottom: 24,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: "50%", background: "#FEF3C7",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#D97706",
      }}>
        <FlaskConical size={20} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: "#1A3A5C" }}>Mode Demo Tersedia</div>
        <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>Isi otomatis dengan data contoh UMKM kopi untuk presentasi cepat</div>
      </div>
      <button
        onClick={onFill}
        style={{
          flexShrink: 0, padding: "10px 20px",
          background: "linear-gradient(135deg, #D4A017, #F5C842)",
          border: "none", borderRadius: 12, cursor: "pointer",
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13,
          color: "#1A3A5C", whiteSpace: "nowrap",
          boxShadow: "0 2px 12px rgba(212,160,23,0.3)",
        }}
      >
        ⚡ Isi Demo Data
      </button>
    </div>
  );
}

// ─── AI Vision Overlay ──────────────────────────────────────────────────────
function ScanningOverlay() {
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 10,
      background: "rgba(26,58,92,0.4)", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      borderRadius: 14, overflow: "hidden", backdropFilter: "blur(2px)"
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: "linear-gradient(90deg, transparent, #F0C040, transparent)",
        boxShadow: "0 0 15px #F0C040",
        animation: "scanLine 2.5s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "repeating-linear-gradient(0deg, rgba(212,160,23,0.05) 0px, transparent 1px, transparent 20px)",
        backgroundSize: "100% 20px"
      }} />
      <Loader2 size={40} color="#F0C040" style={{ animation: "spin 1s linear infinite", marginBottom: 12 }} />
      <div style={{ color: "white", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, letterSpacing: "0.1em" }}>ANALYZING DESIGN...</div>
      <style>{`
        @keyframes scanLine {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function AssessmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const storeForm = useAssessmentStore((state) => state.form);
  const updateStoreForm = useAssessmentStore((state) => state.updateForm);
  const [kemasanFiles, setKemasanFiles] = useState<File[]>([]);
  const [dokumenFiles, setDokumenFiles] = useState<File[]>([]);
  
  const form = { ...storeForm, kemasanFiles, dokumenFiles };
  const [analyzing, setAnalyzing] = useState(false);
  const [validating, setValidating] = useState(false);
  const [demoSkipped, setDemoSkipped] = useState(false);
  const { enabled: assistantActive, setEnabled: setAssistantActive, speak } = useVoiceAssistant();

  useEffect(() => {
    const messages: Record<number, string> = {
      1: "Langkah pertama: Lengkapi profil usaha Anda.",
      2: "Langkah kedua: Masukkan data produk yang akan diekspor.",
      3: "Sekarang, upload foto kemasan Anda untuk dianalisis oleh AI.",
      4: "Hampir selesai! Upload dokumen legalitas untuk verifikasi.",
      5: "Terakhir, pilih negara tujuan ekspor Anda.",
    };
    if (assistantActive) {
      speak(messages[step] || "");
    }
  }, [step, assistantActive, speak]);

  const toggleAssistant = () => {
    const newState = !assistantActive;
    setAssistantActive(newState);
    if (newState) {
      toast.success("Asisten suara diaktifkan");
      speak("Halo! Saya Digdaya Asisten Suara. Saya akan memandu Anda mengisi formulir ini.");
    } else {
      toast("Asisten suara dimatikan");
    }
  };

  const update = (key: string, val: any) => {
    if (key === "kemasanFiles") setKemasanFiles(val);
    else if (key === "dokumenFiles") setDokumenFiles(val);
    else updateStoreForm({ [key]: val });
  };

  const fillDemoProfile = () => {
    updateStoreForm(DEMO_PROFILE);
    toast.success("Data profil demo diisi otomatis!");
  };

  const fillDemoProduk = () => {
    updateStoreForm(DEMO_PRODUK);
    toast.success("Data produk demo diisi otomatis!");
  };

  const skipWithMockScoreKemasan = () => {
    update("kemasanScore", 72);
    setDemoSkipped(true);
    toast.success("Demo: Skor kemasan 72/100 di-simulasikan ✓");
  };

  const skipWithMockScoreDokumen = () => {
    update("dokumenScore", 88);
    update("dokumenPesan", "PIRT No. 206/3374/2025 — terverifikasi aktif di database Dinas Kesehatan Jawa Tengah [DEMO]");
    setDemoSkipped(true);
    toast.success("Demo: Dokumen terverifikasi (skor 88/100) ✓");
  };

  const canNext: Record<number, boolean> = {
    1: !!(form.namaUsaha && form.pemilikNama && form.noTelepon && form.provinsi),
    2: !!(form.namaProduk && form.kategoriHS && form.kapasitasBulanan),
    3: form.kemasanScore !== null,
    4: form.dokumenScore !== null,
    5: !!form.targetNegara,
  };

  const handleAnalyzePackaging = async () => {
    setAnalyzing(true);
    try {
      let result;
      // If user uploaded a file and we have an API key, use REAL AI
      if (form.kemasanFiles.length > 0 && process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY) {
        const formData = new FormData();
        formData.append("file", form.kemasanFiles[0]);
        formData.append("targetCountry", form.targetNegara);
        result = await analyzePackagingWithAIAction(formData);
      } else {
        // Fallback to mock for demo/no-key
        result = await mockAnalyzePackaging(form.kemasanFiles.length > 0 ? form.kemasanFiles : [new File([], "demo.jpg")], form.targetNegara);
      }
      
      update("kemasanScore", result.score);
      update("kemasanInsights", result.insights);
      toast.success(`Analisis AI Selesai! Skor: ${result.score}/100`);
      if (assistantActive) speak(`Analisis selesai. Skor kemasan Anda adalah ${result.score}.`);
    } catch (err) {
      console.error(err);
      toast.error("Gagal melakukan analisis AI. Menggunakan mode simulasi.");
      const fallback = await mockAnalyzePackaging([new File([], "demo.jpg")], form.targetNegara);
      update("kemasanScore", fallback.score);
      update("kemasanInsights", fallback.insights);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleValidateDoc = async () => {
    setValidating(true);
    try {
      const file = form.dokumenFiles[0] || new File([], "demo.pdf");
      const result = await validateDocumentAction(form.dokumenJenis, file);
      update("dokumenScore", result.skor);
      update("dokumenPesan", result.pesan);
      toast.success("Dokumen terverifikasi secara aman melalui Server!");
    } catch (error) {
      toast.error("Gagal memverifikasi dokumen");
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = async () => {
    const kapasitasScore = Math.min(95, Math.max(35, (parseInt(form.kapasitasBulanan) / 5) + 30));
    const pasarScore = MARKETS.find(m => m.kode === form.targetNegara)?.peluangScore ?? 70;

    // Save to Supabase (Background)
    try {
      await supabase.from('assessments').insert([{
        nama_usaha: form.namaUsaha,
        pemilik: form.pemilikNama,
        produk: form.namaProduk,
        skor_total: form.kemasanScore, // Focus on core score for demo
        target_negara: form.targetNegara,
        ai_insights: form.kemasanInsights,
        created_at: new Date().toISOString()
      }]);
      console.log("Assessment successfully synced to Supabase");
    } catch (err) {
      console.warn("Database sync failed, but proceeding locally:", err);
    }

    const params = new URLSearchParams({
      namaUsaha: form.namaUsaha,
      namaProduk: form.namaProduk,
      targetNegara: form.targetNegara,
      legalitas: String(form.dokumenScore ?? 70),
      kualitas: "72",
      kemasan: String(form.kemasanScore ?? 65),
      kapasitas: String(Math.min(100, Math.round(kapasitasScore))),
      pasar: String(pasarScore),
    });
    // Persist to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("digdaya_last_assessment", params.toString());
      localStorage.setItem("digdaya_last_update", new Date().toISOString());
    }
    router.push(`/dashboard?${params.toString()}`);
  };

  const CARD_STYLE = {
    width: "100%", maxWidth: 820,
    background: "white",
    borderRadius: 24,
    boxShadow: "0 8px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
    overflow: "hidden" as const,
    position: "relative" as const,
  };
  const STEP_STYLE = { padding: "32px 40px 28px" };

  const t = TRANSLATIONS[form.bahasaDaerah] || TRANSLATIONS.id;

  return (
    <div style={{ minHeight: "100vh", background: "#F3EDDF", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: 860, padding: "100px 20px 60px", display: "flex", flexDirection: "column", alignItems: "center" }}>

        {/* ── PAGE HEADER ── */}
        <div style={{ textAlign: "center", marginBottom: 28, width: "100%" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#D4A017", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 10 }}>PENILAIAN KESIAPAN EKSPOR</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 38, color: "#0D2137", margin: 0, lineHeight: 1.2 }}>{t.title}</h1>
          <p style={{ fontSize: 15, color: "#6B7280", marginTop: 10, marginBottom: 0 }}>{t.subtitle}</p>
        </div>

        {/* ── VOICE BUTTON ── */}
        <div style={{ marginBottom: 28 }}>
          <button
            onClick={toggleAssistant}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 24px", borderRadius: 999,
              border: assistantActive ? "1.5px solid #D4A017" : "1.5px solid #D1D5DB",
              background: assistantActive ? "#FFFBEB" : "white",
              color: assistantActive ? "#92400E" : "#374151",
              fontWeight: 600, fontSize: 14, cursor: "pointer",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              transition: "all 0.2s",
            }}
          >
            {assistantActive ? <Volume2 size={15} color="#D4A017" /> : <VolumeX size={15} color="#9CA3AF" />}
            {assistantActive ? t.assistant_on : t.assistant_off}
          </button>
        </div>

        {/* ── JOURNEY TRACKER ── */}
        <div style={{ width: "100%", marginBottom: 24 }}>
          <JourneyTracker currentStep={step} />
        </div>

        {/* ── FORM CARD ── */}
        <div style={CARD_STYLE}>
          {/* Progress bar */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "#F3F4F6", zIndex: 2 }}>
            <div style={{ height: "100%", width: `${(step / 5) * 100}%`, background: "linear-gradient(90deg, #D4A017, #F5C842)", borderRadius: 4, transition: "width 0.6s ease" }} />
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div style={STEP_STYLE}>
              <DemoBanner onFill={fillDemoProfile} />
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "#111827", display: "flex", alignItems: "center", gap: 12, margin: "0 0 8px 0" }}>
                <span>🏪</span> {t.profile}
              </h2>
              <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 24 }}>Isi informasi dasar usaha Anda untuk profil ERS.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <VoiceInput id="namaUsaha" label="Nama Usaha / Brand" value={form.namaUsaha} onChange={v => update("namaUsaha", v)} placeholder="Contoh: Kopi Gayo Bu Aminah" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <VoiceInput id="pemilikNama" label="Nama Pemilik" value={form.pemilikNama} onChange={v => update("pemilikNama", v)} placeholder="Nama lengkap" />
                  <VoiceInput id="noTelepon" label="No. WhatsApp" value={form.noTelepon} onChange={v => update("noTelepon", v)} placeholder="08xx-xxxx-xxxx" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <Select label="Provinsi" value={form.provinsi} onChange={v => update("provinsi", v)} options={PROVINSI_LIST.map(p => ({ value: p, label: p }))} />
                  <VoiceInput id="kabupaten" label="Kabupaten / Kota" value={form.kabupaten} onChange={v => update("kabupaten", v)} placeholder="Contoh: Aceh Tengah" />
                </div>
                <Select label="Bahasa Daerah Pilihan UI" value={form.bahasaDaerah} onChange={v => update("bahasaDaerah", v)} options={BAHASA_DAERAH.map(b => ({ value: b.kode, label: b.label }))} />
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div style={STEP_STYLE}>
              <DemoBanner onFill={fillDemoProduk} />
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "#111827", display: "flex", alignItems: "center", gap: 12, margin: "0 0 8px 0" }}>
                <span>📦</span> {t.product}
              </h2>
              <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 24 }}>Informasi produk yang akan Anda ekspor ke pasar internasional.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <VoiceInput id="namaProduk" label="Nama Produk" value={form.namaProduk} onChange={v => update("namaProduk", v)} placeholder="Contoh: Keripik Tempe Rempah Original" />
                <Select label="Kategori Produk (Kode HS)" value={form.kategoriHS} onChange={v => update("kategoriHS", v)} options={KATEGORI_PRODUK.map(k => ({ value: k.kode, label: `${k.kode} — ${k.label}` }))} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <VoiceInput id="kapasitas" label="Kapasitas / Bulan" value={form.kapasitasBulanan} onChange={v => update("kapasitasBulanan", v)} placeholder="Contoh: 500" />
                  <Select label="Satuan" value={form.satuan} onChange={v => update("satuan", v)} options={[{ value: "kg", label: "Kilogram (kg)" }, { value: "pcs", label: "Pieces (pcs)" }, { value: "liter", label: "Liter" }, { value: "lusin", label: "Lusin" }]} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div style={STEP_STYLE}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "#111827", display: "flex", alignItems: "center", gap: 12, margin: "0 0 8px 0" }}>
                <span>🖼️</span> {t.packaging}
              </h2>
              <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 24 }}>Upload foto kemasan depan dan belakang, atau gunakan Demo Mode untuk simulasi instan.</p>
              {form.kemasanScore === null && <DemoBanner onFill={skipWithMockScoreKemasan} />}
              <div style={{ position: "relative" }}>
                <FileUploadZone
                  onFiles={files => { update("kemasanFiles", files); if (files.length === 0) update("kemasanScore", null); }}
                  accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp"] }}
                  maxFiles={4}
                  label="Upload Foto Kemasan"
                  hint="Seret & lepas foto kemasan di sini, atau klik untuk pilih"
                />
                {analyzing && <ScanningOverlay />}
              </div>
              {form.kemasanFiles.length > 0 && form.kemasanScore === null && (
                <button onClick={handleAnalyzePackaging} disabled={analyzing} style={{ marginTop: 16, width: "100%", padding: "13px", borderRadius: 12, border: "none", cursor: analyzing ? "wait" : "pointer", background: "linear-gradient(135deg, #1A3A5C, #2E6AA0)", color: "white", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  {analyzing ? <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Menganalisis...</> : "🤖 Analisis Kemasan dengan AI"}
                </button>
              )}
              {form.kemasanScore !== null && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ padding: "18px 22px", borderRadius: 12, background: form.kemasanScore >= 70 ? "rgba(46,125,82,0.08)" : "rgba(224,123,32,0.08)", border: `1.5px solid ${form.kemasanScore >= 70 ? "rgba(46,125,82,0.3)" : "rgba(224,123,32,0.3)"}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 38, color: form.kemasanScore >= 70 ? "#2E7D52" : "#E07B20" }}>{form.kemasanScore}</div>
                      <div>
                        <div style={{ fontWeight: 700, color: "#1A3A5C", fontSize: 15 }}>Skor Kemasan /100</div>
                        <div style={{ fontSize: 13, color: "#8899AA", marginTop: 2 }}>
                          {form.kemasanScore >= 80 ? "✅ Kemasan sudah baik" : form.kemasanScore >= 60 ? "⚠️ Perlu sedikit perbaikan label" : "❌ Kemasan perlu revisi"}
                          {demoSkipped && " (Demo)"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1A3A5C", marginLeft: 4 }}>Deksripsi Temuan AI:</div>
                    {form.kemasanInsights?.map(insight => (
                      <div key={insight.id} style={{ padding: "12px 14px", borderRadius: 10, background: "white", border: "1px solid rgba(26,58,92,0.08)", display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <div style={{ marginTop: 2 }}>
                          {insight.status === "success" && <CheckCircle size={16} color="#2E7D52" />}
                          {insight.status === "warning" && <AlertTriangle size={16} color="#D4A017" />}
                          {insight.status === "error" && <XCircle size={16} color="#B5341A" />}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#1A3A5C" }}>{insight.label}</div>
                          <div style={{ fontSize: 12, color: "#5A6878", marginTop: 2, lineHeight: 1.4 }}>{insight.detail}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div style={STEP_STYLE}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "#111827", display: "flex", alignItems: "center", gap: 12, margin: "0 0 8px 0" }}>
                <span>📋</span> {t.legality}
              </h2>
              <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 24 }}>Upload dokumen perizinan resmi atau gunakan Mode Demo untuk verifikasi instan.</p>
              {form.dokumenScore === null && <DemoBanner onFill={skipWithMockScoreDokumen} />}
              <Select label="Jenis Dokumen" value={form.dokumenJenis} onChange={v => { update("dokumenJenis", v); if (!demoSkipped) update("dokumenScore", null); }} options={[
                { value: "PIRT", label: "PIRT (Pangan Industri Rumah Tangga)" },
                { value: "NIE", label: "NIE BPOM" },
                { value: "HALAL", label: "Sertifikat Halal MUI" },
                { value: "SNI", label: "Sertifikat SNI" },
                { value: "MEREK", label: "Merek Terdaftar DJKI" },
              ]} />
              <div style={{ height: 16 }} />
              <FileUploadZone onFiles={files => update("dokumenFiles", files)} maxFiles={2} label={`Upload Dokumen ${form.dokumenJenis}`} hint="Foto atau scan PDF dokumen" />
              {form.dokumenFiles.length > 0 && form.dokumenScore === null && (
                <button onClick={handleValidateDoc} disabled={validating} style={{ marginTop: 16, width: "100%", padding: "13px", borderRadius: 12, border: "none", cursor: validating ? "wait" : "pointer", background: "linear-gradient(135deg, #1A3A5C, #2E6AA0)", color: "white", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  {validating ? <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Verifikasi...</> : "🔍 Verifikasi Dokumen (OCR + API)"}
                </button>
              )}
              {form.dokumenScore !== null && (
                <div style={{ marginTop: 16, padding: "18px 22px", borderRadius: 12, background: "rgba(46,125,82,0.08)", border: "1.5px solid rgba(46,125,82,0.3)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 38, color: "#2E7D52" }}>{form.dokumenScore}</div>
                    <div>
                      <div style={{ fontWeight: 700, color: "#1A3A5C", fontSize: 15 }}>Skor Legalitas /100</div>
                      <div style={{ fontSize: 13, color: "#2E7D52" }}>✅ Dokumen Valid{demoSkipped && " (Demo)"}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: "#5A7060", background: "rgba(46,125,82,0.07)", padding: "10px 14px", borderRadius: 8 }}>{form.dokumenPesan}</div>
                </div>
              )}
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <div style={STEP_STYLE}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "#111827", display: "flex", alignItems: "center", gap: 12, margin: "0 0 8px 0" }}>
                <span>🌏</span> {t.market}
              </h2>
              <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 24 }}>ERS Anda akan disesuaikan dengan regulasi negara yang dipilih.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(145px, 1fr))", gap: 12 }}>
                {MARKETS.map(m => (
                  <button key={m.kode} onClick={() => update("targetNegara", m.kode)} style={{ padding: "16px 12px", borderRadius: 12, cursor: "pointer", border: form.targetNegara === m.kode ? "2px solid #D4A017" : "1.5px solid #E5E7EB", background: form.targetNegara === m.kode ? "rgba(212,160,23,0.08)" : "white", transition: "all 0.2s", textAlign: "center", boxShadow: form.targetNegara === m.kode ? "0 4px 16px rgba(212,160,23,0.2)" : "0 1px 4px rgba(0,0,0,0.04)" }}>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>{m.bendera}</div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "#1A3A5C" }}>{m.negara}</div>
                    <div style={{ fontSize: 11, color: "#2E7D52", fontWeight: 600, marginTop: 2 }}>{m.demandGrowth}</div>
                  </button>
                ))}
              </div>
              {form.targetNegara && (() => {
                const m = MARKETS.find(x => x.kode === form.targetNegara);
                if (!m) return null;
                return (
                  <div style={{ marginTop: 20, padding: "18px 20px", borderRadius: 12, background: "rgba(26,58,92,0.04)", border: "1px solid rgba(26,58,92,0.12)" }}>
                    <div style={{ fontWeight: 700, color: "#1A3A5C", marginBottom: 8 }}>{m.bendera} {m.negara} — Persyaratan Utama</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {m.barrierUtama.map(b => <span key={b} style={{ background: "rgba(181,52,26,0.08)", color: "#B5341A", fontSize: 12, padding: "3px 10px", borderRadius: 100, fontWeight: 500 }}>{b}</span>)}
                    </div>
                    <div style={{ fontSize: 13, color: "#5A6878", marginTop: 10, fontStyle: "italic" }}>{m.highlight}</div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* ── NAVIGATION ── */}
        <div style={{ width: "100%", maxWidth: 820, marginTop: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {step > 1 ? (
            <button
              onClick={() => setStep(s => s - 1)}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 14, border: "1.5px solid #D1D5DB", background: "white", color: "#374151", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15, cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", transition: "all 0.2s" }}
            >
              ← {t.back}
            </button>
          ) : <div />}

          {step < 5 ? (
            <button
              onClick={() => { if (canNext[step]) setStep(s => s + 1); else toast.error("Lengkapi semua data sebelum melanjutkan"); }}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 36px", borderRadius: 14, border: "none", background: canNext[step] ? "linear-gradient(135deg, #D4A017, #F5C842)" : "#E5E7EB", color: canNext[step] ? "#1A3A5C" : "#9CA3AF", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, cursor: canNext[step] ? "pointer" : "not-allowed", boxShadow: canNext[step] ? "0 4px 18px rgba(212,160,23,0.4)" : "none", transition: "all 0.2s" }}
            >
              {t.next} →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 32px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #1A5C3A, #2E8B57)", color: "white", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 18px rgba(30,100,60,0.35)" }}
            >
              🚀 {t.finish}
            </button>
          )}
        </div>


      </div>
    </div>
  );
}
