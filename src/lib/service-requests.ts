"use server";

import { getDb, closeDb } from '@/lib/db/index';

export interface ServiceRequest {
  id: number;
  user_id: number;
  service_id: number;
  service_name?: string;
  description: string;
  preferred_date: string;
  preferred_time?: string;
  address?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  technician_notes?: string;
  created_at: string;
  updated_at?: string;
}

// Get a service request by ID, ensuring it belongs to the specified user
export async function getServiceRequestById(requestId: number, userId: number): Promise<ServiceRequest | null> {
  const db = await getDb();
  
  try {
    const request = await db.get(`
      SELECT sr.*, s.name as service_name
      FROM service_requests sr
      JOIN services s ON sr.service_id = s.id
      WHERE sr.id = ? AND sr.user_id = ?
    `, [requestId, userId]);
    
    return request;
  } catch (error) {
    console.error('Error getting service request by ID:', error);
    return null;
  } finally {
    await closeDb(db);
  }
}

// Create a new service request
export async function createServiceRequest(data: {
  userId: number;
  serviceId: number;
  description: string;
  preferredDate: string;
  preferredTime?: string;
  address?: string;
}): Promise<{ success: boolean; message: string; id?: number }> {
  const db = await getDb();
  
  try {
    const result = await db.run(`
      INSERT INTO service_requests (
        user_id, service_id, description, preferred_date, 
        preferred_time, address, status
      ) VALUES (?, ?, ?, ?, ?, ?, 'pending')
    `, [
      data.userId,
      data.serviceId,
      data.description,
      data.preferredDate,
      data.preferredTime || null,
      data.address || null
    ]);
    
    return { 
      success: true, 
      message: 'Service request created successfully',
      id: result.lastID
    };
  } catch (error) {
    console.error('Error creating service request:', error);
    return { 
      success: false, 
      message: 'Failed to create service request'
    };
  } finally {
    await closeDb(db);
  }
}

// Cancel a service request
export async function cancelServiceRequest(
  requestId: number, 
  userId: number
): Promise<{ success: boolean; message: string }> {
  const db = await getDb();
  
  try {
    // First check if the request belongs to the user and is in pending status
    const request = await db.get(
      'SELECT * FROM service_requests WHERE id = ? AND user_id = ? AND status = "pending"',
      [requestId, userId]
    );
    
    if (!request) {
      return { 
        success: false, 
        message: 'Service request not found or cannot be cancelled'
      };
    }
    
    // Update request status to cancelled
    await db.run(
      'UPDATE service_requests SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['cancelled', requestId]
    );
    
    return { 
      success: true, 
      message: 'Service request cancelled successfully'
    };
  } catch (error) {
    console.error('Error cancelling service request:', error);
    return { 
      success: false, 
      message: 'Failed to cancel service request'
    };
  } finally {
    await closeDb(db);
  }
} 