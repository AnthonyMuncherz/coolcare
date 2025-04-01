import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { updateMaintenanceStatus } from '@/lib/technician';

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
    const scheduleId = formData.get('scheduleId');
    const status = formData.get('status');
    const notes = formData.get('notes') || '';
    
    // Validate inputs
    if (!scheduleId || !status) {
      return NextResponse.json(
        { success: false, message: 'Schedule ID and status are required' },
        { status: 400 }
      );
    }
    
    // Parse scheduleId to number
    const scheduleIdNum = parseInt(scheduleId.toString());
    
    if (isNaN(scheduleIdNum)) {
      return NextResponse.json(
        { success: false, message: 'Invalid Schedule ID' },
        { status: 400 }
      );
    }
    
    // Validate status
    const validStatuses = ['scheduled', 'completed', 'cancelled'];
    if (!validStatuses.includes(status.toString())) {
      return NextResponse.json(
        { success: false, message: 'Invalid status value' },
        { status: 400 }
      );
    }
    
    // Update maintenance status
    const result = await updateMaintenanceStatus(
      scheduleIdNum,
      status.toString() as 'scheduled' | 'completed' | 'cancelled',
      notes.toString()
    );
    
    if (result.success) {
      return NextResponse.json(
        { success: true, message: result.message },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error updating maintenance status:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process request' },
      { status: 500 }
    );
  }
} 