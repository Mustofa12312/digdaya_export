"use client";

interface Step { label: string; icon: string }

const STEPS: Step[] = [
  { label: "Profil Usaha", icon: "🏪" },
  { label: "Data Produk", icon: "📦" },
  { label: "Kemasan", icon: "🖼️" },
  { label: "Legalitas", icon: "📋" },
  { label: "Pasar Tujuan", icon: "🌏" },
];

interface JourneyTrackerProps {
  currentStep: number; // 1-indexed
}

export default function JourneyTracker({ currentStep }: JourneyTrackerProps) {
  return (
    <div style={{ width: "100%", padding: "20px 0 8px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, position: "relative" }}>
        {STEPS.map((step, i) => {
          const stepNum = i + 1;
          const isDone = stepNum < currentStep;
          const isActive = stepNum === currentStep;
          const isLast = i === STEPS.length - 1;

          return (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: isLast ? "0 0 auto" : 1 }}>
              {/* Step circle */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, zIndex: 2 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20,
                  background: isDone
                    ? "linear-gradient(135deg, #2E7D52, #3FA86E)"
                    : isActive
                    ? "linear-gradient(135deg, #D4A017, #F0C040)"
                    : "rgba(26,58,92,0.08)",
                  border: isActive ? "3px solid #D4A017" : isDone ? "3px solid #2E7D52" : "2px solid rgba(26,58,92,0.2)",
                  boxShadow: isActive ? "0 0 20px rgba(212,160,23,0.4)" : "none",
                  transition: "all 0.4s ease",
                }}>
                  {isDone ? "✓" : step.icon}
                </div>
                <div style={{
                  fontSize: 11, fontFamily: "var(--font-body)", fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#1A3A5C" : isDone ? "#2E7D52" : "#8899AA",
                  whiteSpace: "nowrap", textAlign: "center",
                }}>
                  {step.label}
                </div>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div style={{
                  flex: 1, height: 3, marginBottom: 26,
                  background: isDone
                    ? "linear-gradient(90deg, #2E7D52, #3FA86E)"
                    : "rgba(26,58,92,0.12)",
                  transition: "background 0.4s ease",
                  borderRadius: 2,
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
