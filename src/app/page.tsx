import type { Metadata } from "next";
import Hero from "@/components/marketing/Hero";
import LogoStrip from "@/components/marketing/LogoStrip";
import Features from "@/components/marketing/Features";
import Testimonials from "@/components/marketing/Testimonials";
import PricingTable from "@/components/marketing/PricingTable";
import FAQ from "@/components/marketing/FAQ";
import FinalCTA from "@/components/marketing/FinalCTA";
import Footer from "@/components/marketing/Footer";

export const metadata: Metadata = {
  title: "PortersPrep — The CoPilot for MBA Applicants",
  description: "Design your narrative, draft faster, and tailor every essay to each school's DNA.",
  openGraph: {
    title: "PortersPrep — The CoPilot for MBA Applicants",
    description: "Narrative-aware, school-specific coaching for your MBA applications.",
    type: "website"
  },
  alternates: { canonical: "/" }
};

export default function Home() {
  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "PortersPrep",
            applicationCategory: "Productivity",
            offers: [{ "@type": "Offer", price: "0", priceCurrency: "USD" }]
          })
        }}
      />
      <Hero />
      <LogoStrip />
      <Features />
      <Testimonials />
      <PricingTable />
      <FAQ />
      <FinalCTA />
      <Footer />
    </>
  );
} 