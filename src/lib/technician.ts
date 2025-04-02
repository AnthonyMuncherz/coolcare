"use server";

import { getDb, closeDb } from '@/lib/db/index';

export interface TechnicianServiceRequest {
  id: number;
  user_id: number;
  user_name: string;
  email: string;
  phone?: string;
  service_id: number;
  service_name: string;
  description: string;
  preferred_date: string;
  preferred_time?: string;
  address?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  technician_notes?: string;
  created_at: string;
  updated_at?: string;
}

// Get all service requests for technicians to manage
export async function getTechnicianServiceRequests(): Promise<TechnicianServiceRequest[]> {
  const db = await getDb();
  
  try {
    const requests = await db.all(`
      SELECT sr.*, s.name as service_name, u.name as user_name
      FROM service_requests sr
      JOIN services s ON sr.service_id = s.id
      JOIN users u ON sr.user_id = u.id
      WHERE sr.status IN ('pending', 'in_progress')
      ORDER BY 
        CASE sr.status
          WHEN 'pending' THEN 1
          WHEN 'in_progress' THEN 2
          ELSE 3
        END,
        sr.preferred_date ASC
    `);
    
    return requests;
  } catch (error) {
    console.error('Error getting technician service requests:', error);
    return [];
  } finally {
    await closeDb(db);
  }
}

// Get a specific service request with full details
export async function getServiceRequestDetail(requestId: number): Promise<TechnicianServiceRequest | null> {
  const db = await getDb();
  
  try {
    const request = await db.get(`
      SELECT sr.*, s.name as service_name, u.name as user_name, u.phone, u.email, u.address as user_address
      FROM service_requests sr
      JOIN services s ON sr.service_id = s.id
      JOIN users u ON sr.user_id = u.id
      WHERE sr.id = ?
    `, [requestId]);
    
    return request;
  } catch (error) {
    console.error('Error getting service request detail:', error);
    return null;
  } finally {
    await closeDb(db);
  }
}

// Update service request status and add technician notes
export async function updateServiceRequestStatus(
  requestId: number,
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled',
  technicianNotes?: string
): Promise<{ success: boolean; message: string }> {
  const db = await getDb();
  
  try {
    await db.run(`
      UPDATE service_requests
      SET status = ?, technician_notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [status, technicianNotes || null, requestId]);
    
    return {
      success: true,
      message: `Service request status updated to ${status}`
    };
  } catch (error) {
    console.error('Error updating service request status:', error);
    return {
      success: false,
      message: 'Failed to update service request'
    };
  } finally {
    await closeDb(db);
  }
}

// Get all active subscriptions for scheduling maintenance
export async function getActiveSubscriptions(): Promise<any[]> {
  const db = await getDb();
  
  try {
    const subscriptions = await db.all(`
      SELECT s.id, s.user_id, u.name as user_name, u.email, u.phone, u.address,
             p.name as plan_name, s.start_date, s.end_date
      FROM subscriptions s
      JOIN users u ON s.user_id = u.id
      JOIN plans p ON s.plan_id = p.id
      WHERE s.status = 'active'
      ORDER BY u.name ASC
    `);
    
    return subscriptions;
  } catch (error) {
    console.error('Error getting active subscriptions:', error);
    return [];
  } finally {
    await closeDb(db);
  }
}

// Schedule a maintenance visit
export async function scheduleMaintenanceVisit(data: {
  userId: number;
  subscriptionId: number;
  scheduledDate: string;
  scheduledTime?: string;
  technicianName: string;
  notes?: string;
}): Promise<{ success: boolean; message: string; id?: number }> {
  const db = await getDb();
  
  try {
    const result = await db.run(`
      INSERT INTO maintenance_schedules (
        user_id, subscription_id, scheduled_date, scheduled_time, 
        status, technician_name, notes
      ) VALUES (?, ?, ?, ?, 'scheduled', ?, ?)
    `, [
      data.userId,
      data.subscriptionId,
      data.scheduledDate,
      data.scheduledTime || null,
      data.technicianName,
      data.notes || null
    ]);
    
    return {
      success: true,
      message: 'Maintenance visit scheduled successfully',
      id: result.lastID
    };
  } catch (error) {
    console.error('Error scheduling maintenance visit:', error);
    return {
      success: false,
      message: 'Failed to schedule maintenance visit'
    };
  } finally {
    await closeDb(db);
  }
}

// Get all maintenance schedules
export async function getAllMaintenanceSchedules(): Promise<any[]> {
  const db = await getDb();
  
  try {
    const schedules = await db.all(`
      SELECT ms.*, u.name as user_name
      FROM maintenance_schedules ms
      JOIN users u ON ms.user_id = u.id
      ORDER BY 
        CASE ms.status
          WHEN 'scheduled' THEN 1
          WHEN 'completed' THEN 2
          WHEN 'cancelled' THEN 3
        END,
        ms.scheduled_date ASC
    `);
    
    return schedules;
  } catch (error) {
    console.error('Error getting maintenance schedules:', error);
    return [];
  } finally {
    await closeDb(db);
  }
}

// Update maintenance schedule status
export async function updateMaintenanceStatus(
  scheduleId: number,
  status: 'scheduled' | 'completed' | 'cancelled',
  notes?: string
): Promise<{ success: boolean; message: string }> {
  const db = await getDb();
  
  try {
    await db.run(`
      UPDATE maintenance_schedules
      SET status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [status, notes || null, scheduleId]);
    
    return {
      success: true,
      message: `Maintenance schedule status updated to ${status}`
    };
  } catch (error) {
    console.error('Error updating maintenance status:', error);
    return {
      success: false,
      message: 'Failed to update maintenance schedule'
    };
  } finally {
    await closeDb(db);
  }
}

// Get all service requests with sorting options
export async function getAllServiceRequests(sortBy: string = 'date', sortOrder: string = 'asc'): Promise<TechnicianServiceRequest[]> {
  const db = await getDb();
  
  // Define valid sort columns and default to preferred_date if invalid
  const validSortColumns = {
    'date': 'sr.preferred_date',
    'status': 'sr.status',
    'customer': 'u.name',
    'service': 's.name',
    'id': 'sr.id'
  };
  
  const sortColumn = validSortColumns[sortBy as keyof typeof validSortColumns] || 'sr.preferred_date';
  const order = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
  
  try {
    const requests = await db.all(`
      SELECT sr.*, s.name as service_name, u.name as user_name, u.email, u.phone
      FROM service_requests sr
      JOIN services s ON sr.service_id = s.id
      JOIN users u ON sr.user_id = u.id
      ORDER BY ${sortColumn} ${order}, sr.id ASC
    `);
    
    return requests;
  } catch (error) {
    console.error('Error getting all service requests:', error);
    return [];
  } finally {
    await closeDb(db);
  }
}

// Get maintenance schedule detail
export async function getMaintenanceDetail(scheduleId: number): Promise<any> {
  const db = await getDb();
  
  try {
    const schedule = await db.get(`
      SELECT ms.*, u.name as user_name, u.email, u.phone, u.address
      FROM maintenance_schedules ms
      JOIN users u ON ms.user_id = u.id
      WHERE ms.id = ?
    `, [scheduleId]);
    
    return schedule;
  } catch (error) {
    console.error('Error getting maintenance detail:', error);
    return null;
  } finally {
    await closeDb(db);
  }
} 