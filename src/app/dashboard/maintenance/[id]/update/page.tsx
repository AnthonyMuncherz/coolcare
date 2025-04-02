import { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import { getMaintenanceDetail } from '@/lib/technician';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardSidebar from '@/components/DashboardSidebar';
import Link from 'next/link';
import UpdateMaintenanceForm from '@/components/UpdateMaintenanceForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Update Maintenance Visit - CoolCare',
  description: 'Update the status and details of a maintenance visit',
};

interface UpdateMaintenancePageProps {
  params: { id: string };
}

export default async function UpdateMaintenancePage({ params }: UpdateMaintenancePageProps) {
  // Check if user is authenticated and is a technician
  const user = await requireAuth();
  
  if (user.role !== 'technician') {
    redirect('/dashboard');
  }
  
  // Process params after an async operation
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams.id;
  const maintenanceId = parseInt(id, 10);
  
  if (isNaN(maintenanceId)) {
    return notFound();
  }
  
  // Get maintenance details
  const maintenance = await getMaintenanceDetail(maintenanceId);
  
  // If maintenance doesn't exist
  if (!maintenance) {
    return notFound();
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900">Update Maintenance Visit</h1>
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
                {/* Maintenance details */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Maintenance Visit Details
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Visit #{maintenance.id}
                      </p>
                    </div>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      maintenance.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : maintenance.status === 'cancelled' 
                        ? 'bg-gray-100 text-gray-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {maintenance.status.charAt(0).toUpperCase() + maintenance.status.slice(1)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200">
                    <dl>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          Customer
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {maintenance.user_name}
                        </dd>
                      </div>
                      <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          Contact Info
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {maintenance.email}<br />
                          {maintenance.phone && `Phone: ${maintenance.phone}`}
                        </dd>
                      </div>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          Scheduled Date/Time
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {new Date(maintenance.scheduled_date).toLocaleDateString()} 
                          {maintenance.scheduled_time && ` at ${maintenance.scheduled_time}`}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
                
                {/* Update Form */}
                <div className="bg-white shadow sm:rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Update Status</h2>
                  <UpdateMaintenanceForm 
                    maintenanceId={maintenance.id}
                    currentStatus={maintenance.status}
                    currentNotes={maintenance.notes || ''}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 