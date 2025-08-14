import { requireProfile } from "../_auth";
import { listDocuments, createDocument } from "@/lib/db";

export const metadata = { title: "Essays — The Admit Architect" };

export default async function Essays() {
  const profile = await requireProfile();
  if (!profile)
    return (
      <div className="p-8">
        Please{" "}
        <a className="underline" href="/sign-in">
          sign in
        </a>
        .
      </div>
    );

  let docs: any[] = [];
  try {
    docs = await listDocuments(profile.id);
  } catch (error) {
    console.error("Error loading documents:", error);
    // Continue with empty docs array
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Essays</h1>
        <form
          action={async () => {
            "use server";
            try {
              const id = await createDocument(profile.id);
              return { redirect: `/dashboard/essays/${id}` };
            } catch (error) {
              console.error("Error creating document:", error);
              // Return error state instead of crashing
              return { error: "Failed to create essay" };
            }
          }}
        >
          <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground">
            New essay
          </button>
        </form>
      </div>

      {docs.length === 0 ? (
        <div className="mt-8 rounded-lg border p-6 text-sm text-muted-foreground">
          No essays yet. Create your first one.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {docs.map((d) => (
            <a
              key={d.id}
              href={`/dashboard/essays/${d.id}`}
              className="rounded-lg border bg-card p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="font-medium">{d.title}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Updated {new Date(d.updated_at).toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {d.word_count} words • {d.status}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
