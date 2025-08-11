"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/assessments", label: "Assessments" },
  { href: "/dashboard/essays", label: "Essays" },
  { href: "/dashboard/coach", label: "Coach" },
  { href: "/pricing", label: "Upgrade" },
];

export default function SideNav() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-60 shrink-0 border-r bg-background md:block">
      <div className="p-4 text-sm font-semibold text-primary">PortersPrep</div>
      <nav className="px-2 pb-4 text-sm">
        {items.map(it => (
          <Link
            key={it.href}
            href={it.href}
            className={`block rounded px-3 py-2 transition-colors ${pathname===it.href ? "bg-secondary text-foreground border border-border" : "text-muted-foreground hover:bg-accent"}`}
          >
            {it.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
} 