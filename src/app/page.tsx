export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      <div className="max-w-3xl">
        <h1 className="text-5xl font-bold leading-tight">Your MBA Admissions Copilot</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Assess your odds, get coaching-style essay feedback, and book time with an expert coach.
        </p>
        <div className="mt-8 flex gap-3">
          <a href="/dashboard" className="rounded bg-black px-5 py-3 text-white">Open the App</a>
          <a href="/pricing" className="rounded border px-5 py-3">View Pricing</a>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Assess</h3>
            <p className="text-sm text-muted-foreground">Tailored school strategy + likelihood bands.</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Edit</h3>
            <p className="text-sm text-muted-foreground">Live editor with AI redlines (no ghostwriting).</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Coach</h3>
            <p className="text-sm text-muted-foreground">DM a coach and book sessions with context.</p>
          </div>
        </div>
        <p className="mt-10 text-xs text-muted-foreground">We coach; you write. No ghostwriting.</p>
      </div>
    </main>
  );
} 