"use client";
import { useEffect, useState } from "react";

export default function StoryBankPanel({ onInsert }: { onInsert?: (text: string)=>void }) {
  const [stories, setStories] = useState<any[]>([]);
  useEffect(()=>{ fetch("/api/stories").then(r=>r.json()).then(setStories).catch(()=>{}); },[]);
  return (
    <div className="space-y-3">
      <div className="text-xs text-muted-foreground">Story Bank</div>
      {stories.length === 0 ? (
        <div className="text-sm text-muted-foreground">No stories yet. Add some in "Story Bank".</div>
      ) : (
        <div className="space-y-2">
          {stories.map(s=>(
            <div key={s.id} className="rounded-md border p-2">
              <div className="text-sm font-medium">{s.title}</div>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-3">{s.summary}</p>
              {onInsert && (
                <button
                  onClick={()=>onInsert(s.summary)}
                  className="mt-2 rounded-md border px-2 py-1 text-xs hover:bg-accent"
                >
                  Insert summary
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 