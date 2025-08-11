import TopNav from "@/components/layout/TopNav";
import SiteFooter from "@/components/layout/SiteFooter";

export const metadata = {
  title: "PortersPrep — MBA Admissions Copilot",
  description: "Assess • Edit • Coach. We coach; you write."
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