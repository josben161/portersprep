export default function Terms() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-8 text-muted-foreground">
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Acceptance of Terms</h2>
          <p>
            By accessing and using PortersPrep's services, you accept and agree to be bound 
            by the terms and provision of this agreement. If you do not agree to abide by 
            the above, please do not use this service.
          </p>
        </div>

        <div>
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
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">User Responsibilities</h2>
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
        </div>

        <div>
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
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Payment and Billing</h2>
          <p className="mb-4">
            Payment terms and conditions:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Subscription fees are billed in advance</li>
            <li>All fees are non-refundable except as required by law</li>
            <li>We may change pricing with 30 days notice</li>
            <li>Failed payments may result in service suspension</li>
            <li>You may cancel your subscription at any time</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Intellectual Property</h2>
          <p>
            All content, features, and functionality of our service are owned by PortersPrep 
            and are protected by international copyright, trademark, and other intellectual 
            property laws. You retain ownership of your essays and application materials.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Limitation of Liability</h2>
          <p>
            PortersPrep shall not be liable for any indirect, incidental, special, 
            consequential, or punitive damages resulting from your use of our services. 
            Our total liability shall not exceed the amount paid for our services.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Contact Information</h2>
          <p>
            For questions about these Terms of Service, please contact us at 
            legal@portersprep.com or through our contact form.
          </p>
        </div>
      </div>
    </section>
  );
} 