"use client";

import Link from 'next/link';
import { User } from '@/lib/auth';
import { formatDate } from '@/lib/utils';
import {
  CalendarIcon,
  CreditCardIcon,
  ClipboardDocumentListIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface Subscription {
  id: number;
  user_id: number;
  plan_id: number;
  start_date: string;
  end_date: string;
  status: string;
  plan_name: string;
  price: number;
  billingCycle: string;
  features: string;
}

interface ServiceRequest {
  id: number;
  user_id: number;
  service_id: number;
  requested_date: string;
  status: string;
  notes: string;
  created_at: string;
  service_name: string;
  description: string;
}

interface Props {
  user: User;
  subscription: Subscription | null;
  serviceRequests: ServiceRequest[];
}

// Helper function to format date strings
function formatDateString(dateString: string) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function DashboardOverview({ user, subscription, serviceRequests }: Props) {
  const pendingRequests = serviceRequests.filter(req => req.status === 'pending').length;
  const completedRequests = serviceRequests.filter(req => req.status === 'completed').length;
  
  return (
    <div className="space-y-6">
      {/* Subscription Card */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center">
          <CreditCardIcon className="h-8 w-8 text-blue-600" />
          <h2 className="ml-2 text-xl font-semibold text-gray-900">Subscription</h2>
        </div>
        
        {subscription ? (
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">{subscription.plan_name}</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {subscription.status}
              </span>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Billing Cycle</p>
                <p className="text-sm font-medium text-gray-900">{subscription.billingCycle}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="text-sm font-medium text-gray-900">RM {subscription.price.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="text-sm font-medium text-gray-900">{formatDateString(subscription.start_date)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">End Date</p>
                <p className="text-sm font-medium text-gray-900">{formatDateString(subscription.end_date)}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-500">Features</p>
              <ul className="mt-2 space-y-1">
                {subscription.features && JSON.parse(subscription.features).map((feature: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-6">
              <Link 
                href="/dashboard/subscription" 
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View subscription details →
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-4 text-center py-8">
            <ExclamationCircleIcon className="h-12 w-12 text-yellow-500 mx-auto" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No Active Subscription</h3>
            <p className="mt-1 text-sm text-gray-500">
              You don't have an active subscription plan yet.
            </p>
            <div className="mt-6">
              <Link
                href="/pricing"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View Plans
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Service Requests Card */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center">
          <ClipboardDocumentListIcon className="h-8 w-8 text-blue-600" />
          <h2 className="ml-2 text-xl font-semibold text-gray-900">Service Requests</h2>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">Total Requests</p>
            <p className="text-2xl font-bold text-gray-900">{serviceRequests.length}</p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-500">{pendingRequests}</p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-bold text-green-500">{completedRequests}</p>
          </div>
        </div>
        
        {serviceRequests.length > 0 ? (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900">Recent Requests</h3>
            <ul className="mt-3 divide-y divide-gray-200">
              {serviceRequests.slice(0, 3).map((request) => (
                <li key={request.id} className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{request.service_name}</p>
                      <p className="text-sm text-gray-500">{formatDateString(request.requested_date)}</p>
                    </div>
                    <span 
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        request.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : request.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {request.status === 'pending' && <ClockIcon className="h-3 w-3 mr-1" />}
                      {request.status === 'completed' && <CheckCircleIcon className="h-3 w-3 mr-1" />}
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            
            <div className="mt-4">
              <Link 
                href="/dashboard/service-requests" 
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View all requests →
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-4 text-center py-8">
            <ExclamationCircleIcon className="h-12 w-12 text-yellow-500 mx-auto" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No Service Requests</h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't made any service requests yet.
            </p>
            <div className="mt-6">
              <Link
                href="/services"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Browse Services
              </Link>
            </div>
          </div>
        )}
      </div>
      
      {/* Quick Actions Card */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/dashboard/service-requests/new"
            className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
            Request Service
          </Link>
          <Link
            href="/dashboard/schedule"
            className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <CalendarIcon className="h-5 w-5 mr-2" />
            View Schedule
          </Link>
        </div>
      </div>
    </div>
  );
} 