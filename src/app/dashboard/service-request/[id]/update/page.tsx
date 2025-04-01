import { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import { getServiceRequestDetail } from '@/lib/technician';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { format } from 'date-fns';
import UpdateServiceRequestForm from '@/components/UpdateServiceRequestForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Update Service Request - CoolCare',
  description: 'Update the status and details of a service request',
};

interface UpdateServiceRequestPageProps {
  params: { id: string };
}

export default async function UpdateServiceRequestPage({ params }: UpdateServiceRequestPageProps) {
  // Check if user is authenticated and is a technician
  const user = await requireAuth();
  
  if (user.role !== 'technician') {
    redirect('/dashboard');
  }
  
  // Process params after an async operation
  const id = params.id;
  const requestId = parseInt(id, 10);
  
  if (isNaN(requestId)) {
    return notFound();
  }
  
  const serviceRequest = await getServiceRequestDetail(requestId);
  
  // If service request doesn't exist
  if (!serviceRequest) {
    return notFound();
  }
  
  // Format date
  const formattedDate = format(new Date(serviceRequest.preferred_date), 'MMMM d, yyyy');
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900">Update Service Request</h1>
              <Link 
                href="/dashboard" 
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Back to Dashboard
              </Link>
            </div>
            
            <div className="mt-6 flex flex-col lg:flex-row gap-6">
              {/* Service Request Details */}
              <div className="w-full lg:w-2/3">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {serviceRequest.service_name}
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Request #{serviceRequest.id}
                      </p>
                    </div>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      serviceRequest.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : serviceRequest.status === 'in_progress' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {serviceRequest.status === 'in_progress' ? 'In Progress' : serviceRequest.status.charAt(0).toUpperCase() + serviceRequest.status.slice(1)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200">
                    <dl>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          Customer
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {serviceRequest.user_name}
                        </dd>
                      </div>
                      <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          Contact Info
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <div>Email: {serviceRequest.email}</div>
                          <div>Phone: {serviceRequest.phone || 'Not provided'}</div>
                        </dd>
                      </div>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          Service Type
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {serviceRequest.service_name}
                        </dd>
                      </div>
                      <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          Preferred Date
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {formattedDate}
                        </dd>
                      </div>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          Preferred Time
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {serviceRequest.preferred_time || 'Any time'}
                        </dd>
                      </div>
                      <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          Service Address
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {serviceRequest.address || 'Not specified'}
                        </dd>
                      </div>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          Description
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {serviceRequest.description || 'No description provided'}
                        </dd>
                      </div>
                      {serviceRequest.technician_notes && (
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">
                            Current Technician Notes
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {serviceRequest.technician_notes}
                          </dd>
                        </div>
                      )}
                      <div className={`${serviceRequest.technician_notes ? 'bg-gray-50' : 'bg-white'} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}>
                        <dt className="text-sm font-medium text-gray-500">
                          Request Date
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {format(new Date(serviceRequest.created_at), 'MMMM d, yyyy')}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
              
              {/* Update Form */}
              <div className="w-full lg:w-1/3">
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Update Request Status
                    </h3>
                    <div className="mt-4">
                      <UpdateServiceRequestForm 
                        requestId={serviceRequest.id} 
                        currentStatus={serviceRequest.status}
                        currentNotes={serviceRequest.technician_notes || ''}
                      />
                    </div>
                  </div>
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