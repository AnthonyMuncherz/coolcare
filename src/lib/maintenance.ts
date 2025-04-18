"use server";

import { getDb, closeDb } from '@/lib/db/index';

export interface MaintenanceSchedule {
  id: number;
  user_id: number;
  subscription_id: number;
  scheduled_date: string;
  scheduled_time?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'in_progress';
  technician_id?: number;
  technician_name?: string;
  customer_name?: string;
  maintenance_type?: string;
  notes?: string;
  created_at: string;
}

// Get all maintenance schedules for admin dashboard
export async function getAllMaintenanceVisits(): Promise<MaintenanceSchedule[]> {
  const db = await getDb();
  
  try {
    // Check if maintenance_schedules table exists
    const tableInfo = await db.get(`
      SELECT name 
      FROM sqlite_master 
      WHERE type='table' AND name='maintenance_schedules'
    `);
    
    if (!tableInfo) {
      console.log('Maintenance schedules table does not exist yet');
      return [];
    }
    
    // Get all maintenance schedules with user and technician information
    const schedules = await db.all(`
      SELECT ms.*, 
             u.name as customer_name,
             t.name as technician_name,
             p.name as maintenance_type
      FROM maintenance_schedules ms
      LEFT JOIN users u ON ms.user_id = u.id
      LEFT JOIN users t ON ms.technician_id = t.id
      LEFT JOIN plans p ON ms.subscription_id = p.id
      ORDER BY ms.scheduled_date DESC
    `);
    
    return schedules || [];
  } catch (error) {
    console.error('Error getting all maintenance visits:', error);
    return [];
  } finally {
    await closeDb(db);
  }
}

// Get user's maintenance schedules
export async function getMaintenanceSchedules(userId: number): Promise<MaintenanceSchedule[]> {
  const db = await getDb();
  
  try {
    // Check if maintenance_schedules table exists
    const tableInfo = await db.get(`
      SELECT name 
      FROM sqlite_master 
      WHERE type='table' AND name='maintenance_schedules'
    `);
    
    if (!tableInfo) {
      console.log('Maintenance schedules table does not exist yet');
      return [];
    }
    
    // Check if the table has the expected user_id column
    try {
      const columnInfo = await db.all(`PRAGMA table_info(maintenance_schedules)`);
      const hasUserIdColumn = columnInfo.some((col: any) => col.name === 'user_id');
      
      if (!hasUserIdColumn) {
        console.log('Maintenance schedules table does not have user_id column yet');
        return [];
      }
      
      const schedules = await db.all(`
        SELECT * 
        FROM maintenance_schedules
        WHERE user_id = ?
        ORDER BY scheduled_date DESC
      `, userId);
      
      return schedules || [];
    } catch (error) {
      console.error('Error checking maintenance_schedules schema:', error);
      return [];
    }
  } catch (error) {
    console.error('Error getting maintenance schedules:', error);
    return [];
  } finally {
    await closeDb(db);
  }
}

// Get a single maintenance schedule by ID
export async function getMaintenanceScheduleById(id: number): Promise<MaintenanceSchedule | null> {
  const db = await getDb();
  
  try {
    const schedule = await db.get(`
      SELECT * 
      FROM maintenance_schedules
      WHERE id = ?
    `, id);
    
    return schedule;
  } catch (error) {
    console.error('Error getting maintenance schedule:', error);
    return null;
  } finally {
    await closeDb(db);
  }
}

// Create a new maintenance schedule
export async function createMaintenanceSchedule(data: {
  userId: number;
  subscriptionId: number;
  scheduledDate: string;
  scheduledTime?: string;
  technicianId?: number;
  notes?: string;
}): Promise<{ success: boolean; message: string; id?: number }> {
  const db = await getDb();
  
  try {
    const result = await db.run(`
      INSERT INTO maintenance_schedules (
        user_id, subscription_id, scheduled_date, scheduled_time, status, technician_id, notes
      ) VALUES (?, ?, ?, ?, 'scheduled', ?, ?)
    `, [
      data.userId,
      data.subscriptionId,
      data.scheduledDate,
      data.scheduledTime || null,
      data.technicianId || null,
      data.notes || null
    ]);
    
    return { 
      success: true, 
      message: 'Maintenance schedule created successfully',
      id: result.lastID
    };
  } catch (error) {
    console.error('Error creating maintenance schedule:', error);
    return { 
      success: false, 
      message: 'Failed to create maintenance schedule'
    };
  } finally {
    await closeDb(db);
  }
}

// Update a maintenance schedule status
export async function updateMaintenanceScheduleStatus(
  id: number, 
  status: 'scheduled' | 'completed' | 'cancelled' | 'in_progress',
  technicianName?: string,
  notes?: string
): Promise<{ success: boolean; message: string }> {
  const db = await getDb();
  
  try {
    await db.run(`
      UPDATE maintenance_schedules
      SET status = ?, technician_name = ?, notes = ?
      WHERE id = ?
    `, [status, technicianName || null, notes || null, id]);
    
    return { 
      success: true, 
      message: 'Maintenance schedule updated successfully'
    };
  } catch (error) {
    console.error('Error updating maintenance schedule:', error);
    return { 
      success: false, 
      message: 'Failed to update maintenance schedule'
    };
  } finally {
    await closeDb(db);
  }
} 