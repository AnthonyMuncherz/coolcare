"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Subscription {
  id: number;
  user_id: number;
  user_name: string;
  email: string;
  phone?: string;
  address?: string;
  plan_name: string;
  start_date: string;
  end_date: string;
}

interface NewMaintenanceVisitFormProps {
  subscriptions: Subscription[];
  technicianName: string;
}

export default function NewMaintenanceVisitForm({ 
  subscriptions, 
  technicianName 
}: NewMaintenanceVisitFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    subscriptionId: '',
    userId: '',
    scheduledDate: '',
    scheduledTime: '',
    notes: ''
  });
  
  // Get customer details based on selected subscription
  const selectedSubscription = formData.subscriptionId 
    ? subscriptions.find(sub => sub.id.toString() === formData.subscriptionId) 
    : null;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // If subscription changes, update the userId
    if (name === 'subscriptionId' && value) {
      const subscription = subscriptions.find(sub => sub.id.toString() === value);
      if (subscription) {
        setFormData(prev => ({
          ...prev,
          userId: subscription.user_id.toString()
        }));
      }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response = await fetch('/api/technician/schedule-maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          technicianName
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Maintenance visit scheduled successfully!' });
        // Redirect after a short delay
        setTimeout(() => {
          router.push('/dashboard/maintenance-schedule');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to schedule maintenance visit' });
      }
    } catch (error) {
      console.error('Error scheduling maintenance:', error);
      setMessage({ type: 'error', text: 'An error occurred while scheduling the maintenance visit' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="subscriptionId" className="block text-sm font-medium text-gray-700">
          Customer
        </label>
        <select
          id="subscriptionId"
          name="subscriptionId"
          value={formData.subscriptionId}
          onChange={handleChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          required
        >
          <option value="">Select a customer</option>
          {subscriptions.map(subscription => (
            <option key={subscription.id} value={subscription.id.toString()}>
              {subscription.user_name} - {subscription.plan_name}
            </option>
          ))}
        </select>
      </div>
      
      {selectedSubscription && (
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Customer Information</h3>
          <p className="text-sm text-gray-600">Email: {selectedSubscription.email}</p>
          {selectedSubscription.phone && (
            <p className="text-sm text-gray-600">Phone: {selectedSubscription.phone}</p>
          )}
          {selectedSubscription.address && (
            <p className="text-sm text-gray-600">Address: {selectedSubscription.address}</p>
          )}
        </div>
      )}
      
      <div>
        <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700">
          Scheduled Date
        </label>
        <input
          type="date"
          id="scheduledDate"
          name="scheduledDate"
          value={formData.scheduledDate}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
        />
      </div>
      
      <div>
        <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-700">
          Scheduled Time (optional)
        </label>
        <input
          type="time"
          id="scheduledTime"
          name="scheduledTime"
          value={formData.scheduledTime}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          value={formData.notes}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Add any notes about this maintenance visit"
        ></textarea>
      </div>
      
      {message.text && (
        <div className={`p-3 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}
      
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Scheduling...' : 'Schedule Maintenance Visit'}
        </button>
      </div>
    </form>
  );
} 