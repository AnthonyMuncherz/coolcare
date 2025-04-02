import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createMaintenanceSchedule } from '@/lib/maintenance';

export async function POST(request: Request) {
  try {
    // Check if user is authenticated and is an admin
    const user = await requireAuth();
    
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }
    
    const formData = await request.formData();
    
    const userId = formData.get('userId')?.toString();
    const scheduledDate = formData.get('scheduledDate')?.toString();
    const scheduledTime = formData.get('scheduledTime')?.toString();
    const technicianId = formData.get('technicianId')?.toString();
    const notes = formData.get('notes')?.toString();
    
    if (!userId || !scheduledDate) {
      return NextResponse.json(
        { error: 'User ID and scheduled date are required' },
        { status: 400 }
      );
    }
    
    // Use dummy subscription ID for now (in production you'd need to get a valid subscription)
    // or create a new endpoint that doesn't require a subscription ID
    const subscriptionId = 1;
    
    const result = await createMaintenanceSchedule({
      userId: parseInt(userId),
      subscriptionId,
      scheduledDate,
      scheduledTime: scheduledTime || undefined,
      technicianId: technicianId ? parseInt(technicianId) : undefined,
      notes: notes || undefined,
    });
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Maintenance visit scheduled successfully',
      id: result.id
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating maintenance schedule:', error);
    return NextResponse.json(
      { error: 'Failed to create maintenance schedule' },
      { status: 500 }
    );
  }
} 