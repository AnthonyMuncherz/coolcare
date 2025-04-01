import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { cancelServiceRequest } from '@/lib/service-requests';

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
    const requestId = formData.get('requestId') as string;
    
    if (!requestId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Request ID is required'
      }, { status: 400 });
    }
    
    // Cancel the service request
    const result = await cancelServiceRequest(parseInt(requestId), user.id);
    
    if (result.success) {
      // Redirect back to service requests page with success message
      return NextResponse.redirect(new URL('/dashboard/service-requests?cancelled=true', request.url));
    } else {
      return NextResponse.json({
        success: false,
        message: result.message
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Service request cancellation error:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while processing your request'
    }, { status: 500 });
  }
} 