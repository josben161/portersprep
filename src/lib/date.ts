export function fmtDate(d?: string | Date | null) {
  if (!d) return "—";
  const dt = typeof d === "string" ? new Date(d) : d;
  return dt.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
export function daysUntil(d?: string | Date | null) {
  if (!d) return null;
  const t = new Date(d).getTime();
  const now = Date.now();
  return Math.ceil((t - now) / (1000 * 60 * 60 * 24));
} 