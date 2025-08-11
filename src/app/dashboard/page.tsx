// import { auth, currentUser } from "@clerk/nextjs/server";
import { ensureProfile } from "@/lib/profile";

export const metadata = { title: "Dashboard — PortersPrep" };

export default async function Dashboard() {
  // const { userId } = auth();
  // if (!userId) return <div className="p-8">Please <a className="underline" href="/sign-in">sign in</a>.</div>;
  // const user = await currentUser();
  // await ensureProfile({ clerkUserId: userId, email: user?.emailAddresses?.[0]?.emailAddress || "", name: user?.firstName || undefined });

  // Temporary for build
  const userId = "dummy-user-id";
  await ensureProfile({ clerkUserId: userId, email: "dummy@example.com", name: "Dummy User" });

  const cards = [
    { href: "/dashboard/assessments", title: "Assess", desc: "Start a new assessment or revisit results." },
    { href: "/dashboard/essays", title: "Edit", desc: "Write with AI redlines that keep your voice." },
    { href: "/dashboard/coach", title: "Coach", desc: "Message a coach and book a session." },
  ];

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-semibold">Welcome</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {cards.map(c => (
          <a key={c.href} href={c.href} className="rounded-lg border bg-card p-4 shadow-sm transition-colors hover:bg-muted/40">
            <div className="font-medium">{c.title}</div>
            <p className="text-sm text-muted-foreground">{c.desc}</p>
          </a>
        ))}
      </div>
      <div className="mt-8 rounded-lg border p-4">
        <p className="text-sm text-muted-foreground">
          Tip: Free plan includes 1 assessment, 1 essay (≤1k), 3 redlines, 5 DMs. Upgrade on <a className="underline" href="/pricing">Pricing</a>.
        </p>
      </div>
    </div>
  );
} 