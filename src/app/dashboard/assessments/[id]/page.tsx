import { requireProfile } from "../../_auth";
import { getAssessment } from "@/lib/db";

export default async function AssessmentDetail({
  params,
}: {
  params: { id: string };
}) {
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
  const a = await getAssessment(params.id);
  if (!a) return <div className="p-8">Not found</div>;

  const res = a.result ?? {};
  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">Assessment</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Created {new Date(a.created_at).toLocaleString()}
      </p>

      <section className="mt-6 rounded-lg border p-4">
        <h2 className="font-medium">Admit bands</h2>
        <pre className="mt-2 overflow-auto rounded bg-muted/40 p-3 text-sm">
          {JSON.stringify(res.bands ?? {}, null, 2)}
        </pre>
      </section>

      <section className="mt-4 rounded-lg border p-4">
        <h2 className="font-medium">Angles</h2>
        <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
          {(res.angles ?? []).map((x: string) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </section>

      <section className="mt-4 rounded-lg border p-4">
        <h2 className="font-medium">Gaps & next steps</h2>
        <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
          {(res.gaps ?? []).map((x: string) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
          {(res.timeline ?? []).map((x: string) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </section>

      <a
        href="/dashboard/assessments/new"
        className="mt-6 inline-block rounded-md border px-4 py-2"
      >
        Start another
      </a>
    </div>
  );
}
