export async function apiFetch(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, init);
  if (res.status === 402) {
    try {
      const data = await res.json();
      window.dispatchEvent(
        new CustomEvent("pp:upgrade-required", { detail: data }),
      );
    } catch {
      window.dispatchEvent(
        new CustomEvent("pp:upgrade-required", {
          detail: { error: "upgrade_required" },
        }),
      );
    }
  }
  return res;
}
