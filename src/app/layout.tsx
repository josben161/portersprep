import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: "PortersPrep — MBA Admissions Copilot",
  description: "Assess • Edit • Coach"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!pk) throw new Error("Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY");
  return (
    <ClerkProvider publishableKey={pk}>
      <html lang="en">
        <body className="min-h-screen">{children}</body>
      </html>
    </ClerkProvider>
  );
} 