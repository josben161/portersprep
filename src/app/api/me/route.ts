import { NextResponse } from 'next/server';
import { requireAuthedProfile } from '@/lib/authz';

export async function GET() {
  try {
    const { profile } = await requireAuthedProfile();
    
    return NextResponse.json({
      profile: {
        id: profile.id,
        name: profile.name,
        email: profile.email
      }
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    return NextResponse.json(
      { error: 'Failed to get user profile' },
      { status: 500 }
    );
  }
} 