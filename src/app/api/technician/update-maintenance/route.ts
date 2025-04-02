import { NextRequest, NextResponse } from 'next/server';
import { updateMaintenanceStatus } from '@/lib/technician';
import { requireAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated and is a technician
    const user = await requireAuth();
    
    if (user.role !== 'technician') {
      return NextResponse.json(
        { message: 'Unauthorized access. Only technicians can update maintenance visits.' },
        { status: 403 }
      );
    }
    
    // Parse request body
    const data = await request.json();
    
    // Validate required fields
    if (!data.maintenanceId || !data.status) {
      return NextResponse.json(
        { message: 'Missing required fields.' },
        { status: 400 }
      );
    }
    
    // Update the maintenance status
    const result = await updateMaintenanceStatus(
      parseInt(data.maintenanceId, 10),
      data.status,
      data.notes
    );
    
    if (result.success) {
      return NextResponse.json(
        { message: result.message || 'Maintenance visit updated successfully' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: result.message || 'Failed to update maintenance visit' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error updating maintenance visit:', error);
    return NextResponse.json(
      { message: 'An error occurred while updating the maintenance visit' },
      { status: 500 }
    );
  }
} 