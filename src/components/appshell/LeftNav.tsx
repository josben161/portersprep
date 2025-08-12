"use client";
import Link from "next/link";

export default function LeftNav({
  schools,
  activeId,
}: { schools: Array<{ id:string; name:string; progress?: number }>; activeId?: string }) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-3 py-2 text-sm font-semibold">Schools</div>
      <div className="flex-1 divide-y">
        {schools.map((s)=>(
          <Link
            key={s.id}
            href={`/dashboard/applications/${s.id}`}
            className={`block px-3 py-2 text-sm hover:bg-accent ${activeId===s.id ? "bg-secondary" : ""}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="truncate">{s.name}</span>
              {typeof s.progress === "number" && (
                <span className="text-[10px] text-muted-foreground">{Math.round(s.progress)}%</span>
              )}
            </div>
          </Link>
        ))}
      </div>
      <div className="border-t p-3 text-xs text-muted-foreground">
        <Link href="/dashboard/stories" className="underline">Story Bank</Link>
      </div>
    </div>
  );
} 