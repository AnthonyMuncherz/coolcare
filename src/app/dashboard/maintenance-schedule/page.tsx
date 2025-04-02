import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import { getAllMaintenanceSchedules } from '@/lib/technician';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardSidebar from '@/components/DashboardSidebar';
import Link from 'next/link';
import { format } from 'date-fns';

export const metadata: Metadata = {
  title: 'Maintenance Schedule - CoolCare',
  description: 'View and manage customer maintenance schedules',
};

export default async function MaintenanceSchedulePage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  // Check if user is authenticated and is a technician
  const user = await requireAuth();
  
  if (user.role !== 'technician') {
    redirect('/dashboard');
  }
  
  // Extract sort parameters - properly await them in Next.js 15
  const sortParams = await Promise.resolve(searchParams);
  const sortBy = typeof sortParams.sort === 'string' ? sortParams.sort : 'date';
  const sortOrder = typeof sortParams.order === 'string' ? sortParams.order : 'asc';
  
  // Get all maintenance schedules
  const maintenanceSchedules = await getAllMaintenanceSchedules();
  
  // Sort schedules based on parameters
  const sortedSchedules = [...maintenanceSchedules].sort((a, b) => {
    if (sortBy === 'customer') {
      return sortOrder === 'asc' 
        ? a.user_name.localeCompare(b.user_name)
        : b.user_name.localeCompare(a.user_name);
    } else if (sortBy === 'status') {
      return sortOrder === 'asc'
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    } else {
      // Default sort by date
      const dateA = new Date(a.scheduled_date);
      const dateB = new Date(b.scheduled_date);
      return sortOrder === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    }
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900">Maintenance Schedule</h1>
              <Link 
                href="/dashboard/maintenance-schedule/new" 
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Schedule Maintenance Visit
              </Link>
            </div>
            
            <div className="mt-6 flex flex-col lg:flex-row gap-6">
              {/* Sidebar */}
              <DashboardSidebar user={user} activePage="maintenance-schedule" />
              
              {/* Main content */}
              <div className="flex-1">
                {/* Sort controls */}
                <div className="flex justify-end mb-4 space-x-2">
                  <Link 
                    href="/dashboard/maintenance-schedule?sort=date&order=asc" 
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Date ↑
                  </Link>
                  <Link 
                    href="/dashboard/maintenance-schedule?sort=date&order=desc" 
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Date ↓
                  </Link>
                  <Link 
                    href="/dashboard/maintenance-schedule?sort=status&order=asc" 
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Status ↑
                  </Link>
                  <Link 
                    href="/dashboard/maintenance-schedule?sort=customer&order=asc" 
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Customer ↑
                  </Link>
                </div>
                
                {sortedSchedules.length > 0 ? (
                  <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date & Time
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Technician
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
                        {sortedSchedules.map((schedule) => (
                          <tr key={schedule.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{schedule.user_name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {format(new Date(schedule.scheduled_date), 'MMM d, yyyy')}
                              </div>
                              <div className="text-sm text-gray-500">
                                {schedule.scheduled_time || 'Flexible'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{schedule.technician_name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                schedule.status === 'completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : schedule.status === 'cancelled' 
                                  ? 'bg-gray-100 text-gray-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <Link 
                                href={`/dashboard/maintenance/${schedule.id}`} 
                                className="text-blue-600 hover:text-blue-900 mr-4"
                              >
                                View
                              </Link>
                              {schedule.status !== 'completed' && schedule.status !== 'cancelled' && (
                                <Link 
                                  href={`/dashboard/maintenance/${schedule.id}/update`} 
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  Update
                                </Link>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                      <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No maintenance visits scheduled</h3>
                    <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                      There are no maintenance visits scheduled at this time.
                    </p>
                    <div className="mt-6">
                      <Link 
                        href="/dashboard/maintenance-schedule/new" 
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Schedule Maintenance Visit
                      </Link>
                    </div>
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