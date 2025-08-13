// AI Insights Engine
// This can be easily extended with real AI capabilities (OpenAI, Claude, etc.)

export interface AIInsight {
  type: 'priority' | 'deadline' | 'progress' | 'suggestion' | 'warning' | 'achievement';
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
  urgency: 'low' | 'medium' | 'high';
  icon: string;
  confidence: number; // 0-1, for future AI integration
  category: 'essays' | 'recommendations' | 'applications' | 'profile' | 'general';
}

export interface ApplicationData {
  id: string;
  status: string;
  round: number;
  schools: {
    name: string;
  };
}

export interface EssayData {
  id: string;
  application_id: string;
  status: string;
  word_count?: number;
  word_limit?: number;
  content?: string;
}

export interface AssignmentData {
  id: string;
  status: 'pending' | 'requested' | 'in_progress' | 'completed' | 'declined';
  due_date?: string;
  applications: {
    id: string;
    schools: {
      name: string;
    };
  };
}

export interface ProfileData {
  gpa?: number;
  gmat?: number;
  years_exp?: number;
  industry?: string;
  goals?: string;
}

export class AIInsightsEngine {
  private applications: ApplicationData[] = [];
  private essays: EssayData[] = [];
  private assignments: AssignmentData[] = [];
  private profile: ProfileData = {};

  constructor(
    applications: ApplicationData[],
    essays: EssayData[],
    assignments: AssignmentData[],
    profile: ProfileData
  ) {
    this.applications = applications;
    this.essays = essays;
    this.assignments = assignments;
    this.profile = profile;
  }

  generateInsights(): AIInsight[] {
    const insights: AIInsight[] = [];

    // Essay progress insights
    insights.push(...this.generateEssayInsights());
    
    // Recommendation insights
    insights.push(...this.generateRecommendationInsights());
    
    // Application status insights
    insights.push(...this.generateApplicationInsights());
    
    // Profile insights
    insights.push(...this.generateProfileInsights());
    
    // Achievement insights
    insights.push(...this.generateAchievementInsights());

    // Sort by urgency and confidence
    return insights.sort((a, b) => {
      const urgencyOrder = { high: 3, medium: 2, low: 1 };
      const aScore = urgencyOrder[a.urgency] + a.confidence;
      const bScore = urgencyOrder[b.urgency] + b.confidence;
      return bScore - aScore;
    });
  }

  private generateEssayInsights(): AIInsight[] {
    const insights: AIInsight[] = [];
    const totalEssays = this.essays.length;
    const completedEssays = this.essays.filter(e => e.status === 'completed').length;
    const overallProgress = totalEssays > 0 ? (completedEssays / totalEssays) * 100 : 0;

    // Overall progress
    if (totalEssays > 0) {
      insights.push({
        type: 'progress',
        title: `You're ${Math.round(overallProgress)}% through your essays`,
        description: `${completedEssays} of ${totalEssays} essays completed. ${totalEssays - completedEssays} remaining.`,
        action: {
          label: "View Essays",
          href: "/dashboard/applications"
        },
        urgency: overallProgress < 50 ? 'high' : overallProgress < 80 ? 'medium' : 'low',
        icon: 'trending-up',
        confidence: 0.95,
        category: 'essays'
      });
    }

    // Incomplete essays
    const incompleteEssays = this.essays.filter(e => e.status !== 'completed');
    if (incompleteEssays.length > 0) {
      const nextEssay = incompleteEssays[0];
      insights.push({
        type: 'priority',
        title: "Continue your essay work",
        description: `You have ${incompleteEssays.length} essay${incompleteEssays.length > 1 ? 's' : ''} in progress. Focus on completing one at a time.`,
        action: {
          label: "Open Essay",
          href: `/dashboard/applications/${nextEssay.application_id}`
        },
        urgency: 'high',
        icon: 'target',
        confidence: 0.9,
        category: 'essays'
      });
    }

    // Word count analysis
    const essaysWithContent = this.essays.filter(e => e.word_count && e.word_limit);
    if (essaysWithContent.length > 0) {
      const overLimit = essaysWithContent.filter(e => (e.word_count || 0) > (e.word_limit || 0));
      if (overLimit.length > 0) {
        insights.push({
          type: 'warning',
          title: `${overLimit.length} essay${overLimit.length > 1 ? 's' : ''} over word limit`,
          description: "Consider editing to meet school requirements.",
          action: {
            label: "Review Essays",
            href: "/dashboard/applications"
          },
          urgency: 'medium',
          icon: 'alert-circle',
          confidence: 0.85,
          category: 'essays'
        });
      }
    }

    return insights;
  }

