"use server";

import { getDb, closeDb } from '@/lib/db/index';
import { User } from '@/lib/auth';
import { hashPassword } from '@/lib/auth';

// Get all users
export async function getAllUsers(): Promise<User[]> {
  const db = await getDb();
  
  try {
    const users = await db.all(
      'SELECT id, name, email, phone, address, role, created_at FROM users ORDER BY id ASC'
    );
    
    return users as User[];
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  } finally {
    await closeDb(db);
  }
}

// Get user by ID
export async function getUserById(id: number): Promise<User | null> {
  const db = await getDb();
  
  try {
    const user = await db.get(
      'SELECT id, name, email, phone, address, role, created_at FROM users WHERE id = ?',
      [id]
    );
    
    if (!user) {
      return null;
    }
    
    return user as User;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  } finally {
    await closeDb(db);
  }
}

// Update user
export async function updateUser(
  id: number, 
  data: { 
    name?: string; 
    email?: string; 
    phone?: string; 
    address?: string; 
    role?: string;
    password?: string;
  }
) {
  const db = await getDb();
  
  try {
    // Prepare update query parts
    const updates: string[] = [];
    const values: any[] = [];
    
    if (data.name) {
      updates.push('name = ?');
      values.push(data.name);
    }
    
    if (data.email) {
      updates.push('email = ?');
      values.push(data.email);
    }
    
    if (data.phone !== undefined) {
      updates.push('phone = ?');
      values.push(data.phone || null);
    }
    
    if (data.address !== undefined) {
      updates.push('address = ?');
      values.push(data.address || null);
    }
    
    if (data.role) {
      updates.push('role = ?');
      values.push(data.role);
    }
    
    if (data.password) {
      updates.push('password = ?');
      values.push(await hashPassword(data.password));
    }
    
    if (updates.length === 0) {
      return { success: false, message: 'No data provided for update' };
    }
    
    // Add ID to values array
    values.push(id);
    
    // Execute update query
    await db.run(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    
    return { success: true, message: 'User updated successfully' };
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, message: 'An error occurred while updating user' };
  } finally {
    await closeDb(db);
  }
}

// Delete user
export async function deleteUser(id: number) {
  const db = await getDb();
  
  try {
    await db.run('DELETE FROM users WHERE id = ?', [id]);
    return { success: true, message: 'User deleted successfully' };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, message: 'An error occurred while deleting user' };
  } finally {
    await closeDb(db);
  }
}

// Create a new user (for admin)
export async function createUser(
  name: string, 
  email: string, 
  password: string, 
  role: string = 'client', 
  phone?: string, 
  address?: string
) {
  const db = await getDb();
  const hashedPassword = await hashPassword(password);
  
  try {
    // Check if user already exists
    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return { success: false, message: 'User with this email already exists' };
    }
    
    // Insert new user
    await db.run(
      'INSERT INTO users (name, email, password, role, phone, address) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, role, phone || null, address || null]
    );
    
    return { success: true, message: 'User created successfully' };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, message: 'An error occurred during user creation' };
  } finally {
    await closeDb(db);
  }
} 