"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";

export default function CommandMenu() {
  const [open, setOpen] = useState(false);
  const r = useRouter();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const [apps, setApps] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/applications")
      .then((r) => r.json())
      .then(setApps)
      .catch(() => {});
  }, []);

  return (
    <div>
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/30"
          onClick={() => setOpen(false)}
        >
          <div
            className="mx-auto mt-24 w-full max-w-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Command className="rounded-lg border bg-card p-2 text-sm shadow-xl">
              <Command.Input
                autoFocus
                placeholder="Jump to school, essay, or story…"
                className="w-full rounded-md border px-3 py-2"
              />
              <Command.List className="max-h-[50vh] overflow-auto">
                <Command.Empty className="p-3 text-muted-foreground">
                  No results.
                </Command.Empty>
                <Command.Group heading="Applications">
                  {apps.map((a: any) => (
                    <Command.Item
                      key={a.id}
                      onSelect={() => {
                        r.push(`/dashboard/applications/${a.id}/ide`);
                        setOpen(false);
                      }}
                    >
                      {a.schools?.name ?? "School"} — open IDE
                    </Command.Item>
                  ))}
                </Command.Group>
                <Command.Separator />
                <Command.Group heading="Utilities">
                  <Command.Item
                    onSelect={() => {
                      r.push("/dashboard/stories");
                      setOpen(false);
                    }}
                  >
                    Open Story Bank
                  </Command.Item>
                  <Command.Item
                    onSelect={() => {
                      r.push("/pricing");
                      setOpen(false);
                    }}
                  >
                    View Pricing
                  </Command.Item>
                </Command.Group>
              </Command.List>
            </Command>
          </div>
        </div>
      )}
    </div>
  );
}
