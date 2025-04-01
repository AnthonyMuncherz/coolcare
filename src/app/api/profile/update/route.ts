import { NextResponse } from 'next/server';
import { getDb, closeDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // Get current user
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'User not authenticated'
      }, { status: 401 });
    }
    
    // Get request data
    const { name, phone, address } = await request.json();
    
    // Validate input
    if (!name) {
      return NextResponse.json({ 
        success: false, 
        message: 'Name is required'
      }, { status: 400 });
    }
    
    const db = await getDb();
    
    try {
      // Update user in database
      await db.run(
        `UPDATE users 
         SET name = ?, phone = ?, address = ?
         WHERE id = ?`,
        [name, phone || null, address || null, user.id]
      );
      
      return NextResponse.json({
        success: true,
        message: 'Profile updated successfully'
      }, { status: 200 });
    } catch (error) {
      console.error('Database error:', error);
      return NextResponse.json({
        success: false,
        message: 'Database error occurred'
      }, { status: 500 });
    } finally {
      await closeDb(db);
    }
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while processing your request'
    }, { status: 500 });
  }
} 