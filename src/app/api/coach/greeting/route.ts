import { NextRequest, NextResponse } from 'next/server';
import { requireAuthedProfile } from '@/lib/authz';
import { getPersonalizedGreeting } from '@/lib/coach-personalization';

export async function GET(request: NextRequest) {
  try {
    const { profile } = await requireAuthedProfile();
    
    const greeting = await getPersonalizedGreeting(profile.id);
    
    return NextResponse.json({ greeting });
  } catch (error) {
    console.error('Error getting personalized greeting:', error);
    return NextResponse.json({ 
      greeting: "Hello! I'm The Admit Planner, and I'm here to help you with your college application process." 
    });
  }
}
