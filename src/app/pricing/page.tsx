import type { Metadata } from "next";
import PricingTable from "@/components/marketing/PricingTable";
import FAQ from "@/components/marketing/FAQ";
import Footer from "@/components/marketing/Footer";

export const metadata: Metadata = {
  title: "Pricing — The Academic Architect",
  description: "Simple plans for serious applicants."
};

export default function PricingPage(){
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-semibold md:text-4xl">Pricing</h1>
          <p className="mt-2 text-muted-foreground">Start free. Upgrade when you&apos;re in flow.</p>
        </div>
      </section>
      <PricingTable />
      <FAQ />
      <Footer />
    </>
  );
} 