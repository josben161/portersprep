import Link from "next/link";
export default function FinalCTA(){
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_80%_120%,rgba(57,109,255,0.18),transparent_60%)]" />
      </div>
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="card flex flex-col items-center gap-4 p-8 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <h3 className="text-2xl font-semibold">Ready to build a standout application?</h3>
            <p className="mt-1 text-muted-foreground">Start free, add schools when you're in flow. No long setup.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/sign-up" className="rounded-md bg-blue-600 px-4 py-2 text-white text-sm font-medium shadow-sm hover:bg-blue-700 transition-colors">Get started</Link>
            <Link href="/pricing" className="btn btn-outline">See pricing</Link>
          </div>
        </div>
      </div>
    </section>
  );
} 