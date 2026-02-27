"use client";
import { useEffect, useRef } from "react";

interface ERSGaugeProps {
  score: number;
  size?: number;
  tierColor?: string;
  label?: string;
}

export default function ERSGauge({ score, size = 220, tierColor = "#D4A017", label = "ERS" }: ERSGaugeProps) {
  const circleRef = useRef<SVGCircleElement>(null);

  const radius = (size / 2) - 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.style.strokeDashoffset = String(strokeDashoffset);
    }
  }, [strokeDashoffset]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="ersGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={tierColor} stopOpacity="0.9" />
            <stop offset="100%" stopColor={tierColor} stopOpacity="1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Background ring */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke="rgba(26,58,92,0.12)"
          strokeWidth={14}
        />

        {/* Score ring */}
        <circle
          ref={circleRef}
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke="url(#ersGrad)"
          strokeWidth={14}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          filter="url(#glow)"
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
        />

        {/* Score text */}
        <text
          x={size / 2} y={size / 2 - 10}
          textAnchor="middle" dominantBaseline="middle"
          style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 800, fontSize: size * 0.19, fill: tierColor }}
        >
          {score}
        </text>
        <text
          x={size / 2} y={size / 2 + size * 0.12}
          textAnchor="middle" dominantBaseline="middle"
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: size * 0.07, fill: "#8899AA" }}
        >
          {label}
        </text>
      </svg>
    </div>
  );
}
