"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2, LogOut, User, MapPin, Building, Briefcase, ChevronRight, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Form states
  const [username, setUsername] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [industry, setIndustry] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login?redirect=/profile");
        return;
      }
      
      setUser(session.user);
      setUsername(session.user.user_metadata?.username || "");
      setCompanyName(session.user.user_metadata?.company_name || "");
      setAddress(session.user.user_metadata?.address || "");
      setIndustry(session.user.user_metadata?.industry || "");
      setLoading(false);
    };

    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Berhasil keluar.");
    router.push("/");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          username,
          company_name: companyName,
          address,
          industry,
        }
      });
      if (error) throw error;
      toast.success("Profil berhasil diperbarui!");
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui profil.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--krem-linen, #F5F0E8)" }}>
        <Loader2 size={40} style={{ animation: "spin 1s linear infinite", color: "#D4A017" }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--krem-linen, #F5F0E8)",
      paddingTop: 88,
      paddingBottom: 60,
      fontFamily: "var(--font-body, system-ui, sans-serif)"
    }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
        
        {/* Header Section */}
        <div style={{
          background: "linear-gradient(135deg, #1A3A5C 0%, #0D2137 100%)",
          borderRadius: 24,
          padding: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 20px 60px rgba(26,58,92,0.12)",
          position: "relative",
          overflow: "hidden",
          marginBottom: 32,
        }}>
          {/* Decorative Pattern */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(212,160,23,0.08) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          
          <div style={{ display: "flex", alignItems: "center", gap: 24, position: "relative", zIndex: 10 }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: "linear-gradient(135deg, #D4A017, #F0C040)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 32, fontWeight: 800, color: "#1A3A5C",
              fontFamily: "var(--font-display)",
              boxShadow: "0 8px 24px rgba(212,160,23,0.3)"
            }}>
              {username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, color: "#FFFFFF" }}>
                {username || "Pengguna Baru"}
              </h1>
              <p style={{ margin: "4px 0 0", color: "rgba(245,240,232,0.8)", fontSize: 15 }}>
                {user?.email}
              </p>
            </div>
          </div>

          <button onClick={handleLogout} style={{
            position: "relative", zIndex: 10,
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 20px", borderRadius: 12,
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#FFF", fontWeight: 600, fontSize: 14,
            cursor: "pointer", transition: "all 0.2s",
            backdropFilter: "blur(10px)"
          }}
          onMouseEnter={e => { (e.currentTarget.style.background = "rgba(255,255,255,0.2)"); }}
          onMouseLeave={e => { (e.currentTarget.style.background = "rgba(255,255,255,0.1)"); }}
          >
            <LogOut size={16} /> Keluar
          </button>
        </div>

        {/* Main Form Content */}
        <div style={{
          background: "#FFFFFF",
          borderRadius: 24,
          padding: "40px",
          boxShadow: "0 10px 40px rgba(26,58,92,0.06)",
          border: "1px solid rgba(212,160,23,0.15)",
        }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "#1A3A5C", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid rgba(26,58,92,0.08)" }}>
            Informasi Profil & Usaha
          </h2>

          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            
            {/* Grid for two columns on desktop */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
              
              {/* Username */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#1A3A5C", letterSpacing: "0.05em", fontFamily: "var(--font-display)", textTransform: "uppercase" }}>
                  Nama Lengkap / Username
                </label>
                <div style={{ position: "relative" }}>
                  <User size={18} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#8899AA" }} />
                  <input
                    type="text" value={username} onChange={e => setUsername(e.target.value)}
                    placeholder="Masukkan nama Anda"
                    style={{
                      width: "100%", padding: "14px 16px 14px 44px",
                      borderRadius: 14, fontSize: 15, border: "1.5px solid rgba(26,58,92,0.15)",
                      background: "#F8FAFC", color: "#1A3A5C", outline: "none",
                      boxSizing: "border-box", transition: "border-color 0.2s",
                    }}
                    onFocus={e => e.target.style.borderColor = "#D4A017"}
                    onBlur={e => e.target.style.borderColor = "rgba(26,58,92,0.15)"}
                  />
                </div>
              </div>

              {/* Company Name */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#1A3A5C", letterSpacing: "0.05em", fontFamily: "var(--font-display)", textTransform: "uppercase" }}>
                  Nama Usaha / Perusahaan
                </label>
                <div style={{ position: "relative" }}>
                  <Briefcase size={18} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#8899AA" }} />
                  <input
                    type="text" value={companyName} onChange={e => setCompanyName(e.target.value)}
                    placeholder="Contoh: PT Digdaya Ekspor"
                    style={{
                      width: "100%", padding: "14px 16px 14px 44px",
                      borderRadius: 14, fontSize: 15, border: "1.5px solid rgba(26,58,92,0.15)",
                      background: "#F8FAFC", color: "#1A3A5C", outline: "none",
                      boxSizing: "border-box", transition: "border-color 0.2s",
                    }}
                    onFocus={e => e.target.style.borderColor = "#D4A017"}
                    onBlur={e => e.target.style.borderColor = "rgba(26,58,92,0.15)"}
                  />
                </div>
              </div>

              {/* Industry/Category */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#1A3A5C", letterSpacing: "0.05em", fontFamily: "var(--font-display)", textTransform: "uppercase" }}>
                  Kategori Industri
                </label>
                <div style={{ position: "relative" }}>
                  <Building size={18} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#8899AA" }} />
                  <input
                    type="text" value={industry} onChange={e => setIndustry(e.target.value)}
                    placeholder="Contoh: Tekstil, Makanan, dsb."
                    style={{
                      width: "100%", padding: "14px 16px 14px 44px",
                      borderRadius: 14, fontSize: 15, border: "1.5px solid rgba(26,58,92,0.15)",
                      background: "#F8FAFC", color: "#1A3A5C", outline: "none",
                      boxSizing: "border-box", transition: "border-color 0.2s",
                    }}
                    onFocus={e => e.target.style.borderColor = "#D4A017"}
                    onBlur={e => e.target.style.borderColor = "rgba(26,58,92,0.15)"}
                  />
                </div>
              </div>

            </div>

            {/* Address */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#1A3A5C", letterSpacing: "0.05em", fontFamily: "var(--font-display)", textTransform: "uppercase" }}>
                Alamat Lengkap Usaha
              </label>
              <div style={{ position: "relative" }}>
                <MapPin size={18} style={{ position: "absolute", left: 16, top: 16, color: "#8899AA" }} />
                <textarea
                  value={address} onChange={e => setAddress(e.target.value)}
                  placeholder="Masukkan alamat lengkap usaha Anda..."
                  rows={4}
                  style={{
                    width: "100%", padding: "14px 16px 14px 44px",
                    borderRadius: 14, fontSize: 15, border: "1.5px solid rgba(26,58,92,0.15)",
                    background: "#F8FAFC", color: "#1A3A5C", outline: "none",
                    boxSizing: "border-box", transition: "border-color 0.2s", resize: "vertical"
                  }}
                  onFocus={e => e.target.style.borderColor = "#D4A017"}
                  onBlur={e => e.target.style.borderColor = "rgba(26,58,92,0.15)"}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
              <button type="submit" disabled={saving} style={{
                background: "linear-gradient(135deg, #D4A017, #F0C040)",
                color: "#1A3A5C", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16,
                padding: "16px 32px", borderRadius: 14, border: "none",
                display: "flex", alignItems: "center", gap: 10,
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.8 : 1,
                boxShadow: "0 6px 20px rgba(212,160,23,0.3)",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => !saving && (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={e => !saving && (e.currentTarget.style.transform = "translateY(0)")}
              >
                {saving ? (
                  <><Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> Menyimpan...</>
                ) : (
                  <><Save size={20} /> Simpan Perubahan</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
