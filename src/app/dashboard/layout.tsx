import AppShell from "@/components/layout/AppShell";
import { auth } from "@clerk/nextjs/server";

export const metadata = { title: "Dashboard — The Admit Architect" };

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = auth();
  
  if (!userId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="mx-auto max-w-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Sign in required</h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to access your dashboard.
          </p>
          <div className="flex flex-col gap-3">
            <a 
              href="/sign-in" 
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground shadow-sm hover:opacity-95"
            >
              Sign In
            </a>
            <a 
              href="/sign-up" 
              className="rounded-md border px-4 py-2 hover:bg-muted transition-colors"
            >
              Create Account
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
} 