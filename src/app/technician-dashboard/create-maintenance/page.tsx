import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getActiveSubscriptions } from '@/lib/technician';
import CreateMaintenanceForm from '@/components/CreateMaintenanceForm';

export const metadata: Metadata = {
  title: 'Create Maintenance Visit - CoolCare',
  description: 'Schedule a maintenance visit for a customer',
};

export default async function CreateMaintenancePage() {
  // Check if user is authenticated and is a technician
  const user = await requireAuth();
  
  if (user.role !== 'technician') {
    redirect('/dashboard');
  }
  
  // Get all active subscriptions
  const subscriptions = await getActiveSubscriptions();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900">Schedule Maintenance Visit</h1>
              <Link 
                href="/technician-dashboard" 
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Back to Dashboard
              </Link>
            </div>
            
            <div className="mt-6">
              {subscriptions.length === 0 ? (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-yellow-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No Active Subscriptions</h3>
                  <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                    There are no active subscriptions available to schedule maintenance for.
                  </p>
                </div>
              ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Maintenance Visit Details
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Fill out the form to schedule a maintenance visit for a customer.
                    </p>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <CreateMaintenanceForm 
                      subscriptions={subscriptions}
                      technicianName={user.name}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 