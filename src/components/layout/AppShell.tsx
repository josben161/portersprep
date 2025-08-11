import SideNav from "./SideNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      <SideNav />
      <main className="flex-1">{children}</main>
    </div>
  );
} 