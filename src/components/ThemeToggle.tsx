"use client";
import { useTheme } from "next-themes";
export default function ThemeToggle(){
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  return (
    <button
      onClick={()=> setTheme(isDark ? "light" : "dark")}
      className="btn btn-outline text-sm"
      title="Toggle theme"
    >
      {isDark ? "☀︎ Light" : "🌙 Dark"}
    </button>
  );
} 