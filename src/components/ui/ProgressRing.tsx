"use client";
export default function ProgressRing({ value=0, size=28, stroke=3 }:{ value?: number; size?: number; stroke?: number }) {
  const radius = (size - stroke) / 2;
  const c = 2 * Math.PI * radius;
  const pct = Math.min(100, Math.max(0, value));
  const dash = (pct / 100) * c;
  return (
    <svg width={size} height={size} className="inline-block align-middle">
      <circle cx={size/2} cy={size/2} r={radius} strokeWidth={stroke} className="fill-none stroke-muted-foreground/20" />
      <circle cx={size/2} cy={size/2} r={radius} strokeWidth={stroke}
        className="fill-none stroke-primary transition-all"
        strokeDasharray={`${dash} ${c - dash}`} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} />
    </svg>
  );
} 