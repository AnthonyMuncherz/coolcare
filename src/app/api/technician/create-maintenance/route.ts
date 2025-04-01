import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { scheduleMaintenanceVisit } from '@/lib/technician';

export async function POST(request: Request) {
  try {
    // Check if user is authenticated and is a technician
    const user = await requireAuth();
    
    if (user.role !== 'technician') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get form data
    const formData = await request.formData();
    const userId = formData.get('userId');
    const subscriptionId = formData.get('subscriptionId');
    const scheduledDate = formData.get('scheduledDate');
    const scheduledTime = formData.get('scheduledTime');
    const technicianName = formData.get('technicianName') || user.name;
    const notes = formData.get('notes') || '';
    
    // Validate inputs
    if (!userId || !subscriptionId || !scheduledDate) {
      return NextResponse.json(
        { success: false, message: 'User ID, subscription ID, and date are required' },
        { status: 400 }
      );
    }
    
    // Parse IDs to numbers
    const userIdNum = parseInt(userId.toString());
    const subscriptionIdNum = parseInt(subscriptionId.toString());
    
    if (isNaN(userIdNum) || isNaN(subscriptionIdNum)) {
      return NextResponse.json(
        { success: false, message: 'Invalid user ID or subscription ID' },
        { status: 400 }
      );
    }
    
    // Create maintenance schedule
    const result = await scheduleMaintenanceVisit({
      userId: userIdNum,
      subscriptionId: subscriptionIdNum,
      scheduledDate: scheduledDate.toString(),
      scheduledTime: scheduledTime?.toString(),
      technicianName: technicianName.toString(),
      notes: notes.toString()
    });
    
    if (result.success) {
      return NextResponse.json(
        { success: true, message: result.message, id: result.id },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error scheduling maintenance visit:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process request' },
      { status: 500 }
    );
  }
} 