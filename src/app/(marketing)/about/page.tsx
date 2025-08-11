import { Users, Target, Shield, Zap } from "lucide-react";

export const metadata = {
  title: "About — PortersPrep",
  description: "Learn about PortersPrep's mission to democratize MBA admissions coaching through ethical, technology-driven solutions."
};

export default function About() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">About PortersPrep</h1>
        <p className="text-xl text-muted-foreground">
          Empowering MBA applicants through ethical, technology-driven coaching
        </p>
      </div>

      <div className="space-y-16">
        {/* Mission */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg text-muted-foreground mb-6">
            We believe that every MBA applicant deserves access to high-quality, personalized 
            guidance that helps them present their authentic story in the most compelling way. 
            Our mission is to democratize MBA admissions consulting by combining human expertise 
            with intelligent technology.
          </p>
          <p className="text-lg text-muted-foreground">
            We're not here to write your essays or guarantee admission. Instead, we provide 
            the tools, insights, and coaching you need to craft applications that truly 
            represent who you are and what you can contribute to your target programs.
          </p>
        </section>

        {/* Values */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">We coach - You share your voice - We maximise you chances.</h3>
                <p className="text-muted-foreground">
                  Your voice matters. We provide feedback, suggestions, and guidance, but the 
                  writing is always yours. This ensures authenticity and helps you develop 
                  skills that will serve you throughout your MBA journey.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Data-Driven Insights</h3>
                <p className="text-muted-foreground">
                  We leverage historical admissions data and current trends to provide 
                  realistic assessments and targeted strategies, not wishful thinking.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Human + AI Partnership</h3>
                <p className="text-muted-foreground">
                  Technology enhances human expertise, not replaces it. Our AI tools provide 
                  instant feedback while our coaches offer the nuanced guidance that only 
                  experienced professionals can provide.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Transparent Pricing</h3>
                <p className="text-muted-foreground">
                  No hidden fees, no pressure tactics. We offer clear, fair pricing that 
                  scales with your needs, from free starter plans to comprehensive packages.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Commitment */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Our Commitment</h2>
          <p className="text-lg text-muted-foreground mb-6">
            We're committed to ethical practices in MBA admissions consulting. This means:
          </p>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-1">•</span>
              <span>Never writing essays or application materials for applicants</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-1">•</span>
              <span>Providing honest, realistic assessments of admission chances</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-1">•</span>
              <span>Protecting your privacy and data security</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-1">•</span>
              <span>Offering transparent, fair pricing</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-1">•</span>
              <span>Supporting your growth as a writer and communicator</span>
            </li>
          </ul>
        </section>

        {/* Founding Story */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <p className="text-lg text-muted-foreground mb-6">
            PortersPrep was founded with a simple belief: MBA admissions consulting should be 
            accessible, ethical, and effective. We recognized that traditional consulting was 
            often expensive, opaque, and sometimes crossed ethical boundaries.
          </p>
          <p className="text-lg text-muted-foreground">
            By combining the expertise of experienced MBA admissions professionals with 
            cutting-edge AI technology, we've created a platform that provides personalized 
            guidance at a fraction of the cost, while maintaining the highest ethical standards.
          </p>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="bg-gray-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Ready to start your MBA journey?</h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of applicants who are taking control of their admissions process.
            </p>
            <a 
              href="/dashboard" 
              className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Start Your Journey
            </a>
          </div>
        </section>
      </div>
    </main>
  );
} 