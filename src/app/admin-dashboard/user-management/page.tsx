import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UserManagement from '@/components/UserManagement';
import { getAllUsers } from '@/lib/admin';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import LogoutButton from '@/components/LogoutButton';

export const metadata: Metadata = {
  title: 'User Management - Admin Dashboard - CoolCare',
  description: 'Manage system users including clients, technicians, and administrators',
};

export default async function UserManagementPage() {
  // Check if user is authenticated and is an admin
  const user = await requireAuth();
  
  // If user is not an admin, redirect to dashboard
  if (user.role !== 'admin') {
    redirect('/dashboard');
  }
  
  // Get all users for the user management section
  const users = await getAllUsers();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <Link 
                    href="/admin-dashboard" 
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-2"
                  >
                    <ArrowLeftIcon className="h-4 w-4 mr-1" />
                    Back to Dashboard
                  </Link>
                  <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                </div>
                
                <LogoutButton />
              </div>
            </div>
            
            {/* User Management Section */}
            <div>
              <UserManagement initialUsers={users} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 