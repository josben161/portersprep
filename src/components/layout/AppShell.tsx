import SideNav from "./SideNav";
import CoachWidget from "@/components/dashboard/CoachWidget";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      <SideNav />
      <main className="flex-1">{children}</main>
      <aside className="hidden lg:block w-80 shrink-0 border-l bg-background">
        <div className="p-4 h-full">
          <CoachWidget />
        </div>
      </aside>
    </div>
  );
} 