  private generateRecommendationInsights(): AIInsight[] {
    const insights: AIInsight[] = [];
    const pendingRecommendations = this.assignments.filter(a => a.status === 'pending' || a.status === 'requested');
    const completedRecommendations = this.assignments.filter(a => a.status === 'completed');
    
    if (pendingRecommendations.length > 0) {
      insights.push({
        type: 'deadline',
        title: `${pendingRecommendations.length} recommendation${pendingRecommendations.length > 1 ? 's' : ''} pending`,
        description: `${completedRecommendations.length} completed, ${pendingRecommendations.length} still need attention.`,
        action: {
          label: "Manage Recommendations",
          href: "/dashboard/recommendations"
        },
        urgency: pendingRecommendations.length > 2 ? 'high' : 'medium',
        icon: 'clock',
        confidence: 0.9,
        category: 'recommendations'
      });
    }

    // Due date warnings
    const upcomingDeadlines = this.assignments.filter(a => {
      if (!a.due_date || a.status === 'completed') return false;
      const dueDate = new Date(a.due_date);
      const now = new Date();
      const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilDue <= 7 && daysUntilDue > 0;
    });

    if (upcomingDeadlines.length > 0) {
      insights.push({
        type: 'warning',
        title: `${upcomingDeadlines.length} recommendation${upcomingDeadlines.length > 1 ? 's' : ''} due soon`,
        description: "Follow up with recommenders to ensure timely submission.",
        action: {
          label: "View Deadlines",
          href: "/dashboard/recommendations"
        },
        urgency: 'high',
        icon: 'alert-triangle',
        confidence: 0.95,
        category: 'recommendations'
      });
    }

    return insights;
  }

  private generateApplicationInsights(): AIInsight[] {
    const insights: AIInsight[] = [];
    const planningApps = this.applications.filter(a => a.status === 'planning');
    const inProgressApps = this.applications.filter(a => a.status === 'in_progress');
    
    if (planningApps.length > 0) {
      insights.push({
        type: 'suggestion',
        title: `${planningApps.length} application${planningApps.length > 1 ? 's' : ''} in planning`,
        description: "Consider moving applications to 'In Progress' to start working on essays.",
        action: {
          label: "View Applications",
          href: "/dashboard/applications"
        },
        urgency: 'low',
        icon: 'info',
        confidence: 0.8,
        category: 'applications'
      });
    }

    if (this.applications.length === 0) {
      insights.push({
        type: 'priority',
        title: "Start your MBA journey",
        description: "Add your first application to begin building your profile and essays.",
        action: {
          label: "Add Application",
          href: "/dashboard/applications/new"
        },
        urgency: 'high',
        icon: 'target',
        confidence: 0.95,
        category: 'applications'
      });
    }

    return insights;
  }

  private generateProfileInsights(): AIInsight[] {
    const insights: AIInsight[] = [];

    // Profile completion
    const profileFields = ['gpa', 'gmat', 'years_exp', 'industry', 'goals'];
    const completedFields = profileFields.filter(field => this.profile[field as keyof ProfileData]);
    const completionRate = (completedFields.length / profileFields.length) * 100;

    if (completionRate < 80) {
      insights.push({
        type: 'suggestion',
        title: "Complete your profile",
        description: `Your profile is ${Math.round(completionRate)}% complete. Add missing information for better predictions.`,
        action: {
          label: "Update Profile",
          href: "/dashboard"
        },
        urgency: 'low',
        icon: 'user',
        confidence: 0.85,
        category: 'profile'
      });
    }

    return insights;
  }

  private generateAchievementInsights(): AIInsight[] {
    const insights: AIInsight[] = [];
    const completedEssays = this.essays.filter(e => e.status === 'completed').length;
    const completedRecommendations = this.assignments.filter(a => a.status === 'completed').length;

    // Milestone achievements
    if (completedEssays >= 5) {
      insights.push({
        type: 'achievement',
        title: "Essay writing milestone!",
        description: `You've completed ${completedEssays} essays. Great progress on your MBA applications!`,
        action: {
          label: "View Progress",
          href: "/dashboard/applications"
        },
        urgency: 'low',
        icon: 'award',
        confidence: 0.9,
        category: 'essays'
      });
    }

    if (completedRecommendations >= 3) {
      insights.push({
        type: 'achievement',
        title: "Recommendations secured!",
        description: `You have ${completedRecommendations} completed recommendations. Strong support network!`,
        action: {
          label: "View Recommendations",
          href: "/dashboard/recommendations"
        },
        urgency: 'low',
        icon: 'check-circle',
        confidence: 0.9,
        category: 'recommendations'
      });
    }

    return insights;
  }

  // Future: AI-powered insights
  async generateAIInsights(): Promise<AIInsight[]> {
    // This is where you'd integrate with OpenAI, Claude, or other AI services
    // For now, return the rule-based insights
    return this.generateInsights();
  }
} 