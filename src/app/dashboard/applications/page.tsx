import { requireProfile } from "../_auth";
import { listApplications } from "@/lib/apps";
import Link from "next/link";

export const metadata = { title: "Applications — PortersPrep" };

export default async function Applications() {
  const profile = await requireProfile();
  if (!profile) return <div className="p-8">Please <a className="underline" href="/sign-in">sign in</a>.</div>;

  let apps: any[] = [];
  try {
    apps = await listApplications(profile.id);
  } catch (error) {
    console.error("Error loading applications:", error);
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Applications</h1>
        <Link 
          href="/dashboard/applications/new" 
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-95"
        >
          New Application
        </Link>
      </div>

      {apps.length === 0 ? (
        <div className="mt-8 rounded-lg border p-6 text-center">
          <div className="text-lg font-medium text-muted-foreground mb-2">No applications yet</div>
          <div className="text-sm text-muted-foreground mb-4">
            Start your first MBA application to get organized essay writing and AI feedback.
          </div>
          <Link 
            href="/dashboard/applications/new" 
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-95"
          >
            Create Your First Application
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {apps.map(app => (
            <div key={app.id} className="rounded-lg border bg-card p-4 shadow-sm hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{app.schools?.name || "Unknown School"}</h3>
                    {app.round && (
                      <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium">
                        {app.round}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Created {new Date(app.created_at).toLocaleDateString()}
                  </div>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                      Status: {app.status || "In Progress"}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-muted rounded-full h-1.5">
                        <div 
                          className="bg-primary h-1.5 rounded-full transition-all"
                          style={{ width: `${Math.random() * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(Math.random() * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link 
                    href={`/dashboard/applications/${app.id}/requirements`}
                    className="rounded-md border px-3 py-1 text-sm hover:bg-muted"
                  >
                    Requirements
                  </Link>
                  <Link 
                    href={`/dashboard/applications/${app.id}`}
                    className="rounded-md border px-3 py-1 text-sm hover:bg-muted"
                  >
                    Workspace
                  </Link>
                  <Link 
                    href={`/dashboard/applications/${app.id}/ide`}
                    className="rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground hover:opacity-95"
                  >
                    Open IDE
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 