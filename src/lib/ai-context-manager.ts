import { getAdminSupabase } from '@/lib/supabaseAdmin';

export interface UserContext {
  profile: any;
  applications: any[];
  essays: any[];
  recommendations: any[];
  resume: any;
  schools: any[];
  progress: any;
  memory: any[];
  conversations: any[];
}

export interface AIInsight {
  id: string;
  type: 'strength' | 'weakness' | 'opportunity' | 'threat' | 'recommendation';
  category: 'profile' | 'essay' | 'application' | 'recommendation' | 'school' | 'general';
  title: string;
  description: string;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  data: any;
  created_at: string;
  updated_at: string;
}

export interface AIMemory {
  id: string;
  user_id: string;
  memory_type: 'preference' | 'insight' | 'progress' | 'goal' | 'analysis' | 'prediction';
  content: any;
  context: any;
  created_at: string;
  updated_at: string;
}

class AIContextManager {
  private static instance: AIContextManager;
  private contextCache: Map<string, UserContext> = new Map();
  private memoryCache: Map<string, AIMemory[]> = new Map();

  private constructor() {}

  static getInstance(): AIContextManager {
    if (!AIContextManager.instance) {
      AIContextManager.instance = new AIContextManager();
    }
    return AIContextManager.instance;
  }

  async getUserContext(userId: string): Promise<UserContext> {
    // Check cache first
    if (this.contextCache.has(userId)) {
      return this.contextCache.get(userId)!;
    }

    const supabase = getAdminSupabase();
    
    try {
      // Gather all user data in parallel
      const [
        profileResult,
        applicationsResult,
        essaysResult,
        recommendationsResult,
        resumeResult,
        schoolsResult,
        memoryResult,
        conversationsResult
      ] = await Promise.all([
        // User profile
        supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single(),
        
        // Applications
        supabase
          .from('applications')
          .select(`
            *,
            schools (*)
          `)
          .eq('user_id', userId),
        
        // Essays/Answers
        supabase
          .from('answers')
          .select(`
            *,
            questions (*),
            applications (*)
          `)
          .eq('user_id', userId),
        
        // Recommendations
        supabase
          .from('recommender_assignments')
          .select(`
            *,
            recommenders (*),
            applications (*)
          `)
          .eq('user_id', userId),
        
        // Resume data
        supabase
          .from('profiles')
          .select('resume_key, resume_analysis')
          .eq('id', userId)
          .single(),
        
        // Schools
        supabase
          .from('schools')
          .select('*'),
        
        // AI Memory
        supabase
          .from('coach_memory')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(50),
        
        // Recent conversations
        supabase
          .from('coach_conversations')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(20)
      ]);

      // Extract data and handle errors gracefully
      const profile = profileResult.data || {};
      const applications = applicationsResult.data || [];
      const essays = essaysResult.data || [];
      const recommendations = recommendationsResult.data || [];
      const resume = resumeResult.data || {};
      const schools = schoolsResult.data || [];
      const memory = memoryResult.data || [];
      const conversations = conversationsResult.data || [];

      // Calculate progress metrics
      const progress = this.calculateProgress(profile, applications, essays, recommendations);

      const context: UserContext = {
        profile,
        applications,
        essays,
        recommendations,
        resume,
        schools,
        progress,
        memory,
        conversations
      };

      // Cache the context
      this.contextCache.set(userId, context);
      
      return context;
    } catch (error) {
      console.error('Error gathering user context:', error);
      // Return minimal context on error
      return {
        profile: {},
        applications: [],
        essays: [],
        recommendations: [],
        resume: {},
        schools: [],
        progress: {},
        memory: [],
        conversations: []
      };
    }
  }

  async storeMemory(userId: string, memory: Omit<AIMemory, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<void> {
    const supabase = getAdminSupabase();
    
    try {
      const { data, error } = await supabase
        .from('coach_memory')
        .insert({
          user_id: userId,
          memory_type: memory.memory_type,
          content: memory.content,
          context: memory.context
        })
        .select()
        .single();

      if (error) {
        console.error('Error storing memory:', error);
        return;
      }

      // Update cache
      const currentMemory = this.memoryCache.get(userId) || [];
      this.memoryCache.set(userId, [data, ...currentMemory]);

      // Invalidate context cache to ensure fresh data
      this.contextCache.delete(userId);
    } catch (error) {
      console.error('Error storing AI memory:', error);
    }
  }

  async getMemory(userId: string, type?: string): Promise<AIMemory[]> {
    const supabase = getAdminSupabase();
    
    try {
      let query = supabase
        .from('coach_memory')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (type) {
        query = query.eq('memory_type', type);
      }

      const { data, error } = await query.limit(100);

      if (error) {
        console.error('Error fetching memory:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching AI memory:', error);
      return [];
    }
  }

  async updateMemory(memoryId: string, updates: Partial<AIMemory>): Promise<void> {
    const supabase = getAdminSupabase();
    
    try {
      const { error } = await supabase
        .from('coach_memory')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', memoryId);

      if (error) {
        console.error('Error updating memory:', error);
        return;
      }

      // Invalidate caches
      this.contextCache.clear();
      this.memoryCache.clear();
    } catch (error) {
      console.error('Error updating AI memory:', error);
    }
  }

  private calculateProgress(profile: any, applications: any[], essays: any[], recommendations: any[]): any {
    const profileCompleteness = this.calculateProfileCompleteness(profile);
    const applicationProgress = applications.length > 0 ? 
      applications.filter(app => app.status === 'completed').length / applications.length * 100 : 0;
    const essayProgress = essays.length > 0 ? 
      essays.filter(essay => essay.status === 'completed').length / essays.length * 100 : 0;
    const recommendationProgress = recommendations.length > 0 ? 
      recommendations.filter(rec => rec.status === 'completed').length / recommendations.length * 100 : 0;

    return {
      profileCompleteness,
      applicationProgress,
      essayProgress,
      recommendationProgress,
      overallProgress: (profileCompleteness + applicationProgress + essayProgress + recommendationProgress) / 4
    };
  }

  private calculateProfileCompleteness(profile: any): number {
    const fields = ['name', 'email', 'bio', 'academic_interests', 'extracurriculars', 'industry', 'years_exp', 'gpa', 'gmat'];
    const completedFields = fields.filter(field => profile[field] && profile[field].toString().trim() !== '');
    return Math.round((completedFields.length / fields.length) * 100);
  }

  // Clear cache for a specific user (useful when data is updated)
  clearUserCache(userId: string): void {
    this.contextCache.delete(userId);
    this.memoryCache.delete(userId);
  }

  // Clear all caches (useful for debugging or memory management)
  clearAllCaches(): void {
    this.contextCache.clear();
    this.memoryCache.clear();
  }
}

export const aiContextManager = AIContextManager.getInstance(); 