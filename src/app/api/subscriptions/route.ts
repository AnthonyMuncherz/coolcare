import { NextResponse } from 'next/server';
import { getDb, closeDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { userId, planId, paymentMethod } = await request.json();
    
    // Validate input
    if (!userId || !planId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Missing required fields'
      }, { status: 400 });
    }
    
    // Simulate payment processing
    // In a real system, this would interact with a payment gateway
    
    const db = await getDb();
    
    try {
      // Get current date for subscription start
      const currentDate = new Date();
      const startDate = currentDate.toISOString();
      
      // Set end date to 1 month from now
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
      
      // Create subscription in database
      const result = await db.run(
        `INSERT INTO subscriptions 
         (user_id, plan_id, status, payment_method, start_date, end_date, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          userId, 
          planId, 
          'active', 
          paymentMethod || 'website', // Default to 'website' if payment method is not provided
          startDate, 
          endDate.toISOString(), 
          startDate
        ]
      );
      
      if (result.lastID) {
        return NextResponse.json({
          success: true,
          message: 'Subscription created successfully'
        }, { status: 201 });
      } else {
        return NextResponse.json({
          success: false,
          message: 'Failed to create subscription'
        }, { status: 500 });
      }
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
    console.error('Subscription error:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while processing your request'
    }, { status: 500 });
  }
} 