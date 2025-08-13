import { aiContextManager } from './ai-context-manager';
import OpenAI from 'openai';

// Initialize OpenAI client only on server side with proper error handling
let openai: OpenAI | null = null;

if (typeof window === 'undefined' && process.env.OPENAI_API_KEY) {
  try {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  } catch (error) {
    console.error('Failed to initialize OpenAI client:', error);
  }
}

// Helper function to check if OpenAI is available
function isOpenAIAvailable(): boolean {
  return openai !== null && process.env.OPENAI_API_KEY !== undefined;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  category: 'profile' | 'resume' | 'goals' | 'schools' | 'timeline';
  priority: 'low' | 'medium' | 'high' | 'critical';
  completed: boolean;
  action_url?: string;
  estimated_time: number; // in minutes
}

export interface OnboardingProgress {
  total_steps: number;
  completed_steps: number;
  completion_percentage: number;
  next_steps: OnboardingStep[];
  critical_missing: OnboardingStep[];
  estimated_completion_time: number; // in minutes
}

export async function analyzeOnboardingStatus(userId: string): Promise<OnboardingProgress> {
  try {
    const context = await aiContextManager.getUserContext(userId);
    
    // Check if user has applications beyond "just started"
    const hasAdvancedApplications = context.applications.some(app => 
      app.status && app.status !== 'just_started'
    );
    
    if (hasAdvancedApplications) {
      // User has progressed beyond onboarding
      return {
        total_steps: 0,
        completed_steps: 0,
        completion_percentage: 100,
        next_steps: [],
        critical_missing: [],
        estimated_completion_time: 0
      };
    }
    
    // Generate onboarding steps based on current profile
    const steps = await generateOnboardingSteps(context);
    
    const completedSteps = steps.filter(step => step.completed);
    const criticalMissing = steps.filter(step => 
      step.priority === 'critical' && !step.completed
    );
    
    const totalTime = steps
      .filter(step => !step.completed)
      .reduce((sum, step) => sum + step.estimated_time, 0);
    
    return {
      total_steps: steps.length,
      completed_steps: completedSteps.length,
      completion_percentage: Math.round((completedSteps.length / steps.length) * 100),
      next_steps: steps.filter(step => !step.completed).slice(0, 5),
      critical_missing: criticalMissing,
      estimated_completion_time: totalTime
    };
  } catch (error) {
    console.error('Error analyzing onboarding status:', error);
    return {
      total_steps: 0,
      completed_steps: 0,
      completion_percentage: 0,
      next_steps: [],
      critical_missing: [],
      estimated_completion_time: 0
    };
  }
}

