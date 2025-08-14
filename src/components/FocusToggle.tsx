"use client";
import { useEffect, useState } from "react";
export default function FocusToggle() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    if (on) root.classList.add("focus-mode");
    else root.classList.remove("focus-mode");
  }, [on]);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className="btn btn-outline text-sm"
    >
      {on ? "Exit Focus" : "Focus Mode"}
    </button>
  );
}
