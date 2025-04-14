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
    
    // Get form data
    const formData = await request.formData();
    const subscriptionId = formData.get('subscriptionId') as string;
    
    if (!subscriptionId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Subscription ID is required'
      }, { status: 400 });
    }
    
    const db = await getDb();
    
    try {
      // First check if the subscription belongs to the user
      const subscription = await db.get(
        'SELECT * FROM subscriptions WHERE id = ? AND user_id = ?',
        [subscriptionId, user.id]
      );
      
      if (!subscription) {
        return NextResponse.json({ 
          success: false, 
          message: 'Subscription not found or does not belong to this user'
        }, { status: 404 });
      }
      
      // Update subscription status to cancelled
      await db.run(
        'UPDATE subscriptions SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        ['cancelled', subscriptionId]
      );
      
      // Return success response instead of redirecting
      return NextResponse.json({ success: true }, { status: 200 });
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
    console.error('Subscription cancellation error:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while processing your request'
    }, { status: 500 });
  }
} 