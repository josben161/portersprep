"use client";
import { useState } from "react";

export default function RightTabs({
  tabs,
  initial = 0,
}: { tabs: Array<{ label: string; node: React.ReactNode }>; initial?: number }) {
  const [idx, setIdx] = useState(initial);
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b p-2">
        {tabs.map((t, i)=>(
          <button
            key={t.label}
            onClick={()=>setIdx(i)}
            className={`rounded px-2 py-1 text-xs ${i===idx ? "bg-secondary" : "hover:bg-accent"}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-auto p-3">{tabs[idx]?.node}</div>
    </div>
  );
} 