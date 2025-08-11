import { auth, currentUser } from "@clerk/nextjs/server";
import { ensureProfile } from "@/lib/profile";

export default async function Dashboard() {
  const { userId } = auth();
  if (!userId) return <div className="p-8">Please <a className="underline" href="/sign-in">sign in</a>.</div>;
  const user = await currentUser();
  await ensureProfile({ clerkUserId: userId, email: user?.emailAddresses?.[0]?.emailAddress || "", name: user?.firstName || undefined });

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h2 className="text-2xl font-semibold">Welcome to PortersPrep</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <CardLink href="/dashboard/assessments" title="Assess" desc="Get a school strategy." />
        <CardLink href="/dashboard/essays" title="Edit" desc="Collaborative editor + redlines." />
        <CardLink href="/dashboard/coach" title="Coach" desc="DM + book a session." />
      </div>
    </main>
  );
}

function CardLink({ href, title, desc }:{ href:string; title:string; desc:string }) {
  return (
    <a href={href} className="rounded-lg border p-4">
      <div className="font-medium">{title}</div>
      <div className="text-sm text-muted-foreground">{desc}</div>
    </a>
  );
} 