export async function apiFetch(input: RequestInfo | URL, init?: RequestInit) {
  const res = await fetch(input, init);
  if (res.status === 402 && typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("pp-upgrade-required"));
  }
  return res;
} 