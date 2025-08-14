"use client";
import { useEffect, useMemo, useState } from "react";
import BadgePill from "@/components/ui/BadgePill";

function diffWords(a: string, b: string) {
  const aa = (a || "").split(/\s+/),
    bb = (b || "").split(/\s+/);
  const res: any[] = [];
  let i = 0,
    j = 0;
  while (i < aa.length || j < bb.length) {
    if (aa[i] === bb[j]) {
      res.push({ t: aa[i], k: "same" });
      i++;
      j++;
      continue;
    }
    if (aa[i] && !bb.includes(aa[i])) {
      res.push({ t: aa[i], k: "del" });
      i++;
      continue;
    }
    if (bb[j]) {
      res.push({ t: bb[j], k: "add" });
      j++;
      continue;
    }
  }
  return res;
}

export default function StoryVariantsPanel({
  storyId,
  applicationId,
}: {
  storyId: string;
  applicationId: string;
}) {
  const [data, setData] = useState<any | null>(null);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const url = `/api/stories/variants?storyId=${storyId}&applicationId=${applicationId}`;
    fetch(url)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, [storyId, applicationId]);

  const currentVariant = useMemo(
    () =>
      data?.variants?.find((v: any) => v.application_id === applicationId) ??
      null,
    [data, applicationId],
  );
  const base = data?.story?.summary ?? "";
  const variantText = currentVariant?.adapted_text ?? "";

  const diff = useMemo(() => diffWords(base, variantText), [base, variantText]);

  return (
    <div className="space-y-3">
      <div className="text-xs text-muted-foreground">Story Variants</div>
      {!data ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : (
        <>
          <div className="rounded-md border p-2">
            <div className="text-[11px] text-muted-foreground mb-1">
              Core Story
            </div>
            <p className="text-sm leading-6">{base}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {(data?.story?.tags ?? []).map((t: string) => (
                <BadgePill key={t}>{t}</BadgePill>
              ))}
            </div>
          </div>

          <div className="rounded-md border p-2">
            <div className="flex items-center justify-between">
              <div className="text-[11px] text-muted-foreground">
                Variant for this school
              </div>
              {currentVariant?.style?.word_limit ? (
                <BadgePill>≤ {currentVariant.style.word_limit} words</BadgePill>
              ) : null}
            </div>
            {variantText ? (
              <p className="mt-1 text-sm leading-6">
                {diff.map((d, i) =>
                  d.k === "same" ? (
                    <span key={i}>{d.t} </span>
                  ) : d.k === "add" ? (
                    <mark
                      key={i}
                      className="rounded bg-green-200/60 px-0.5 dark:bg-green-900/30"
                    >
                      {d.t}{" "}
                    </mark>
                  ) : (
                    <del key={i} className="opacity-60">
                      {d.t}{" "}
                    </del>
                  ),
                )}
              </p>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">
                No variant yet. Use "Adapt & Insert" to create.
              </p>
            )}
          </div>

          <div className="rounded-md border p-2">
            <div className="text-[11px] text-muted-foreground mb-1">
              Other school variants
            </div>
            <div className="space-y-2">
              {(data?.variants ?? [])
                .filter((v: any) => v.application_id !== applicationId)
                .map((v: any) => (
                  <details key={v.id} className="rounded-md border p-2">
                    <summary className="cursor-pointer text-sm">
                      {v.tone_profile || "variant"} •{" "}
                      {new Date(v.updated_at).toLocaleDateString()}
                    </summary>
                    <p className="mt-2 text-sm leading-6">{v.adapted_text}</p>
                  </details>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
