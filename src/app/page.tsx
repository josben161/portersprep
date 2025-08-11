export const metadata = {
  title: "Your MBA Admissions Copilot — PortersPrep",
  description: "Assess your odds, sharpen essays with coaching-style feedback, and book an expert coach."
};

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              Your MBA Admissions Copilot
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Assess your odds, get voice-preserving AI redlines, and work with a coach who sees your docs and context.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/dashboard" className="rounded-md bg-foreground px-5 py-3 text-background">Open the App</a>
              <a href="/pricing" className="rounded-md border px-5 py-3">View Pricing</a>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Used by applicants targeting top MBA programs. We coach; you write.
            </p>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="rounded-md border bg-background p-4">
              <div className="mb-2 text-sm font-medium">Assessment preview</div>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Admit bands by school</li>
                <li>• Angles to lean into</li>
                <li>• Gap analysis & next steps</li>
                <li>• Timeline plan</li>
              </ul>
            </div>
            <div className="mt-4 rounded-md border bg-background p-4">
              <div className="mb-2 text-sm font-medium">Essay redlines</div>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Trim filler & passive voice</li>
                <li>• Clarify goals (short vs long-term)</li>
                <li>• Keep your voice — no ghostwriting</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:grid-cols-3">
          {[
            { title: "Assess", desc: "Tailored school strategy + likelihood bands based on your profile." },
            { title: "Edit", desc: "Collaborative editor with AI redlines that preserve your authentic voice." },
            { title: "Coach", desc: "Message a coach and book time; we bring your docs and context along." }
          ].map(c => (
            <div key={c.title} className="rounded-lg border bg-card p-5 shadow-sm">
              <div className="text-base font-semibold">{c.title}</div>
              <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-semibold">Why PortersPrep vs traditional consulting?</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border p-6">
            <h3 className="font-medium">You get speed + structure</h3>
            <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground space-y-2">
              <li>Instant, repeatable feedback — not calendar-bound.</li>
              <li>Clear timelines and actionables.</li>
              <li>Ethics first: we coach; you write.</li>
            </ul>
          </div>
          <div className="rounded-lg border p-6">
            <h3 className="font-medium">You keep your voice</h3>
            <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground space-y-2">
              <li>No ghostwriting — we never write essays for you.</li>
              <li>Redlines emphasize clarity and impact.</li>
              <li>Coaches see your latest drafts and context.</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 rounded-lg border bg-card p-6 text-center">
          <h3 className="text-lg font-semibold">Ready to start?</h3>
          <p className="mt-2 text-sm text-muted-foreground">Create your first assessment in minutes.</p>
          <a href="/dashboard" className="mt-4 inline-block rounded-md bg-foreground px-5 py-2.5 text-background">Open the App</a>
        </div>
      </section>
    </>
  );
} 