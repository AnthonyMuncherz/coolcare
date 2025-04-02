import { NextRequest, NextResponse } from 'next/server';
import { scheduleMaintenanceVisit } from '@/lib/technician';
import { requireAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated and is a technician
    const user = await requireAuth();
    
    if (user.role !== 'technician') {
      return NextResponse.json(
        { message: 'Unauthorized access. Only technicians can schedule maintenance visits.' },
        { status: 403 }
      );
    }
    
    // Parse request body
    const data = await request.json();
    
    // Validate required fields
    if (!data.subscriptionId || !data.userId || !data.scheduledDate || !data.technicianName) {
      return NextResponse.json(
        { message: 'Missing required fields. Please fill in all required information.' },
        { status: 400 }
      );
    }
    
    // Convert data to expected format
    const maintenanceData = {
      userId: parseInt(data.userId, 10),
      subscriptionId: parseInt(data.subscriptionId, 10),
      scheduledDate: data.scheduledDate,
      scheduledTime: data.scheduledTime || undefined,
      technicianName: data.technicianName,
      notes: data.notes || undefined
    };
    
    // Schedule the maintenance visit
    const result = await scheduleMaintenanceVisit(maintenanceData);
    
    if (result.success) {
      return NextResponse.json(
        { 
          message: 'Maintenance visit scheduled successfully', 
          id: result.id 
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: result.message || 'Failed to schedule maintenance visit' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error scheduling maintenance visit:', error);
    return NextResponse.json(
      { message: 'An error occurred while scheduling the maintenance visit' },
      { status: 500 }
    );
  }
} 