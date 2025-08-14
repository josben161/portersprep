"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Profile", desc: "Resume & Story Bank" },
  { href: "/dashboard/predict", label: "Predict", desc: "Fit by school" },
  {
    href: "/dashboard/applications",
    label: "Applications",
    desc: "Essays & tasks",
  },
  {
    href: "/dashboard/recommendations",
    label: "Recommendations",
    desc: "School-specific",
  },
  { href: "/dashboard/coach", label: "Planner", desc: "AI assistant" },
];

export default function SideNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-60 shrink-0 border-r bg-background md:block">
        <div className="p-4 flex items-center">
          <Image
            src="/brand/long_logo.png"
            alt="The Admit Architect"
            width={160}
            height={40}
            className="h-8 w-auto"
          />
        </div>
        <div className="px-2 pb-3 pt-1 text-xs uppercase tracking-wide text-muted-foreground">
          Dashboard
        </div>
        <nav className="px-2 pb-4 space-y-1">
          {items.map((it) => {
            const active =
              pathname === it.href || pathname?.startsWith(it.href + "/");
            return (
              <Link
                key={it.href}
                href={it.href}
                className={`block rounded-md px-3 py-2 text-sm transition-colors ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-[#592d20]/10 hover:text-[#592d20]"}`}
              >
                <div className="font-medium">{it.label}</div>
                <div className="text-[11px] text-muted-foreground">
                  {it.desc}
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-20 left-4 z-30">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md bg-background border shadow-sm hover:bg-muted transition-colors"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`md:hidden fixed top-0 left-0 z-50 h-full w-64 bg-background border-r transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-4 flex items-center justify-between border-b">
          <Image
            src="/brand/long_logo.png"
            alt="The Admit Architect"
            width={160}
            height={40}
            className="h-8 w-auto"
          />
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1 rounded-md hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-2 pb-3 pt-1 text-xs uppercase tracking-wide text-muted-foreground">
          Dashboard
        </div>
        <nav className="px-2 pb-4 space-y-1">
          {items.map((it) => {
            const active =
              pathname === it.href || pathname?.startsWith(it.href + "/");
            return (
              <Link
                key={it.href}
                href={it.href}
                className={`block rounded-md px-3 py-2 text-sm transition-colors ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-[#592d20]/10 hover:text-[#592d20]"}`}
              >
                <div className="font-medium">{it.label}</div>
                <div className="text-[11px] text-muted-foreground">
                  {it.desc}
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
