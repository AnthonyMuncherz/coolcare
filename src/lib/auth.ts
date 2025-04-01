"use server";

import { getDb, closeDb } from '@/lib/db/index';
import { cookies } from 'next/headers';
import { createHash } from 'crypto';
import { redirect } from 'next/navigation';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: string;
  created_at: string;
}

// Hash password using SHA-256 (in production, use bcrypt or similar)
export async function hashPassword(password: string): Promise<string> {
  return createHash('sha256').update(password).digest('hex');
}

// Register a new user
export async function registerUser(name: string, email: string, password: string, phone?: string, address?: string) {
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
      'INSERT INTO users (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone || null, address || null]
    );
    
    return { success: true, message: 'User registered successfully' };
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, message: 'An error occurred during registration' };
  } finally {
    await closeDb(db);
  }
}

// Login user
export async function loginUser(email: string, password: string) {
  const db = await getDb();
  const hashedPassword = await hashPassword(password);
  
  try {
    const user = await db.get(
      'SELECT id, name, email, phone, address, role, created_at FROM users WHERE email = ? AND password = ?',
      [email, hashedPassword]
    );
    
    if (!user) {
      return { success: false, message: 'Invalid email or password' };
    }
    
    // Create session (in real app, use proper session management)
    const sessionId = createHash('sha256').update(user.id + Date.now().toString()).digest('hex');
    
    // Store session in cookie
    const cookieStore = await cookies();
    cookieStore.set('session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    
    // Store user ID in cookie as well
    cookieStore.set('userId', user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    
    return { success: true, user, message: 'Login successful' };
  } catch (error) {
    console.error('Error logging in:', error);
    return { success: false, message: 'An error occurred during login' };
  } finally {
    await closeDb(db);
  }
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  
  if (!userId) {
    return null;
  }
  
  const db = await getDb();
  
  try {
    const user = await db.get(
      'SELECT id, name, email, phone, address, role, created_at FROM users WHERE id = ?',
      [userId]
    );
    
    if (!user) {
      return null;
    }
    
    return user as User;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  } finally {
    await closeDb(db);
  }
}

// Logout user
export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  cookieStore.delete('userId');
  return { success: true, message: 'Logged out successfully' };
}

// Check if user is authenticated
export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }
  
  return user;
}

// Get user's subscription
export async function getUserSubscription(userId: number) {
  const db = await getDb();
  
  try {
    // First check if the features column exists in the plans table
    const tableInfo = await db.all("PRAGMA table_info(plans)");
    const hasFeatures = tableInfo.some(column => column.name === 'features');
    
    let subscription;
    if (hasFeatures) {
      subscription = await db.get(`
        SELECT s.*, p.name as plan_name, p.price, p.billing_cycle as billingCycle, p.features
        FROM subscriptions s
        JOIN plans p ON s.plan_id = p.id
        WHERE s.user_id = ? AND s.status = 'active'
        ORDER BY s.start_date DESC LIMIT 1
      `, [userId]);
    } else {
      subscription = await db.get(`
        SELECT s.*, p.name as plan_name, p.price, p.billing_cycle as billingCycle
        FROM subscriptions s
        JOIN plans p ON s.plan_id = p.id
        WHERE s.user_id = ? AND s.status = 'active'
        ORDER BY s.start_date DESC LIMIT 1
      `, [userId]);
      
      // Add empty features array if the column doesn't exist
      if (subscription) {
        subscription.features = JSON.stringify(['Basic maintenance']);
      }
    }
    
    return subscription;
  } catch (error) {
    console.error('Error getting user subscription:', error);
    return null;
  } finally {
    await closeDb(db);
  }
}

// Get user's service requests
export async function getUserServiceRequests(userId: number) {
  const db = await getDb();
  
  try {
    const requests = await db.all(`
      SELECT sr.*, s.name as service_name, s.description
      FROM service_requests sr
      JOIN services s ON sr.service_id = s.id
      WHERE sr.user_id = ?
      ORDER BY sr.created_at DESC
    `, [userId]);
    
    return requests || [];
  } catch (error) {
    console.error('Error getting user service requests:', error);
    return [];
  } finally {
    await closeDb(db);
  }
} 