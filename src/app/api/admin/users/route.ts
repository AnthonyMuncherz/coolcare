import { NextResponse } from 'next/server';
import { getAllUsers, createUser } from '@/lib/admin';
import { requireAuth } from '@/lib/auth';

// GET route to fetch all users
export async function GET() {
  try {
    // Check if user is authenticated and is an admin
    const currentUser = await requireAuth();
    
    if (currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }
    
    const users = await getAllUsers();
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST route to create a new user
export async function POST(request: Request) {
  try {
    // Check if user is authenticated and is an admin
    const currentUser = await requireAuth();
    
    if (currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }
    
    const { name, email, password, role, phone, address } = await request.json();
    
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Name, email, password, and role are required' },
        { status: 400 }
      );
    }
    
    const result = await createUser(name, email, password, role, phone, address);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ message: result.message }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
} 