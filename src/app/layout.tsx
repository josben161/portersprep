import { Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import TopNav from "@/components/layout/TopNav";
import SiteFooter from "@/components/layout/SiteFooter";
import { Toaster } from "react-hot-toast";
import ThemeProvider from "@/components/ThemeProvider";
import CommandMenu from "@/components/CommandMenu";
import UpgradeModal from "@/components/UpgradeModal";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap"
});

export const metadata = {
  title: "The Admit Architect — MBA Admissions Copilot",
  description: "Assess • Edit • Coach",
  icons: { 
    icon: [
      { url: "/brand/square_logo.png?v=2", type: "image/png" },
      { url: "/favicon.png", type: "image/png" }
    ]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={poppins.variable} suppressHydrationWarning>
        <body className="min-h-screen font-sans">
          <ThemeProvider>
            <UpgradeModal />
            <CommandMenu />
            <div className="min-h-screen bg-background text-foreground">
              <TopNav />
              {children}
              <SiteFooter />
            </div>
            <Toaster position="top-center" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
} 