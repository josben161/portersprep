"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    href: "/dashboard",
    label: "Profile",
    desc: "Resume & Story Bank",
    key: "profile",
  },
  {
    href: "/dashboard/predict",
    label: "Predict",
    desc: "Fit by school",
    key: "predict",
  },
  {
    href: "/dashboard/applications",
    label: "Applications",
    desc: "Essays & tasks",
    key: "applications",
  },
  {
    href: "/dashboard/recommendations",
    label: "Recommendations",
    desc: "School-specific",
    key: "recs",
  },
  {
    href: "/dashboard/coach",
    label: "Coach",
    desc: "Ask anything",
    key: "coach",
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 shrink-0 border-r bg-card/30 p-3 lg:block">
      <div className="px-2 pb-3 pt-1 text-xs uppercase tracking-wide text-muted-foreground">
        Dashboard
      </div>
      <nav className="space-y-1">
        {items.map((it) => {
          const active =
            pathname === it.href || pathname?.startsWith(it.href + "/");
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`block rounded-md px-3 py-2 text-sm ${active ? "bg-primary/10 text-primary" : "hover:bg-muted"} `}
            >
              <div className="font-medium">{it.label}</div>
              <div className="text-[11px] text-muted-foreground">{it.desc}</div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
