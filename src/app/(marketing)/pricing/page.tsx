"use client";

import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleCheckout = async (tier: 'plus' | 'pro') => {
    setIsLoading(tier);
    try {
      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tier }),
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.url;
      } else {
        console.error('Checkout failed');
        alert('Failed to start checkout. Please try again.');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  const plans = [
    {
      name: "Free",
      price: { monthly: "$0", annual: "$0" },
      description: "Perfect for getting started",
      features: [
        "1 assessment per month",
        "1 essay (≤1,000 words)",
        "3 AI redlines",
        "5 coach messages",
        "Basic support"
      ],
      cta: "Get Started",
      href: "/dashboard",
      highlight: false
    },
    {
      name: "Plus",
      price: { monthly: "$49", annual: "$490" },
      description: "For serious applicants",
      features: [
        "3 assessments per month",
        "5 essays (≤5,000 words)",
        "20 AI redlines",
        "50 coach messages",
        "1 coaching call",
        "Priority support"
      ],
      cta: "Start Plus",
      action: () => handleCheckout('plus'),
      highlight: true,
      loading: isLoading === 'plus'
    },
    {
      name: "Pro",
      price: { monthly: "$199", annual: "$1,990" },
      description: "For maximum success",
      features: [
        "∞ assessments (fair use)",
        "20 essays (≤10,000 words)",
        "100 AI redlines",
        "∞ coach messages",
        "Priority coach access",
        "2 coaching calls",
        "Dedicated support"
      ],
      cta: "Start Pro",
      action: () => handleCheckout('pro'),
      highlight: false,
      loading: isLoading === 'pro'
    }
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Simple, transparent pricing
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Start free. Upgrade when you need more.
        </p>
        
        {/* Billing Toggle */}
        <div className="inline-flex items-center bg-muted rounded-lg p-1 mb-8">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'monthly' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'annual' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Annual
            <span className="ml-1 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
              2 months free
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid gap-8 sm:grid-cols-3 mb-16">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-lg border p-6 ${
              plan.highlight 
                ? 'border-primary shadow-lg scale-105' 
                : 'border-border'
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <div className="mb-2">
                <span className="text-3xl font-bold">{plan.price[billingCycle]}</span>
                {plan.price[billingCycle] !== "$0" && (
                  <span className="text-muted-foreground">/{billingCycle === 'monthly' ? 'mo' : 'year'}</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm">
                  <svg className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            {plan.action ? (
              <button
                onClick={plan.action}
                disabled={plan.loading}
                className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                  plan.highlight
                    ? 'bg-primary text-primary-foreground hover:opacity-95'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {plan.loading ? 'Loading...' : plan.cta}
              </button>
            ) : (
              <a
                href={plan.href}
                className={`block w-full py-2 px-4 rounded-md font-medium text-center transition-colors ${
                  plan.highlight
                    ? 'bg-primary text-primary-foreground hover:opacity-95'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {plan.cta}
              </a>
            )}
          </div>
        ))}
      </div>

      <div className="text-center text-sm text-muted-foreground mb-12">
        We coach; you write. Cancel anytime.
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-center mb-8">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Do you write essays for me?</AccordionTrigger>
            <AccordionContent>
              No, we coach; you write. We provide feedback, suggestions, and guidance to help you improve your essays while preserving your authentic voice.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Can I cancel my subscription anytime?</AccordionTrigger>
            <AccordionContent>
              Yes, you can cancel your subscription at any time. You'll continue to have access to your current plan until the end of your billing period.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>What happens if I hit my monthly limits?</AccordionTrigger>
            <AccordionContent>
              You can either upgrade to a higher tier for more capacity or wait until your limits reset at the beginning of your next billing cycle.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>How do I get support?</AccordionTrigger>
            <AccordionContent>
              Free users get basic support via email. Plus and Pro users get priority support with faster response times and additional channels.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
} 