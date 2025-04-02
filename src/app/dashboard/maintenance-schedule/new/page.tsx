import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import { getActiveSubscriptions } from '@/lib/technician';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardSidebar from '@/components/DashboardSidebar';
import Link from 'next/link';
import NewMaintenanceVisitForm from '@/components/NewMaintenanceVisitForm';

export const metadata: Metadata = {
  title: 'Schedule Maintenance Visit - CoolCare',
  description: 'Schedule a new maintenance visit for a customer',
};

export default async function NewMaintenanceVisitPage() {
  // Check if user is authenticated and is a technician
  const user = await requireAuth();
  
  if (user.role !== 'technician') {
    redirect('/dashboard');
  }
  
  // Get active subscriptions to display in the form
  const activeSubscriptions = await getActiveSubscriptions();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900">Schedule Maintenance Visit</h1>
              <Link 
                href="/dashboard/maintenance-schedule" 
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Back to Maintenance Schedule
              </Link>
            </div>
            
            <div className="mt-6 flex flex-col lg:flex-row gap-6">
              {/* Sidebar */}
              <DashboardSidebar user={user} activePage="maintenance-schedule" />
              
              {/* Main content */}
              <div className="flex-1">
                {activeSubscriptions.length > 0 ? (
                  <div className="bg-white shadow sm:rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">New Maintenance Visit</h2>
                    <NewMaintenanceVisitForm 
                      subscriptions={activeSubscriptions} 
                      technicianName={user.name}
                    />
                  </div>
                ) : (
                  <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                      <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No active subscriptions</h3>
                    <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                      There are no customers with active maintenance subscriptions. Maintenance visits can only be scheduled for customers with active subscription plans.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 