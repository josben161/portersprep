import { BarChart3, Edit3, Users, Target, Clock, FileText, MessageSquare, Calendar } from "lucide-react";

export const metadata = {
  title: "Features — PortersPrep",
  description: "Assess your odds, edit with AI guidance, and connect with expert coaches. Everything you need for your MBA application."
};

export default function Features() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      {/* Intro Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">Why PortersPrep?</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          We combine data-driven insights, AI-powered editing, and expert coaching to help you 
          craft authentic applications that showcase your unique story.
        </p>
      </div>

      <div className="space-y-20">
        {/* Assess Section */}
        <section>
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Assess</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get data-driven insights into your MBA application prospects and develop a 
              targeted strategy for your dream schools.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mb-4">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-3">Intake Form Highlights</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive profile analysis including work experience, leadership roles, 
                academic background, and career goals to understand your unique story.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mb-4">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-3">Admit-Band Rationale</h3>
              <p className="text-sm text-muted-foreground">
                Data-driven likelihood bands based on historical admissions data, 
                helping you understand your chances and identify realistic targets.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mb-4">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-3">Timeline Planning</h3>
              <p className="text-sm text-muted-foreground">
                Personalized application timeline with deadlines, milestones, and 
                strategic recommendations for each target school.
              </p>
            </div>
          </div>

          <div className="text-center">
            <a 
              href="/dashboard" 
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Your Assessment
              <BarChart3 className="h-4 w-4" />
            </a>
          </div>
        </section>

        {/* Edit Section */}
        <section>
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Edit3 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Edit</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Write and refine your essays with AI-powered feedback that guides your 
              writing while preserving your authentic voice.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-50 rounded-lg mb-4">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-3">Live Editor</h3>
              <p className="text-sm text-muted-foreground">
                Real-time collaborative writing environment with auto-save, version control, 
                and seamless integration with your application materials.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-50 rounded-lg mb-4">
                <Edit3 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-3">AI Redlines</h3>
              <p className="text-sm text-muted-foreground">
                Intelligent feedback on structure, clarity, and impact while maintaining 
                your unique voice and personal narrative.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-50 rounded-lg mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-3">Voice-Preserving Principles</h3>
              <p className="text-sm text-muted-foreground">
                Our AI is trained to enhance your writing without changing your voice. 
                We coach - You share your voice - We maximise you chances.. No ghostwriting ever.
              </p>
            </div>
          </div>

          <div className="text-center">
            <a 
              href="/dashboard" 
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Start Writing
              <Edit3 className="h-4 w-4" />
            </a>
          </div>
        </section>

        {/* Coach Section */}
        <section>
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Coach</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with experienced MBA coaches who provide personalized guidance 
              throughout your application journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-50 rounded-lg mb-4">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-3">DM Thread</h3>
              <p className="text-sm text-muted-foreground">
                Direct messaging with coaches for quick questions, feedback, and 
                ongoing support throughout your application process.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-50 rounded-lg mb-4">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-3">Docs Context</h3>
              <p className="text-sm text-muted-foreground">
                Coaches have full context of your assessments, essays, and application 
                materials for personalized, informed guidance.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-50 rounded-lg mb-4">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-3">Booking</h3>
              <p className="text-sm text-muted-foreground">
                Schedule 1-on-1 video consultations for deep-dive strategy sessions, 
                essay reviews, and interview preparation.
              </p>
            </div>
          </div>

          <div className="text-center">
            <a 
              href="/dashboard" 
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Connect with Coaches
              <Users className="h-4 w-4" />
            </a>
          </div>
        </section>
      </div>

      {/* Final CTA */}
      <div className="text-center mt-20">
        <div className="bg-gray-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">Ready to start your MBA journey?</h2>
          <p className="text-muted-foreground mb-6">
            Join applicants who are taking control of their admissions process with PortersPrep.
          </p>
          <a 
            href="/dashboard" 
            className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Get Started Today
          </a>
        </div>
      </div>
    </main>
  );
} 