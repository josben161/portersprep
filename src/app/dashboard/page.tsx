// import { auth, currentUser } from "@clerk/nextjs/server";
import { ensureProfile } from "@/lib/profile";
import { LIMITS } from "@/lib/usage";

export default async function Dashboard() {
  // const { userId } = auth();
  // if (!userId) return <div className="p-8">Please <a className="underline" href="/sign-in">sign in</a>.</div>;
  // const user = await currentUser();
  // await ensureProfile({ clerkUserId: userId, email: user?.emailAddresses?.[0]?.emailAddress || "", name: user?.firstName || undefined });
  
  // Temporary for build
  const userId = "dummy-user-id";
  await ensureProfile({ clerkUserId: userId, email: "dummy@example.com", name: "Dummy User" });

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h2 className="text-2xl font-semibold">Welcome to PortersPrep</h2>
      
      {/* Quota Information */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-900 mb-2">Your Monthly Limits</h3>
        <div className="grid gap-2 text-sm text-blue-800">
          <div>• Assessments: {LIMITS.free.assessment_runs} per month</div>
          <div>• AI Redlines: {LIMITS.free.redline_runs} per month</div>
          <div>• Essays: {LIMITS.free.essay_docs} per month</div>
        </div>
        <p className="mt-2 text-xs text-blue-700">
          Hit your limit? <a href="/pricing" className="underline font-medium">Upgrade your plan</a> for more capacity.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <CardLink href="/dashboard/assessments" title="Assess" desc="Get a school strategy." />
        <CardLink href="/dashboard/essays" title="Edit" desc="Collaborative editor." />
        <CardLink href="/dashboard/coach" title="Coach" desc="Book sessions." />
      </div>
    </main>
  );
}

function CardLink({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <a href={href} className="block rounded-lg border p-6 hover:bg-gray-50">
      <h3 className="font-medium">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </a>
  );
} 