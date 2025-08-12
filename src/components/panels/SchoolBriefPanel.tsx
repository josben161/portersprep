"use client";
export default function SchoolBriefPanel({ brief }: { brief?: any }) {
  if (!brief) {
    return <div className="text-sm text-muted-foreground">No brief loaded. Add a brief in your school data to help the AI match tone/values.</div>;
  }
  return (
    <div className="space-y-2 text-sm">
      <div className="text-xs text-muted-foreground">School Brief</div>
      <pre className="whitespace-pre-wrap rounded-md border bg-muted/40 p-2">{JSON.stringify(brief, null, 2)}</pre>
    </div>
  );
} 