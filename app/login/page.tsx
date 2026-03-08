"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (isLogin: boolean) => {
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Login berhasil!");
        router.push("/"); // Kembali ke beranda
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success("Daftar berhasil! Cek email untuk verifikasi (jika diperlukan).");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--krem-linen)] p-6 pattern-batik page-enter">
      <div className="w-full max-w-md bg-white p-8 rounded-[20px] shadow-[0_8px_40px_rgba(26,58,92,0.1)] border border-[rgba(212,160,23,0.12)]">
        <div className="text-center mb-6">
          <div className="font-display font-extrabold text-[28px] text-[#1A3A5C] mb-1">Masuk UMKM</div>
          <div className="text-[#8899AA] text-[14px]">Log masuk untuk menyimpan Export Readiness Score Anda secara permanen.</div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-semibold text-[#1A3A5C] font-display">Email</label>
            <input
              type="email"
              placeholder="Contoh: ukmku@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl text-[14px] border-[1.5px] border-[rgba(26,58,92,0.18)] outline-none focus:border-[#D4A017] transition-all bg-white text-[#1A3A5C]"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-semibold text-[#1A3A5C] font-display">Kata Sandi</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl text-[14px] border-[1.5px] border-[rgba(26,58,92,0.18)] outline-none focus:border-[#D4A017] transition-all bg-white text-[#1A3A5C]"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={() => handleAuth(true)}
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-display font-bold text-[15px] bg-gradient-to-br from-[#1A3A5C] to-[#2E6AA0] shadow-[0_4px_16px_rgba(26,58,92,0.2)] hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
          
          <button
            onClick={() => handleAuth(false)}
            disabled={loading}
            className="w-full py-3 rounded-xl text-[#1A3A5C] font-display font-semibold text-[15px] border-[1.5px] border-[rgba(26,58,92,0.15)] bg-white hover:bg-[rgba(26,58,92,0.02)] transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            Daftar Akun Baru
          </button>
        </div>
      </div>
    </div>
  );
}
