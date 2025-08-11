export default function Pricing() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-4xl font-bold">Simple, fair pricing</h1>
      <p className="mt-2 text-muted-foreground">Start free. Upgrade when you need more.</p>
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        <Plan title="Free" price="$0/mo" items={["1 assessment / month","1 essay (≤1k words)","3 AI redlines / month","5 coach DMs / month"]} cta="Get started" />
        <Plan title="Plus" price="$49/mo" items={["3 assessments","5 essays (≤5k)","20 AI redlines","50 DMs + 1 call"]} cta="Upgrade" primary />
        <Plan title="Pro" price="$199/mo" items={["∞ assessments (fair use)","20 essays (≤10k)","100 AI redlines","Priority coach + 2 calls"]} cta="Go Pro" primary />
      </div>
      <p className="mt-8 text-xs text-muted-foreground">Cancel anytime. No ghostwriting — we coach; you write.</p>
    </section>
  );
}

function Plan({ title, price, items, cta, primary }:{
  title:string; price:string; items:string[]; cta:string; primary?:boolean
}) {
  return (
    <div className="rounded-lg border p-6">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-1 text-muted-foreground">{price}</p>
      <ul className="mt-4 list-disc pl-5 text-sm text-muted-foreground">
        {items.map(i => <li key={i}>{i}</li>)}
      </ul>
      <a href="/dashboard" className={`mt-6 inline-block rounded px-4 py-2 ${primary ? "bg-black text-white" : "border"}`}>{cta}</a>
    </div>
  );
} 