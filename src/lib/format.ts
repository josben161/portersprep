export function formatDate(dt: string | Date): string {
  const date = typeof dt === "string" ? new Date(dt) : dt;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