async function generateOnboardingSteps(context: any): Promise<OnboardingStep[]> {
  const steps: OnboardingStep[] = [];
  
  // Profile completion steps
  if (!context.profile.name || context.profile.name.trim() === '') {
    steps.push({
      id: 'profile-name',
      title: 'Complete Your Name',
      description: 'Add your full name to your profile',
      category: 'profile',
      priority: 'critical',
      completed: false,
      action_url: '/dashboard',
      estimated_time: 2
    });
  }
  
  if (!context.profile.email || context.profile.email.trim() === '') {
    steps.push({
      id: 'profile-email',
      title: 'Add Email Address',
      description: 'Ensure your email is up to date',
      category: 'profile',
      priority: 'critical',
      completed: false,
      action_url: '/dashboard',
      estimated_time: 2
    });
  }
  
  if (!context.profile.bio || context.profile.bio.trim() === '') {
    steps.push({
      id: 'profile-bio',
      title: 'Write Your Bio',
      description: 'Tell us about your background and goals',
      category: 'profile',
      priority: 'high',
      completed: false,
      action_url: '/dashboard',
      estimated_time: 10
    });
  }
  
  if (!context.profile.academic_interests || context.profile.academic_interests.trim() === '') {
    steps.push({
      id: 'profile-academic',
      title: 'Add Academic Background',
      description: 'Share your educational background and interests',
      category: 'profile',
      priority: 'high',
      completed: false,
      action_url: '/dashboard',
      estimated_time: 5
    });
  }
  
  if (!context.profile.industry || context.profile.industry.trim() === '') {
    steps.push({
      id: 'profile-industry',
      title: 'Specify Your Industry',
      description: 'Tell us about your current industry and experience',
      category: 'profile',
      priority: 'high',
      completed: false,
      action_url: '/dashboard',
      estimated_time: 3
    });
  }
  
  if (!context.profile.years_exp) {
    steps.push({
      id: 'profile-experience',
      title: 'Add Years of Experience',
      description: 'Specify your work experience duration',
      category: 'profile',
      priority: 'high',
      completed: false,
      action_url: '/dashboard',
      estimated_time: 2
    });
  }
  
  if (!context.profile.gpa) {
    steps.push({
      id: 'profile-gpa',
      title: 'Add Your GPA',
      description: 'Include your undergraduate GPA',
      category: 'profile',
      priority: 'medium',
      completed: false,
      action_url: '/dashboard',
      estimated_time: 2
    });
  }
  
  if (!context.profile.gmat) {
    steps.push({
      id: 'profile-gmat',
      title: 'Add GMAT Score',
      description: 'Include your GMAT score if available',
      category: 'profile',
      priority: 'medium',
      completed: false,
      action_url: '/dashboard',
      estimated_time: 2
    });
  }
  
  if (!context.profile.extracurriculars || context.profile.extracurriculars.trim() === '') {
    steps.push({
      id: 'profile-extracurriculars',
      title: 'Add Extracurricular Activities',
      description: 'Share your leadership and community involvement',
      category: 'profile',
      priority: 'medium',
      completed: false,
      action_url: '/dashboard',
      estimated_time: 8
    });
  }
  
  // Resume steps
  if (!context.resume?.resume_key) {
    steps.push({
      id: 'resume-upload',
      title: 'Upload Your Resume',
      description: 'Upload your current resume for AI analysis',
      category: 'resume',
      priority: 'critical',
      completed: false,
      action_url: '/dashboard',
      estimated_time: 5
    });
  }
  
  // Goals and schools
  if (!context.profile.goals || context.profile.goals.trim() === '') {
    steps.push({
      id: 'profile-goals',
      title: 'Define Your Goals',
      description: 'Share your career and MBA goals',
      category: 'goals',
      priority: 'high',
      completed: false,
      action_url: '/dashboard',
      estimated_time: 10
    });
  }
  
  if (context.applications.length === 0) {
    steps.push({
      id: 'schools-research',
      title: 'Research Target Schools',
      description: 'Start exploring MBA programs that interest you',
      category: 'schools',
      priority: 'high',
      completed: false,
      action_url: '/dashboard/predict',
      estimated_time: 15
    });
  }
  
  // Mark completed steps
  steps.forEach(step => {
    switch (step.id) {
      case 'profile-name':
        step.completed = !!(context.profile.name && context.profile.name.trim() !== '');
        break;
      case 'profile-email':
        step.completed = !!(context.profile.email && context.profile.email.trim() !== '');
        break;
      case 'profile-bio':
        step.completed = !!(context.profile.bio && context.profile.bio.trim() !== '');
        break;
      case 'profile-academic':
        step.completed = !!(context.profile.academic_interests && context.profile.academic_interests.trim() !== '');
        break;
      case 'profile-industry':
        step.completed = !!(context.profile.industry && context.profile.industry.trim() !== '');
        break;
      case 'profile-experience':
        step.completed = !!context.profile.years_exp;
        break;
      case 'profile-gpa':
        step.completed = !!context.profile.gpa;
        break;
      case 'profile-gmat':
        step.completed = !!context.profile.gmat;
        break;
      case 'profile-extracurriculars':
        step.completed = !!(context.profile.extracurriculars && context.profile.extracurriculars.trim() !== '');
        break;
      case 'resume-upload':
        step.completed = !!context.resume?.resume_key;
        break;
      case 'profile-goals':
        step.completed = !!(context.profile.goals && context.profile.goals.trim() !== '');
        break;
      case 'schools-research':
        step.completed = context.applications.length > 0;
        break;
    }
  });
  
  return steps;
}

export async function generateOnboardingMessage(userId: string): Promise<string> {
  try {
    const progress = await analyzeOnboardingStatus(userId);
    
    if (progress.completion_percentage === 100) {
      return "Great job! Your profile is complete. You're ready to start your MBA application journey!";
    }
    
    const criticalCount = progress.critical_missing.length;
    const nextSteps = progress.next_steps.slice(0, 3);
    
    let message = `Welcome to The Admit Architect! I'm here to help you get started with your MBA applications. `;
    
    if (criticalCount > 0) {
      message += `You have ${criticalCount} critical step${criticalCount > 1 ? 's' : ''} to complete to get the most value from our platform. `;
    }
    
    message += `Let's start with these next steps:\n\n`;
    
    nextSteps.forEach((step, index) => {
      message += `${index + 1}. **${step.title}** - ${step.description} (${step.estimated_time} min)\n`;
    });
    
    message += `\nWould you like me to guide you through any of these steps?`;
    
    return message;
  } catch (error) {
    console.error('Error generating onboarding message:', error);
    return "Welcome to The Admit Architect! I'm here to help you with your MBA applications. Let's start by completing your profile.";
  }
} 