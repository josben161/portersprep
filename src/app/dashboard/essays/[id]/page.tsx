import { requireProfile } from "../../_auth";
import {
  getDocument,
  updateDocumentMeta,
  appendDocumentVersion,
} from "@/lib/db";
import Editor from "./writer";

export default async function EssayEditorPage({
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
  const doc = await getDocument(params.id);
  if (!doc || doc.user_id !== profile.id)
    return <div className="p-8">Not found</div>;

  return (
    <div className="mx-auto max-w-4xl p-6">
      <Editor
        id={doc.id}
        initialTitle={doc.title}
        onMetaSave={async (title: string, wordCount: number) => {
          "use server";
          await updateDocumentMeta(doc.id, { title, word_count: wordCount });
          await appendDocumentVersion(
            doc.id,
            `Autosave ${new Date().toISOString()}`,
          );
        }}
      />
    </div>
  );
}
