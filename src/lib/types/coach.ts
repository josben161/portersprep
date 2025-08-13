// Coach system types
export interface CoachConversation {
  id: string;
  user_id: string;
  message: string;
  response: string;
  context: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CoachMemory {
  id: string;
  user_id: string;
  memory_type: 'preference' | 'insight' | 'progress' | 'goal';
  content: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CoachContext {
  user: {
    profile: any;
    applications: any[];
    essays: any[];
    recommendations: any[];
    progress: any;
  };
  schools: {
    targetSchools: any[];
    requirements: any[];
    deadlines: any[];
  };
  session: {
    conversationHistory: CoachConversation[];
    userPreferences: any;
    learningMemory: CoachMemory[];
  };
}

export interface CoachMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface CoachResponse {
  message: string;
  context?: Record<string, any>;
  nextSteps?: string[];
  insights?: string[];
} 