"use client";

import { Suspense, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2, Mail, User, Lock, CheckCircle } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPwd, setShowLoginPwd] = useState(false);

  // Register fields
  const [regEmail, setRegEmail] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [showRegPwd, setShowRegPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const redirectUrl = searchParams.get("redirect") || "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error("Harap isi email dan kata sandi.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      if (error) throw error;
      toast.success("Login berhasil! Selamat datang kembali 👋");
      router.push(redirectUrl);
    } catch (err: any) {
      toast.error(err.message || "Email atau kata sandi salah.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail || !regUsername || !regPassword || !regConfirm) {
      toast.error("Harap lengkapi semua kolom.");
      return;
    }
    if (regPassword.length < 8) {
      toast.error("Kata sandi minimal 8 karakter.");
      return;
    }
    if (regPassword !== regConfirm) {
      toast.error("Konfirmasi kata sandi tidak cocok!");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: regEmail,
        password: regPassword,
        options: { data: { username: regUsername } },
      });
      if (error) throw error;
      
      // Cek apakah session langsung dibuat (email confirmation dinonaktifkan)
      if (data.session) {
        toast.success("Akun berhasil dibuat! Selamat bergabung 🎉");
        router.push(redirectUrl);
      } else {
        // Email confirmation diperlukan
        toast.success("Akun berhasil dibuat! Periksa kotak masuk email Anda untuk konfirmasi.", { duration: 6000, icon: "📧" });
        setRegisterSuccess(true);
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal membuat akun.");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = (pwd: string) => {
    if (pwd.length === 0) return null;
    if (pwd.length < 6) return { label: "Lemah", color: "#B5341A", width: "33%" };
    if (pwd.length < 10) return { label: "Sedang", color: "#D4A017", width: "66%" };
    return { label: "Kuat", color: "#2E7D52", width: "100%" };
  };
  const strength = passwordStrength(regPassword);

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "var(--krem-linen, #F5F0E8)", paddingTop: 72, paddingBottom: 40 }}
    >
      {/* Background dekorasi */}
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: "45vw", maxWidth: 520, height: "45vw", maxHeight: 520,
        background: "radial-gradient(circle at top right, rgba(212,160,23,0.15), transparent 70%)",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0,
        width: "40vw", maxWidth: 480, height: "40vw", maxHeight: 480,
        background: "radial-gradient(circle at bottom left, rgba(26,58,92,0.1), transparent 70%)",
        pointerEvents: "none"
      }} />

      <div style={{
        width: "100%", maxWidth: 460,
        margin: "0 auto", padding: "0 20px",
        position: "relative", zIndex: 10,
      }}>
        {/* Card */}
        <div style={{
          background: "white",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(26,58,92,0.14)",
          border: "1px solid rgba(212,160,23,0.18)",
        }}>
          {/* Header Banner */}
          <div style={{
            background: "linear-gradient(135deg, #1A3A5C 0%, #0D2137 100%)",
            padding: "36px 36px 28px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Batik pattern hint */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(212,160,23,0.08) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
            
            {/* Logo */}
            <div style={{
              width: 54, height: 54,
              background: "linear-gradient(135deg, #D4A017, #F0C040)",
              borderRadius: 14,
              margin: "0 auto 16px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-display, sans-serif)", fontWeight: 800, fontSize: 24, color: "#1A3A5C",
              boxShadow: "0 6px 20px rgba(212,160,23,0.35)",
              position: "relative",
            }}>
              D
            </div>
            <div style={{ fontFamily: "var(--font-display, sans-serif)", fontWeight: 800, fontSize: 22, color: "#F5F0E8", marginBottom: 6 }}>
              {mode === "login" ? "Masuk ke DIGDAYA" : "Buat Akun DIGDAYA"}
            </div>
            <div style={{ fontSize: 13.5, color: "rgba(245,240,232,0.65)", lineHeight: 1.5 }}>
              {mode === "login"
                ? "Selamat datang kembali! Masuk untuk melanjutkan validasi ekspor Anda."
                : "Bergabunglah bersama ribuan UMKM yang siap menembus pasar global."}
            </div>
          </div>

          {/* Tab Toggle */}
          <div style={{ display: "flex", padding: "16px 20px 0", gap: 8 }}>
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  flex: 1, padding: "10px 0",
                  borderRadius: 10,
                  border: "none",
                  fontFamily: "var(--font-display, sans-serif)",
                  fontWeight: 700, fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background: mode === m ? "#1A3A5C" : "rgba(26,58,92,0.06)",
                  color: mode === m ? "white" : "#5A6878",
                  boxShadow: mode === m ? "0 4px 12px rgba(26,58,92,0.2)" : "none",
                }}
              >
                {m === "login" ? "Masuk" : "Daftar"}
              </button>
            ))}
          </div>

          {/* Form Area */}
          <div style={{ padding: "24px 28px 28px" }}>
            {/* ──────────── LOGIN FORM ──────────── */}
            {mode === "login" && (
              <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Email */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#1A3A5C", letterSpacing: "0.07em", fontFamily: "var(--font-display, sans-serif)", textTransform: "uppercase" }}>
                    Alamat E-mail
                  </label>
                  <div style={{ position: "relative" }}>
                    <Mail size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#8899AA" }} />
                    <input
                      type="email" value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="contoh@email.com"
                      style={{
                        width: "100%", padding: "13px 14px 13px 40px",
                        borderRadius: 12, fontSize: 14, border: "1.5px solid rgba(26,58,92,0.15)",
                        background: "#F8FAFC", color: "#1A3A5C", outline: "none",
                        fontFamily: "inherit", boxSizing: "border-box",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={e => e.target.style.borderColor = "#D4A017"}
                      onBlur={e => e.target.style.borderColor = "rgba(26,58,92,0.15)"}
                    />
                  </div>
                </div>

                {/* Password */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#1A3A5C", letterSpacing: "0.07em", fontFamily: "var(--font-display, sans-serif)", textTransform: "uppercase" }}>
                    Kata Sandi
                  </label>
                  <div style={{ position: "relative" }}>
                    <Lock size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#8899AA" }} />
                    <input
                      type={showLoginPwd ? "text" : "password"} value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{
                        width: "100%", padding: "13px 44px 13px 40px",
                        borderRadius: 12, fontSize: 14, border: "1.5px solid rgba(26,58,92,0.15)",
                        background: "#F8FAFC", color: "#1A3A5C", outline: "none",
                        fontFamily: "inherit", boxSizing: "border-box",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={e => e.target.style.borderColor = "#D4A017"}
                      onBlur={e => e.target.style.borderColor = "rgba(26,58,92,0.15)"}
                    />
                    <button type="button" onClick={() => setShowLoginPwd(!showLoginPwd)}
                      style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#8899AA", cursor: "pointer", padding: 0 }}>
                      {showLoginPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  style={{
                    marginTop: 4, width: "100%", padding: "14px",
                    borderRadius: 12, border: "none",
                    background: loading ? "rgba(26,58,92,0.5)" : "linear-gradient(135deg, #1A3A5C, #2E6AA0)",
                    color: "white", fontFamily: "var(--font-display, sans-serif)",
                    fontWeight: 700, fontSize: 15.5, cursor: loading ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    boxShadow: "0 4px 16px rgba(26,58,92,0.25)",
                    transition: "all 0.2s",
                  }}>
                  {loading ? <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Memproses...</> : "Masuk ke Akun"}
                </button>

                <div style={{ textAlign: "center", fontSize: 13.5, color: "#8899AA", marginTop: 4 }}>
                  Belum punya akun?{" "}
                  <button type="button" onClick={() => setMode("register")}
                    style={{ background: "none", border: "none", color: "#D4A017", fontWeight: 700, cursor: "pointer", fontSize: 13.5, fontFamily: "var(--font-display)" }}>
                    Daftar sekarang
                  </button>
                </div>
              </form>
            )}

            {/* ──────────── REGISTER FORM ──────────── */}
            {mode === "register" && (
              <>
                {registerSuccess ? (
                  /* Layar Sukses Register */
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(46,125,82,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                      <CheckCircle size={32} color="#2E7D52" />
                    </div>
                    <div style={{ fontFamily: "var(--font-display, sans-serif)", fontWeight: 700, fontSize: 20, color: "#1A3A5C", marginBottom: 10 }}>Akun Berhasil Dibuat! 🎉</div>
                    <p style={{ fontSize: 14, color: "#5A6878", lineHeight: 1.6, marginBottom: 24 }}>
                      Kami mengirimkan email konfirmasi ke <strong style={{ color: "#1A3A5C" }}>{regEmail}</strong>. Silakan cek kotak masuk dan klik link konfirmasi, lalu kembali untuk login.
                    </p>
                    <button onClick={() => { setRegisterSuccess(false); setMode("login"); }}
                      style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #1A3A5C, #2E6AA0)", color: "white", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
                      Lanjut ke Halaman Masuk
                    </button>
                  </div>
                ) : (
              <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {/* E-mail */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#1A3A5C", letterSpacing: "0.07em", fontFamily: "var(--font-display, sans-serif)", textTransform: "uppercase" }}>
                    E-mail
                  </label>
                  <div style={{ position: "relative" }}>
                    <Mail size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#8899AA" }} />
                    <input
                      type="email" value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="email@perusahaan.com"
                      style={{
                        width: "100%", padding: "12px 14px 12px 40px",
                        borderRadius: 12, fontSize: 14, border: "1.5px solid rgba(26,58,92,0.15)",
                        background: "#F8FAFC", color: "#1A3A5C", outline: "none",
                        fontFamily: "inherit", boxSizing: "border-box", transition: "border-color 0.2s",
                      }}
                      onFocus={e => e.target.style.borderColor = "#D4A017"}
                      onBlur={e => e.target.style.borderColor = "rgba(26,58,92,0.15)"}
                    />
                  </div>
                </div>

                {/* Username */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#1A3A5C", letterSpacing: "0.07em", fontFamily: "var(--font-display, sans-serif)", textTransform: "uppercase" }}>
                    Username / Nama UMKM
                  </label>
                  <div style={{ position: "relative" }}>
                    <User size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#8899AA" }} />
                    <input
                      type="text" value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="kopiGayo_BuAminah"
                      style={{
                        width: "100%", padding: "12px 14px 12px 40px",
                        borderRadius: 12, fontSize: 14, border: "1.5px solid rgba(26,58,92,0.15)",
                        background: "#F8FAFC", color: "#1A3A5C", outline: "none",
                        fontFamily: "inherit", boxSizing: "border-box", transition: "border-color 0.2s",
                      }}
                      onFocus={e => e.target.style.borderColor = "#D4A017"}
                      onBlur={e => e.target.style.borderColor = "rgba(26,58,92,0.15)"}
                    />
                  </div>
                </div>

                {/* Password */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#1A3A5C", letterSpacing: "0.07em", fontFamily: "var(--font-display, sans-serif)", textTransform: "uppercase" }}>
                    Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <Lock size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#8899AA" }} />
                    <input
                      type={showRegPwd ? "text" : "password"} value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min. 8 karakter"
                      style={{
                        width: "100%", padding: "12px 44px 12px 40px",
                        borderRadius: 12, fontSize: 14, border: "1.5px solid rgba(26,58,92,0.15)",
                        background: "#F8FAFC", color: "#1A3A5C", outline: "none",
                        fontFamily: "inherit", boxSizing: "border-box", transition: "border-color 0.2s",
                      }}
                      onFocus={e => e.target.style.borderColor = "#D4A017"}
                      onBlur={e => e.target.style.borderColor = "rgba(26,58,92,0.15)"}
                    />
                    <button type="button" onClick={() => setShowRegPwd(!showRegPwd)}
                      style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#8899AA", cursor: "pointer", padding: 0 }}>
                      {showRegPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {/* Strength Indicator */}
                  {strength && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                      <div style={{ flex: 1, height: 4, background: "rgba(26,58,92,0.1)", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: strength.width, background: strength.color, borderRadius: 2, transition: "width 0.3s, background 0.3s" }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: strength.color, minWidth: 40 }}>{strength.label}</span>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#1A3A5C", letterSpacing: "0.07em", fontFamily: "var(--font-display, sans-serif)", textTransform: "uppercase" }}>
                    Confirm Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <Lock size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#8899AA" }} />
                    <input
                      type={showConfirmPwd ? "text" : "password"} value={regConfirm}
                      onChange={(e) => setRegConfirm(e.target.value)}
                      placeholder="Ulangi password"
                      style={{
                        width: "100%", padding: "12px 44px 12px 40px",
                        borderRadius: 12, fontSize: 14,
                        border: `1.5px solid ${regConfirm && regConfirm !== regPassword ? "#B5341A" : regConfirm && regConfirm === regPassword ? "#2E7D52" : "rgba(26,58,92,0.15)"}`,
                        background: "#F8FAFC", color: "#1A3A5C", outline: "none",
                        fontFamily: "inherit", boxSizing: "border-box", transition: "border-color 0.2s",
                      }}
                    />
                    <button type="button" onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                      style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#8899AA", cursor: "pointer", padding: 0 }}>
                      {showConfirmPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    {regConfirm && regConfirm === regPassword && (
                      <CheckCircle size={16} style={{ position: "absolute", right: 40, top: "50%", transform: "translateY(-50%)", color: "#2E7D52" }} />
                    )}
                  </div>
                  {regConfirm && regConfirm !== regPassword && (
                    <span style={{ fontSize: 12, color: "#B5341A", marginTop: 2 }}>⚠️ Kata sandi tidak cocok</span>
                  )}
                </div>

                <button type="submit" disabled={loading}
                  style={{
                    marginTop: 6, width: "100%", padding: "14px",
                    borderRadius: 12, border: "none",
                    background: loading ? "rgba(46,125,82,0.5)" : "linear-gradient(135deg, #2E7D52, #3FA86E)",
                    color: "white", fontFamily: "var(--font-display, sans-serif)",
                    fontWeight: 700, fontSize: 15.5, cursor: loading ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    boxShadow: "0 4px 16px rgba(46,125,82,0.25)",
                    transition: "all 0.2s",
                  }}>
                  {loading ? <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Mendaftarkan...</> : "🚀 Daftar Sekarang"}
                </button>

                <div style={{ textAlign: "center", fontSize: 13.5, color: "#8899AA" }}>
                  Sudah punya akun?{" "}
                  <button type="button" onClick={() => setMode("login")}
                    style={{ background: "none", border: "none", color: "#1A3A5C", fontWeight: 700, cursor: "pointer", fontSize: 13.5, fontFamily: "var(--font-display)" }}>
                    Masuk di sini
                  </button>
               </div>
              </form>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer note */}
        <p style={{ textAlign: "center", fontSize: 12, color: "rgba(26,58,92,0.45)", marginTop: 20, lineHeight: 1.6 }}>
          Dengan mendaftar, Anda menyetujui Ketentuan Layanan & Kebijakan Privasi DIGDAYA.
        </p>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--krem-linen, #F5F0E8)" }}>
        <Loader2 size={40} style={{ animation: "spin 1s linear infinite", color: "#D4A017" }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
