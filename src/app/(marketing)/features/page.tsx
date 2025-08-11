export default function Features() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Features</h1>
        <p className="text-lg text-muted-foreground">
          Everything you need to craft a compelling MBA application
        </p>
      </div>

      <div className="grid gap-12">
        {/* Assess Section */}
        <div className="border rounded-lg p-8">
          <h2 className="text-3xl font-semibold mb-6">Assess</h2>
          <p className="text-muted-foreground mb-8">
            Get data-driven insights into your MBA application prospects and develop a 
            targeted strategy for your dream schools.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Profile Analysis</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Comprehensive resume parsing and analysis</li>
                <li>• GPA and test score evaluation</li>
                <li>• Work experience and leadership assessment</li>
                <li>• Extracurricular and community involvement review</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">School Strategy</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Personalized school recommendations</li>
                <li>• Likelihood bands for each target program</li>
                <li>• Application timeline and priority guidance</li>
                <li>• Gap analysis and improvement roadmap</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Edit Section */}
        <div className="border rounded-lg p-8">
          <h2 className="text-3xl font-semibold mb-6">Edit</h2>
          <p className="text-muted-foreground mb-8">
            Write and refine your essays with AI-powered feedback that guides your 
            writing without doing it for you.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Collaborative Editor</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Real-time collaborative writing environment</li>
                <li>• Version control and change tracking</li>
                <li>• Auto-save and cloud synchronization</li>
                <li>• Export to multiple formats</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">AI Feedback</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Style and tone suggestions</li>
                <li>• Structure and flow recommendations</li>
                <li>• Grammar and clarity improvements</li>
                <li>• School-specific essay guidance</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Coach Section */}
        <div className="border rounded-lg p-8">
          <h2 className="text-3xl font-semibold mb-6">Coach</h2>
          <p className="text-muted-foreground mb-8">
            Connect with experienced MBA coaches who provide personalized guidance 
            throughout your application journey.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Direct Messaging</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Real-time chat with coaches</li>
                <li>• File sharing and document review</li>
                <li>• Context-aware conversations</li>
                <li>• Quick question resolution</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Consultation Sessions</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Book 1-on-1 video consultations</li>
                <li>• Strategy and essay review sessions</li>
                <li>• Interview preparation coaching</li>
                <li>• Application timeline planning</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-16">
        <a 
          href="/dashboard" 
          className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Start Your Application
        </a>
      </div>
    </section>
  );
} 