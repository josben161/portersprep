import { requireProfile } from "../_auth";
import { listAssessments } from "@/lib/db";

export const metadata = { title: "Assessments — The Academic Architect" };

export default async function Assessments() {
  const profile = await requireProfile();
  if (!profile) return <div className="p-8">Please <a className="underline" href="/sign-in">sign in</a>.</div>;
  
  let items: any[] = [];
  try {
    items = await listAssessments(profile.id);
  } catch (error) {
    console.error("Error loading assessments:", error);
    // Continue with empty items array
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Assessments</h1>
        <a href="/dashboard/assessments/new" className="rounded-md bg-primary px-4 py-2 text-primary-foreground">New assessment</a>
      </div>
      {items.length === 0 ? (
        <div className="mt-8 rounded-lg border p-6 text-sm text-muted-foreground">
          No assessments yet. Create your first one.
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Highlights</th>
                <th className="px-4 py-2 text-left">Link</th>
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="px-4 py-2">{new Date(a.created_at).toLocaleString()}</td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {a.result?.bands ? "Admit bands ready" : "Draft"}
                  </td>
                  <td className="px-4 py-2">
                    <a className="underline" href={`/dashboard/assessments/${a.id}`}>Open</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 