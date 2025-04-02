import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getAllMaintenanceVisits } from '@/lib/maintenance';

export const metadata = {
  title: 'Maintenance Schedule - Admin Dashboard - CoolCare',
  description: 'View and manage all maintenance visits',
};

export default async function AdminMaintenancePage() {
  // Check if user is authenticated and is an admin
  const user = await requireAuth();
  
  // If user is not an admin, redirect to dashboard
  if (user.role !== 'admin') {
    redirect('/dashboard');
  }
  
  // Get all maintenance visits
  const maintenanceVisits = await getAllMaintenanceVisits();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Maintenance Schedule</h1>
                <p className="mt-1 text-sm text-gray-500">View all scheduled maintenance visits</p>
              </div>
              <div className="flex space-x-3">
                <Link 
                  href="/admin-dashboard"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back to Dashboard
                </Link>
                <Link 
                  href="/admin-dashboard/create-maintenance"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Maintenance Visit
                </Link>
              </div>
            </div>
            
            {/* Maintenance visits table */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              {maintenanceVisits.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No maintenance visits scheduled at the moment.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Technician
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {maintenanceVisits.map((visit) => (
                        <tr key={visit.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{visit.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {visit.customer_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {visit.technician_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(visit.scheduled_date).toLocaleDateString()}
                            {' at '}
                            {visit.scheduled_time}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {visit.maintenance_type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              visit.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : visit.status === 'in_progress' 
                                ? 'bg-blue-100 text-blue-800' 
                                : visit.status === 'cancelled' 
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Link 
                              href={`/admin-dashboard/maintenance/${visit.id}`}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              View
                            </Link>
                            <Link 
                              href={`/admin-dashboard/maintenance/${visit.id}/update`}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Update
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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