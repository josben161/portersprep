"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function UpgradeModal(){
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<any>(null);

  useEffect(()=>{
    function onEvt(e: any){
      setDetail(e.detail); setOpen(true);
    }
    window.addEventListener("pp:upgrade-required", onEvt as any);
    return ()=> window.removeEventListener("pp:upgrade-required", onEvt as any);
  },[]);

  if (!open) return null;

  const featureLabel = (()=> {
    switch(detail?.feature){
      case "schools": return "More schools";
      case "essays": return "More essays";
      case "stories": return "Story Bank";
      case "variants": return "Per‑school adaptation";
      case "ai": return "AI drafting & analysis";
      default: return "Upgrade";
    }
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={()=>setOpen(false)}>
      <div className="w-full max-w-md rounded-lg border bg-card p-5 shadow-xl" onClick={(e)=>e.stopPropagation()}>
        <div className="text-lg font-semibold">Unlock {featureLabel}</div>
        <p className="mt-2 text-sm text-muted-foreground">
          You've hit the limit for your current plan. Upgrade to <span className="font-medium">Plus</span> or <span className="font-medium">Pro</span> to keep going.
        </p>
        <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground">
          <li>Plus — $89/mo: up to 3 schools, 10 essays, advanced analysis, per‑school adaptation.</li>
          <li>Pro — $399/mo: up to 20 schools, unlimited essays & AI usage, coach tools.</li>
        </ul>
        <div className="mt-5 flex justify-end gap-2">
          <button className="btn btn-outline text-sm" onClick={()=>setOpen(false)}>Keep exploring</button>
          <Link href="/pricing" className="btn btn-primary text-sm">See plans</Link>
        </div>
      </div>
    </div>
  );
} 