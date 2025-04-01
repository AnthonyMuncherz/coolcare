import { NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Login user
    const result = await loginUser(email, password);
    
    if (result.success) {
      // Don't include the full user object in the response for security
      const { user, ...rest } = result;
      const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      
      return NextResponse.json(
        { success: true, message: 'Login successful', user: safeUser },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during login' },
      { status: 500 }
    );
  }
} 