export default function Privacy() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-8 text-muted-foreground">
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Information We Collect</h2>
          <p className="mb-4">
            We collect information you provide directly to us, such as when you create an account, 
            upload documents, or communicate with our coaches. This may include:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Personal information (name, email address, phone number)</li>
            <li>Resume and application materials</li>
            <li>Essay drafts and feedback</li>
            <li>Communication with coaches</li>
            <li>Usage data and analytics</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">How We Use Your Information</h2>
          <p className="mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide our services and improve your experience</li>
            <li>Generate school assessments and recommendations</li>
            <li>Enable AI-powered feedback on your essays</li>
            <li>Facilitate communication with coaches</li>
            <li>Send important updates about our services</li>
            <li>Ensure security and prevent fraud</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information 
            against unauthorized access, alteration, disclosure, or destruction. Your data 
            is encrypted in transit and at rest, and we regularly review our security practices.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Data Sharing</h2>
          <p className="mb-4">
            We do not sell, trade, or otherwise transfer your personal information to third 
            parties except in the following circumstances:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>With your explicit consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and safety</li>
            <li>With service providers who assist in our operations</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Your Rights</h2>
          <p className="mb-4">
            You have the right to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your data</li>
            <li>Opt out of marketing communications</li>
            <li>Export your data in a portable format</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or our data practices, please 
            contact us at privacy@portersprep.com or through our contact form.
          </p>
        </div>
      </div>
    </section>
  );
} 