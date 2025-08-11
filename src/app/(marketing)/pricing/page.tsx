"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, Loader2 } from "lucide-react";

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleCheckout = async (tier: string) => {
    setLoadingTier(tier);
    try {
      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tier }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        console.error('Checkout failed');
        setLoadingTier(null);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setLoadingTier(null);
    }
  };

  const plans = [
    {
      name: "Free",
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        "1 assessment / month",
        "1 essay (≤1k words)",
        "3 AI redlines / month",
        "5 coach DMs / month"
      ],
      cta: "Get started",
      popular: false
    },
    {
      name: "Plus",
      monthlyPrice: 49,
      annualPrice: 490,
      features: [
        "3 assessments",
        "5 essays (≤5k words)",
        "20 AI redlines",
        "50 DMs + 1 call"
      ],
      cta: "Upgrade",
      popular: true
    },
    {
      name: "Pro",
      monthlyPrice: 199,
      annualPrice: 1990,
      features: [
        "∞ assessments (fair use)",
        "20 essays (≤10k words)",
        "100 AI redlines",
        "Priority coach + 2 calls"
      ],
      cta: "Go Pro",
      popular: false
    }
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Simple, fair pricing</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Start free. Upgrade when you need more.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-4 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => setIsAnnual(false)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              !isAnnual 
                ? "bg-white text-black shadow-sm" 
                : "text-gray-600 hover:text-black"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isAnnual 
                ? "bg-white text-black shadow-sm" 
                : "text-gray-600 hover:text-black"
            }`}
          >
            Annual
            <span className="ml-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              2 months free
            </span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid gap-6 sm:grid-cols-3 mb-16">
        {plans.map((plan) => (
          <Card 
            key={plan.name}
            className={`relative ${plan.popular ? 'ring-2 ring-black' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-medium">
                  Most Popular
                </span>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="mt-2">
                <span className="text-3xl font-bold">
                  ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                </span>
                <span className="text-muted-foreground">
                  {plan.monthlyPrice === 0 ? "" : isAnnual ? "/year" : "/month"}
                </span>
              </div>
              {isAnnual && plan.monthlyPrice > 0 && (
                <CardDescription>
                  ${Math.round(plan.annualPrice / 12)}/mo when billed annually
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              {plan.name === "Free" ? (
                <a
                  href="/dashboard"
                  className={`w-full inline-flex justify-center items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    plan.popular
                      ? "bg-black text-white hover:bg-gray-800"
                      : "border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {plan.cta}
                </a>
              ) : (
                <button
                  onClick={() => handleCheckout(plan.name.toLowerCase())}
                  disabled={loadingTier === plan.name.toLowerCase()}
                  className={`w-full inline-flex justify-center items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    plan.popular
                      ? "bg-black text-white hover:bg-gray-800 disabled:opacity-50"
                      : "border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                  }`}
                >
                  {loadingTier === plan.name.toLowerCase() ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Loading...
                    </>
                  ) : (
                    plan.cta
                  )}
                </button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Small Print */}
      <div className="text-center text-xs text-muted-foreground mb-12 space-y-1">
        <p>We coach; you write. Cancel anytime.</p>
        <p>Billed monthly; annual available on request.</p>
      </div>

      {/* FAQ Section */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Do you write essays?</AccordionTrigger>
            <AccordionContent>
              No, we coach; you write. We provide feedback, suggestions, and guidance to help you improve your essays, but you maintain full control over your writing and voice.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Can I cancel anytime?</AccordionTrigger>
            <AccordionContent>
              Yes, you can cancel your subscription at any time. You'll continue to have access to your current plan until the end of your billing period.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>What happens if I hit a monthly limit?</AccordionTrigger>
            <AccordionContent>
              You can either upgrade to a higher tier for more capacity or wait until your limits reset at the beginning of your next billing cycle.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>How does the annual billing work?</AccordionTrigger>
            <AccordionContent>
              Annual billing gives you 2 months free compared to monthly billing. You're charged once per year and can cancel anytime with a prorated refund for unused months.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </main>
  );
} 