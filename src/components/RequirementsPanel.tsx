"use client";
export default function RequirementsPanel({
  school, onStart
}:{ school: any; onStart?: (essayId:string)=>void }) {
  const essays = school?.essays ?? [];
  return (
    <div className="space-y-2 text-sm">
      <div className="text-xs text-muted-foreground">Requirements</div>
      {essays.length === 0 ? (
        <div className="text-muted-foreground">No essays loaded.</div>
      ) : essays.map((e:any, i:number)=>(
        <div key={i} className="rounded-md border p-2">
          <div className="flex items-center justify-between">
            <div className="font-medium">{e.title}</div>
            <div className="text-[10px] text-muted-foreground">{e.word_limit ? `≤ ${e.word_limit} words` : "no limit"}</div>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{e.prompt}</p>
          <div className="mt-2">
            <button
              className="btn btn-outline text-xs"
              onClick={()=> onStart?.(e.id || e.title)}
            >
              Start Draft
            </button>
          </div>
        </div>
      ))}
      {school?.verify_in_portal && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-2 text-[12px] text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-100">
          Prompts may vary; please confirm in the official application before finalizing.
        </div>
      )}
    </div>
  );
} 