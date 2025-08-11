export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">How PortersPrep Works</h1>
        <p className="text-lg text-muted-foreground">
          Three simple steps to get you into your dream MBA program
        </p>
      </div>
      
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <div className="text-3xl font-bold text-gray-300 mb-2">01</div>
            <h2 className="text-2xl font-semibold mb-4">Assess</h2>
            <p className="text-muted-foreground mb-4">
              Upload your resume and tell us about your goals. Our AI analyzes your profile 
              and provides tailored school recommendations with realistic likelihood bands.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• School-specific strategy recommendations</li>
              <li>• Likelihood assessment for each target</li>
              <li>• Gap analysis and improvement roadmap</li>
            </ul>
          </div>
          <div className="w-full md:w-64 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">Assessment Interface</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row-reverse items-center gap-8">
          <div className="flex-1">
            <div className="text-3xl font-bold text-gray-300 mb-2">02</div>
            <h2 className="text-2xl font-semibold mb-4">Edit</h2>
            <p className="text-muted-foreground mb-4">
              Write your essays in our collaborative editor. Get real-time AI feedback 
              that highlights areas for improvement without writing for you.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Live collaborative editing environment</li>
              <li>• AI-powered feedback and suggestions</li>
              <li>• Version control and change tracking</li>
            </ul>
          </div>
          <div className="w-full md:w-64 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">Editor Interface</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <div className="text-3xl font-bold text-gray-300 mb-2">03</div>
            <h2 className="text-2xl font-semibold mb-4">Coach</h2>
            <p className="text-muted-foreground mb-4">
              Connect with expert MBA coaches who understand your journey. Book sessions, 
              get personalized advice, and refine your application strategy.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Direct messaging with coaches</li>
              <li>• Book 1-on-1 consultation sessions</li>
              <li>• Context-aware coaching recommendations</li>
            </ul>
          </div>
          <div className="w-full md:w-64 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">Coaching Interface</span>
          </div>
        </div>
      </div>

      <div className="text-center mt-16">
        <a 
          href="/dashboard" 
          className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Get Started Today
        </a>
      </div>
    </section>
  );
} 