import TopNav from "@/components/layout/TopNav";
import SiteFooter from "@/components/layout/SiteFooter";

export const metadata = {
  title: "PortersPrep — MBA Admissions Copilot",
  description: "Assess • Edit • Coach. We coach; you write.",
  icons: { icon: "/favicon.png" },
  openGraph: {
    title: "PortersPrep — MBA Admissions Copilot",
    description: "Assess • Edit • Coach. We coach; you write.",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "PortersPrep",
    images: ["/og.png"],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "PortersPrep — MBA Admissions Copilot",
    description: "Assess • Edit • Coach. We coach; you write.",
    images: ["/og.png"]
  }
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav />
      {children}
      <SiteFooter />
    </div>
  );
} 