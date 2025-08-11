import { Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import TopNav from "@/components/layout/TopNav";
import SiteFooter from "@/components/layout/SiteFooter";
import "./globals.css";

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700"], 
  variable: "--font-poppins", 
  display: "swap" 
});

export const metadata = {
  title: "PortersPrep — MBA Admissions Copilot",
  description: "Assess • Edit • Coach",
  icons: { icon: "/favicon.png" }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={poppins.variable}>
        <body className="min-h-screen font-sans">
          <div className="min-h-screen bg-background text-foreground">
            <TopNav />
            {children}
            <SiteFooter />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
} 