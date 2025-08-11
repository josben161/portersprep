"use client";
import { useState } from "react";

export default function Pricing() {
  const [annual, setAnnual] = useState(false);
  const plus = annual ? "$490/yr" : "$49/mo";
  const pro  = annual ? "$1,990/yr" : "$199/mo";
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Simple, fair pricing</h1>
          <p className="mt-2 text-muted-foreground">Start free. Upgrade when you need more.</p>
        </div>
        <div className="rounded-md border p-1 text-sm">
          <button onClick={()=>setAnnual(false)} className={`rounded px-3 py-1.5 ${!annual ? "bg-foreground text-background" : ""}`}>Monthly</button>
          <button onClick={()=>setAnnual(true)} className={`rounded px-3 py-1.5 ${annual ? "bg-foreground text-background" : ""}`}>Annual</button>
        </div>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        <Plan title="Free" price="$0" bullets={[
          "1 assessment / month","1 essay (≤1k words)","3 AI redlines / month","5 coach DMs / month"
        ]} cta="Get started" href="/dashboard" />
        <Plan title="Plus" price={plus} highlight bullets={[
          "3 assessments","5 essays (≤5k)","20 AI redlines","50 DMs + 1 call"
        ]} cta="Upgrade" href="/dashboard" />
        <Plan title="Pro" price={pro} bullets={[
          "∞ assessments (fair use)","20 essays (≤10k)","100 AI redlines","Priority coach + 2 calls"
        ]} cta="Go Pro" href="/dashboard" />
      </div>
      <p className="mt-8 text-xs text-muted-foreground">We coach; you write. Cancel anytime. Annual pricing reflects 2 months free.</p>
    </section>
  );
}

function Plan({ title, price, bullets, cta, href, highlight }:{
  title:string; price:string; bullets:string[]; cta:string; href:string; highlight?:boolean
}) {
  return (
    <div className={`rounded-lg border p-6 ${highlight ? "border-primary" : ""}`}>
      <div className="flex items-baseline justify-between">
        <h3 className="text-xl font-semibold">{title}</h3>
        <div className="text-muted-foreground">{price}</div>
      </div>
      <ul className="mt-4 list-disc pl-5 text-sm text-muted-foreground space-y-1.5">
        {bullets.map(b => <li key={b}>{b}</li>)}
      </ul>
      <a href={href} className={`mt-6 inline-block rounded px-4 py-2 ${highlight ? "bg-primary text-primary-foreground shadow-sm hover:opacity-95" : "border"}`}>{cta}</a>
    </div>
  );
} 