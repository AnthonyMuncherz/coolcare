import { Metadata } from 'next';
import { requireAuth, getUserSubscription } from '@/lib/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardSidebar from '@/components/DashboardSidebar';
import { getMaintenanceSchedules, MaintenanceSchedule } from '@/lib/maintenance';
import { format } from 'date-fns';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Maintenance Schedule - CoolCare',
  description: 'View your upcoming and past maintenance appointments',
};

export default async function SchedulePage() {
  // Check if user is authenticated
  const user = await requireAuth();
  
  // Get user subscription
  const subscription = await getUserSubscription(user.id);
  
  // Get maintenance schedules
  const schedules: MaintenanceSchedule[] = subscription ? await getMaintenanceSchedules(user.id) : [];
  
  // Split schedules into upcoming and past
  const currentDate = new Date();
  const upcomingSchedules: MaintenanceSchedule[] = schedules.filter(
    (schedule) => new Date(schedule.scheduled_date) >= currentDate
  );
  const pastSchedules: MaintenanceSchedule[] = schedules.filter(
    (schedule) => new Date(schedule.scheduled_date) < currentDate
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-2xl font-semibold text-gray-900">Maintenance Schedule</h1>
            
            <div className="mt-6 flex flex-col lg:flex-row gap-6">
              {/* Sidebar */}
              <DashboardSidebar user={user} activePage="schedule" />
              
              {/* Main content */}
              <div className="flex-1">
                {!subscription ? (
                  <div className="bg-white rounded-lg shadow p-6 text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Subscription</h3>
                    <p className="text-gray-600 mb-4">
                      You don't have an active subscription plan yet. Subscribe to a plan to get maintenance services.
                    </p>
                    <Link 
                      href="/dashboard/subscription/payment" 
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      View Plans
                    </Link>
                  </div>
                ) : (
                  <>
                    {/* Subscription status */}
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                      <h3 className="text-lg font-medium text-gray-900">Current Plan</h3>
                      <p className="mt-2 text-sm text-gray-600">
                        You are currently subscribed to the <span className="font-semibold">{subscription.plan_name}</span> plan.
                      </p>
                    </div>
                    
                    {/* Upcoming maintenance */}
                    <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Upcoming Maintenance Visits
                        </h3>
                      </div>
                      
                      {upcomingSchedules.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                          No upcoming maintenance visits scheduled.
                        </div>
                      ) : (
                        <ul className="divide-y divide-gray-200">
                          {upcomingSchedules.map((schedule) => (
                            <li key={schedule.id} className="p-4 sm:px-6">
                              <div className="flex items-center justify-between">
                                <div className="text-black">
                                  <p className="text-sm font-medium text-gray-900">
                                    {format(new Date(schedule.scheduled_date), 'MMMM d, yyyy')} 
                                    {schedule.scheduled_time && ` at ${schedule.scheduled_time}`}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1">
                                    Technician: {schedule.technician_name || 'To be assigned'}
                                  </p>
                                  {schedule.notes && (
                                    <p className="text-sm text-gray-600 mt-1">
                                      Notes: {schedule.notes}
                                    </p>
                                  )}
                                </div>
                                <div>
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    {schedule.status}
                                  </span>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    
                    {/* Past maintenance */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Past Maintenance Visits
                        </h3>
                      </div>
                      
                      {pastSchedules.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                          No past maintenance visits.
                        </div>
                      ) : (
                        <ul className="divide-y divide-gray-200">
                          {pastSchedules.map((schedule) => (
                            <li key={schedule.id} className="p-4 sm:px-6">
                              <div className="flex items-center justify-between">
                                <div className="text-black">
                                  <p className="text-sm font-medium text-gray-900">
                                    {format(new Date(schedule.scheduled_date), 'MMMM d, yyyy')}
                                    {schedule.scheduled_time && ` at ${schedule.scheduled_time}`}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1">
                                    Technician: {schedule.technician_name || 'Not assigned'}
                                  </p>
                                  {schedule.notes && (
                                    <p className="text-sm text-gray-600 mt-1">
                                      Notes: {schedule.notes}
                                    </p>
                                  )}
                                </div>
                                <div>
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    schedule.status === 'completed' 
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {schedule.status}
                                  </span>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </>
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