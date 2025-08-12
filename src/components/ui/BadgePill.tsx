"use client";
export default function BadgePill({ children }:{ children: React.ReactNode }) {
  return <span className="inline-block rounded-full border px-2 py-0.5 text-[11px] leading-5 text-muted-foreground">{children}</span>;
} 