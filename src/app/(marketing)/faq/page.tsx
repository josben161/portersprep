'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-muted-foreground">
          Everything you need to know about PortersPrep
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="mb-12">
        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="ethics" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left py-4">
              Do you write essays for me?
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <p className="text-muted-foreground">
                No, we coach; you write. Our AI provides feedback and suggestions to improve your writing, 
                but we never write essays for you. This ensures your voice and authenticity shine through 
                in your application. We believe in ethical coaching that helps you develop your own 
                compelling narrative.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="privacy" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left py-4">
              How do you protect my privacy and data?
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <p className="text-muted-foreground">
                We take data security seriously. All personal information and essays are encrypted in transit 
                and at rest. We never share your data with third parties, and you can request deletion of 
                your data at any time. Our platform complies with GDPR and other privacy regulations.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="security" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left py-4">
              What security measures do you have in place?
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <p className="text-muted-foreground">
                We use industry-standard encryption, secure cloud infrastructure, and regular security audits. 
                All data is stored in secure, SOC 2 compliant data centers. We implement strict access controls 
                and monitor for any suspicious activity to protect your sensitive application materials.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="ownership" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left py-4">
              Who owns my essays and application materials?
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <p className="text-muted-foreground">
                You retain full ownership of all your essays and application materials. We provide coaching 
                and feedback, but the content is always yours. You can export and download your materials 
                at any time, and we don't use your content for any other purpose without your explicit consent.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="limits" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left py-4">
              What happens if I hit my monthly limits?
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <p className="text-muted-foreground">
                You'll receive notifications as you approach your limits. When you reach them, you can either 
                upgrade to a higher tier for more capacity or wait until your limits reset at the beginning 
                of your next billing cycle. We also offer one-time purchases for additional usage if needed.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="schools" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left py-4">
              Which MBA programs do you support?
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <p className="text-muted-foreground">
                We support applications to all major MBA programs globally, including top US programs, 
                European business schools, and international MBA options. Our platform adapts to different 
                application requirements and essay prompts across various schools and programs.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="refunds" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left py-4">
              What's your refund policy?
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <p className="text-muted-foreground">
                We offer a 30-day money-back guarantee for new subscribers. If you're not satisfied with 
                our service within the first 30 days, we'll provide a full refund. For annual plans, 
                we offer prorated refunds for unused months if you cancel early.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="support" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left py-4">
              How do I get help if I have issues?
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <p className="text-muted-foreground">
                We provide multiple support channels: in-app chat with coaches, email support, and 
                comprehensive help documentation. Our team typically responds within 24 hours, and 
                premium users get priority support. You can also book consultation sessions for 
                more detailed assistance.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Contact CTA */}
      <div className="text-center">
        <p className="text-muted-foreground mb-4">
          Still have questions? We're here to help.
        </p>
        <a 
          href="/contact" 
          className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Contact Us
        </a>
      </div>
    </main>
  );
} 