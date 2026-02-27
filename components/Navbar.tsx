"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/assessment", label: "Mulai Validasi" },
  { href: "/markets", label: "Peluang Pasar" },
  { href: "/impact", label: "Dampak" },
  { href: "/about", label: "Tentang" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(13, 33, 55, 0.88)",
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(212,160,23,0.2)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: "linear-gradient(135deg, #D4A017, #F0C040)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 800, color: "#1A3A5C",
            fontFamily: "var(--font-display)",
          }}>D</div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, color: "#F5F0E8", letterSpacing: "0.01em" }}>DIGDAYA</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "rgba(212,160,23,0.9)", letterSpacing: "0.06em", marginTop: -3 }}>EXPORT ADVISOR</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }} className="desktop-nav">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} style={{
              fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 500,
              color: "rgba(245,240,232,0.8)", textDecoration: "none",
              padding: "8px 16px", borderRadius: 8,
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { (e.target as HTMLElement).style.color = "#F0C040"; (e.target as HTMLElement).style.background = "rgba(212,160,23,0.1)"; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.color = "rgba(245,240,232,0.8)"; (e.target as HTMLElement).style.background = "transparent"; }}
            >{l.label}</Link>
          ))}
          <Link href="/assessment" style={{
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14,
            background: "linear-gradient(135deg, #D4A017, #F0C040)",
            color: "#1A3A5C", textDecoration: "none",
            padding: "9px 22px", borderRadius: 10,
            marginLeft: 8,
            transition: "all 0.2s",
            boxShadow: "0 2px 12px rgba(212,160,23,0.3)",
          }}>Cek Kesiapan Ekspor →</Link>
        </div>

        {/* Hamburger */}
        <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", color: "#F5F0E8", cursor: "pointer", display: "none" }} className="hamburger">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div style={{ background: "rgba(13,33,55,0.97)", padding: "16px 24px 24px", borderTop: "1px solid rgba(212,160,23,0.15)" }}>
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{
              display: "block", fontFamily: "var(--font-body)", fontSize: 16,
              color: "#F5F0E8", textDecoration: "none", padding: "12px 0",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>{l.label}</Link>
          ))}
          <Link href="/assessment" onClick={() => setOpen(false)} style={{
            display: "block", textAlign: "center", marginTop: 16,
            fontFamily: "var(--font-display)", fontWeight: 700,
            background: "linear-gradient(135deg, #D4A017, #F0C040)",
            color: "#1A3A5C", textDecoration: "none",
            padding: "13px", borderRadius: 12,
          }}>Cek Kesiapan Ekspor →</Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
