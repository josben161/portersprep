export const metadata = { title: "How it works — PortersPrep", description: "Assess → Edit → Coach." };

export default function HowItWorks() {
  const steps = [
    { title: "Assess", desc: "Tell us your background and targets. We compute admit bands, angles, and a plan." },
    { title: "Edit", desc: "Draft in our editor. Get voice-preserving AI redlines with concrete suggestions." },
    { title: "Coach", desc: "DM a coach and book time. We bring your drafts and context so you move faster." },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-bold">How it works</h1>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {steps.map(s => (
          <div key={s.title} className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="text-base font-semibold">{s.title}</div>
            <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 rounded-lg border bg-card p-6 text-center">
        <a href="/dashboard" className="inline-block rounded-md bg-foreground px-5 py-2.5 text-background">Open the App</a>
      </div>
    </section>
  );
} 