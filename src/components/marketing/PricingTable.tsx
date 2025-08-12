import Link from "next/link";

const TIERS = [
  {
    name: "Free",
    price: "$0",
    sub: "Start drafting",
    cta: { href: "/sign-up", label: "Start free" },
    features: [
      "1 school workspace",
      "2 essays total",
      "Basic analysis",
      "Story Bank up to 3 stories",
      "No coverage heatmap",
      "5 AI actions/month"
    ],
  },
  {
    name: "Plus",
    price: "$89/mo",
    sub: "Most popular",
    highlight: true,
    cta: { href: "/checkout/plus", label: "Choose Plus" },
    features: [
      "Up to 3 schools",
      "10 essays total",
      "Advanced analysis",
      "Per‑school adaptation",
      "Story Bank unlimited",
      "Coverage heatmap",
      "2 variants/story/school"
    ],
  },
  {
    name: "Pro",
    price: "$299/mo",
    sub: "For full cycles & pros",
    cta: { href: "/checkout/pro", label: "Choose Pro" },
    features: [
      "Up to 20 schools",
      "Unlimited essays",
      "Unlimited analysis & adaptation",
      "Unlimited Story Bank & variants",
      "Coverage heatmap",
      "Priority support & coach tools"
    ],
  }
];

export default function PricingTable(){
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold md:text-4xl">Simple pricing</h2>
        <p className="mt-2 text-muted-foreground">Choose a plan that matches your round and target list.</p>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {TIERS.map((t)=>(
          <div key={t.name} className={`card p-6 ${t.highlight ? "ring-2 ring-brand-500" : ""}`}>
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-lg font-medium">{t.name}</div>
                <div className="text-sm text-muted-foreground">{t.sub}</div>
              </div>
              <div className="text-2xl font-semibold">{t.price}</div>
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {t.features.map((f)=> <li key={f} className="flex items-center gap-2"><span className="text-brand-500">✓</span>{f}</li>)}
            </ul>
            <Link href={t.cta.href} className={`mt-6 inline-flex w-full items-center justify-center rounded-md ${t.highlight ? "btn btn-primary" : "btn btn-outline"}`}>{t.cta.label}</Link>
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">Prices may change; taxes may apply. Cancel anytime.</p>
    </section>
  );
} 