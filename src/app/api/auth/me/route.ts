import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (user) {
      // Return only safe user information
      const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      
      return NextResponse.json(
        { success: true, user: safeUser },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while checking authentication' },
      { status: 500 }
    );
  }
} 