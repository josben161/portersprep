export const metadata = {
  title: "Terms of Service — PortersPrep",
  description: "Terms and conditions for using PortersPrep's MBA admissions coaching platform."
};

export default function Terms() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-8 text-muted-foreground">
        {/* Acceptance */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Acceptance of Terms</h2>
          <p>
            By accessing and using PortersPrep's services, you accept and agree to be bound 
            by the terms and provision of this agreement. If you do not agree to abide by 
            the above, please do not use this service.
          </p>
        </section>

        {/* Service Description */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Description of Service</h2>
          <p className="mb-4">
            PortersPrep provides MBA admissions consulting services including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>AI-powered school assessments and recommendations</li>
            <li>Essay editing and feedback tools</li>
            <li>Access to experienced MBA admissions coaches</li>
            <li>Application strategy and planning resources</li>
          </ul>
        </section>

        {/* Acceptable Use */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Acceptable Use</h2>
          <p className="mb-4">
            As a user of our services, you agree to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Use our services for lawful purposes only</li>
            <li>Not attempt to reverse engineer or hack our systems</li>
            <li>Respect the intellectual property rights of others</li>
            <li>Not use our services to submit false or misleading information</li>
          </ul>
        </section>

        {/* Service Limitations */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Service Limitations</h2>
          <p className="mb-4">
            Important limitations of our services:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>We do not guarantee admission to any MBA program</li>
            <li>Assessments are estimates based on available data</li>
            <li>We do not write essays or application materials for you</li>
            <li>Services are subject to availability and technical limitations</li>
            <li>We reserve the right to modify or discontinue services</li>
          </ul>
        </section>

        {/* Payment and Refunds */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Payment and Refunds</h2>
          <p className="mb-4">
            Payment terms and conditions:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Subscription fees are billed in advance</li>
            <li>We offer a 30-day money-back guarantee for new subscribers</li>
            <li>Annual plans include prorated refunds for unused months</li>
            <li>We may change pricing with 30 days notice</li>
            <li>Failed payments may result in service suspension</li>
            <li>You may cancel your subscription at any time</li>
          </ul>
        </section>

        {/* Disclaimers */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Disclaimers</h2>
          <p className="mb-4">
            PortersPrep provides coaching and guidance services. We do not:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Guarantee admission to any MBA program</li>
            <li>Write essays or application materials for you</li>
            <li>Provide legal or financial advice</li>
            <li>Ensure specific outcomes from your applications</li>
          </ul>
        </section>

        {/* Intellectual Property */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Intellectual Property</h2>
          <p>
            All content, features, and functionality of our service are owned by PortersPrep 
            and are protected by international copyright, trademark, and other intellectual 
            property laws. You retain ownership of your essays and application materials.
          </p>
        </section>

        {/* Limitation of Liability */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Limitation of Liability</h2>
          <p>
            PortersPrep shall not be liable for any indirect, incidental, special, 
            consequential, or punitive damages resulting from your use of our services. 
            Our total liability shall not exceed the amount paid for our services.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Contact Information</h2>
          <p>
            For questions about these Terms of Service, please contact us at <a href="mailto:legal@portersprep.com" className="text-blue-600 hover:underline">legal@portersprep.com</a> or through our contact form.
          </p>
        </section>
      </div>
    </main>
  );
} 