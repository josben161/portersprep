"use client";
import { ReactNode } from "react";

export default function AppShell({
  left,
  top,
  right,
  children,
}: {
  left: ReactNode;
  top: ReactNode;
  right: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-[100vh] bg-background text-foreground">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 border-b bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="mx-auto max-w-[1400px] px-4">{top}</div>
      </div>

      {/* Main 3-col */}
      <div className="mx-auto max-w-[1400px] grid grid-cols-1 gap-4 px-4 py-4 md:grid-cols-[280px_1fr_360px]">
        {/* Left */}
        <aside className="hidden rounded-lg border md:block">{left}</aside>

        {/* Center */}
        <main className="min-h-[70vh] rounded-lg border">{children}</main>

        {/* Right */}
        <aside className="hidden rounded-lg border lg:block">{right}</aside>
      </div>
    </div>
  );
}
