import { NextResponse } from 'next/server';
import { getDb, closeDb } from '@/lib/db';
import { getUserSubscription } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { userId, serviceId, description, preferredDate, preferredTime, address } = await request.json();
    
    // Validate input
    if (!userId || !serviceId || !description || !preferredDate) {
      return NextResponse.json({ 
        success: false, 
        message: 'Missing required fields'
      }, { status: 400 });
    }
    
    // Check if user has active subscription
    const subscription = await getUserSubscription(userId);
    
    if (!subscription) {
      return NextResponse.json({ 
        success: false, 
        message: 'Active subscription required to make service requests'
      }, { status: 403 });
    }
    
    const db = await getDb();
    
    try {
      // Current date for created_at
      const currentDate = new Date().toISOString();
      
      // Insert the service request
      const result = await db.run(
        `INSERT INTO service_requests 
         (user_id, service_id, description, preferred_date, preferred_time, address, status, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId, 
          serviceId, 
          description, 
          preferredDate, 
          preferredTime || null, 
          address || null, 
          'pending', 
          currentDate
        ]
      );
      
      if (result.lastID) {
        return NextResponse.json({
          success: true,
          message: 'Service request submitted successfully',
          requestId: result.lastID
        }, { status: 201 });
      } else {
        return NextResponse.json({
          success: false,
          message: 'Failed to submit service request'
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
    console.error('Service request error:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while processing your request'
    }, { status: 500 });
  }
} 