import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { updateServiceRequestStatus } from '@/lib/technician';

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
    const requestId = formData.get('requestId');
    const status = formData.get('status');
    const notes = formData.get('notes') || '';
    
    // Validate inputs
    if (!requestId || !status) {
      return NextResponse.json(
        { success: false, message: 'Request ID and status are required' },
        { status: 400 }
      );
    }
    
    // Parse requestId to number
    const requestIdNum = parseInt(requestId.toString());
    
    if (isNaN(requestIdNum)) {
      return NextResponse.json(
        { success: false, message: 'Invalid Request ID' },
        { status: 400 }
      );
    }
    
    // Validate status
    const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status.toString())) {
      return NextResponse.json(
        { success: false, message: 'Invalid status value' },
        { status: 400 }
      );
    }
    
    // Update service request
    const result = await updateServiceRequestStatus(
      requestIdNum,
      status.toString() as 'pending' | 'in_progress' | 'completed' | 'cancelled',
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
    console.error('Error updating service request:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process request' },
      { status: 500 }
    );
  }
} 