import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import CreateMaintenanceForm from '@/components/CreateMaintenanceForm';
import { getAllUsers } from '@/lib/admin';

export const metadata = {
  title: 'Create Maintenance Visit - Admin Dashboard - CoolCare',
  description: 'Schedule a new maintenance visit',
};

export default async function AdminCreateMaintenancePage() {
  // Check if user is authenticated and is an admin
  const user = await requireAuth();
  
  // If user is not an admin, redirect to dashboard
  if (user.role !== 'admin') {
    redirect('/dashboard');
  }
  
  // Get all users for the admin to select a customer
  const users = await getAllUsers();
  const customers = users.filter(u => u.role === 'client');
  
  // Get all technicians
  const technicians = users.filter(u => u.role === 'technician');
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Create Maintenance Visit</h1>
                <p className="mt-1 text-sm text-gray-500">Schedule a new maintenance visit for a customer</p>
              </div>
              <Link 
                href="/admin-dashboard"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Dashboard
              </Link>
            </div>
            
            {/* Create maintenance form */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <CreateMaintenanceForm 
                  customers={customers}
                  technicians={technicians}
                  isAdminView={true}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 