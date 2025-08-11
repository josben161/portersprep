export default function About() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About PortersPrep</h1>
        <p className="text-lg text-muted-foreground">
          Empowering MBA applicants through ethical, technology-driven coaching
        </p>
      </div>

      <div className="space-y-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-muted-foreground mb-4">
            We believe that every MBA applicant deserves access to high-quality, personalized 
            guidance that helps them present their authentic story in the most compelling way. 
            Our mission is to democratize MBA admissions consulting by combining human expertise 
            with intelligent technology.
          </p>
          <p className="text-muted-foreground">
            We're not here to write your essays or guarantee admission. Instead, we provide 
            the tools, insights, and coaching you need to craft applications that truly 
            represent who you are and what you can contribute to your target programs.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Philosophy</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3">We Coach; You Write</h3>
              <p className="text-muted-foreground text-sm">
                Your voice matters. We provide feedback, suggestions, and guidance, but the 
                writing is always yours. This ensures authenticity and helps you develop 
                skills that will serve you throughout your MBA journey.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Data-Driven Insights</h3>
              <p className="text-muted-foreground text-sm">
                We leverage historical admissions data and current trends to provide 
                realistic assessments and targeted strategies, not wishful thinking.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Human + AI Partnership</h3>
              <p className="text-muted-foreground text-sm">
                Technology enhances human expertise, not replaces it. Our AI tools provide 
                instant feedback while our coaches offer the nuanced guidance that only 
                experienced professionals can provide.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Transparent Pricing</h3>
              <p className="text-muted-foreground text-sm">
                No hidden fees, no pressure tactics. We offer clear, fair pricing that 
                scales with your needs, from free starter plans to comprehensive packages.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
          <p className="text-muted-foreground mb-4">
            We're committed to ethical practices in MBA admissions consulting. This means:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Never writing essays or application materials for applicants</li>
            <li>• Providing honest, realistic assessments of admission chances</li>
            <li>• Protecting your privacy and data security</li>
            <li>• Offering transparent, fair pricing</li>
            <li>• Supporting your growth as a writer and communicator</li>
          </ul>
        </div>

        <div className="text-center">
          <a 
            href="/dashboard" 
            className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Start Your Journey
          </a>
        </div>
      </div>
    </section>
  );
} 