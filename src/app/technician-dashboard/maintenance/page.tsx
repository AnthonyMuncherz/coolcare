import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getAllMaintenanceSchedules } from '@/lib/technician';
import UpdateMaintenanceStatusButton from '@/components/UpdateMaintenanceStatusButton';
import { format } from 'date-fns';

export const metadata: Metadata = {
  title: 'Maintenance Schedules - CoolCare',
  description: 'View and manage all maintenance schedules',
};

export default async function MaintenanceSchedulesPage() {
  // Check if user is authenticated and is a technician
  const user = await requireAuth();
  
  if (user.role !== 'technician') {
    redirect('/dashboard');
  }
  
  // Get all maintenance schedules
  const schedules = await getAllMaintenanceSchedules();
  
  // Split schedules into upcoming and past
  const currentDate = new Date();
  const upcomingSchedules = schedules.filter(
    (schedule) => new Date(schedule.scheduled_date) >= currentDate && schedule.status !== 'cancelled'
  );
  const pastSchedules = schedules.filter(
    (schedule) => new Date(schedule.scheduled_date) < currentDate || schedule.status === 'cancelled'
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Maintenance Schedules</h1>
              <div className="flex space-x-3">
                <Link 
                  href="/technician-dashboard"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Dashboard
                </Link>
                <Link 
                  href="/technician-dashboard/create-maintenance"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Schedule New Visit
                </Link>
              </div>
            </div>
            
            {/* Upcoming maintenance schedules */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Upcoming Maintenance Visits
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Scheduled maintenance visits that need to be completed
                </p>
              </div>
              
              {upcomingSchedules.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No upcoming maintenance visits scheduled.
                </div>
              ) : (
                <div className="overflow-x-auto">
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
                          Notes
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {upcomingSchedules.map((schedule) => (
                        <tr key={schedule.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {schedule.user_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {format(new Date(schedule.scheduled_date), 'MMM d, yyyy')}
                            {schedule.scheduled_time && <span><br/>{schedule.scheduled_time}</span>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {schedule.technician_name || 'Not assigned'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              schedule.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : schedule.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {schedule.notes || 'No notes'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {schedule.status === 'scheduled' ? (
                              <div className="flex space-x-2">
                                <UpdateMaintenanceStatusButton 
                                  scheduleId={schedule.id} 
                                  status="completed" 
                                  buttonText="Mark Completed"
                                  className="text-green-600 hover:text-green-900 text-sm font-medium"
                                />
                                <UpdateMaintenanceStatusButton 
                                  scheduleId={schedule.id} 
                                  status="cancelled" 
                                  buttonText="Cancel"
                                  className="text-red-600 hover:text-red-900 text-sm font-medium"
                                />
                              </div>
                            ) : (
                              <span className="text-gray-400">No actions available</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            {/* Past maintenance schedules */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Past Maintenance Visits
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Previously completed or cancelled maintenance visits
                </p>
              </div>
              
              {pastSchedules.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No past maintenance visits.
                </div>
              ) : (
                <div className="overflow-x-auto">
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
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pastSchedules.map((schedule) => (
                        <tr key={schedule.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {schedule.user_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {format(new Date(schedule.scheduled_date), 'MMM d, yyyy')}
                            {schedule.scheduled_time && <span><br/>{schedule.scheduled_time}</span>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {schedule.technician_name || 'Not assigned'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              schedule.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : schedule.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {schedule.notes || 'No notes'}
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