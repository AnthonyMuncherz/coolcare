"use client";

import { useState } from "react";
import { User } from "@/lib/auth";

interface Subscription {
  id: number;
  user_id: number;
  user_name: string;
  plan_name: string;
  address?: string;
}

interface CreateMaintenanceFormProps {
  subscriptions?: Subscription[];
  technicianName?: string;
  customers?: User[];
  technicians?: User[];
  isAdminView?: boolean;
}

export default function CreateMaintenanceForm({ 
  subscriptions = [],
  technicianName = "",
  customers = [],
  technicians = [],
  isAdminView = false
}: CreateMaintenanceFormProps) {
  const [selectedSubscription, setSelectedSubscription] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Get tomorrow's date as the minimum date for scheduling
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Find the selected subscription from the list
  const findSelectedSubscription = () => {
    if (!selectedSubscription) return null;
    return subscriptions.find(s => s.id === parseInt(selectedSubscription));
  };
  
  // Find the selected customer from the list
  const findSelectedCustomer = () => {
    if (!selectedCustomer) return null;
    return customers.find(c => c.id === parseInt(selectedCustomer));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });
    
    try {
      // For admin view, use selected customer and technician
      if (isAdminView) {
        if (!selectedCustomer) {
          setMessage({ type: 'error', text: 'Please select a customer' });
          setIsSubmitting(false);
          return;
        }
        
        const formData = new FormData();
        formData.append('userId', selectedCustomer);
        formData.append('scheduledDate', scheduledDate);
        formData.append('scheduledTime', scheduledTime);
        formData.append('technicianId', selectedTechnician || '');
        formData.append('notes', notes);
        
        const response = await fetch('/api/admin/create-maintenance', {
          method: 'POST',
          body: formData,
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setMessage({ type: 'success', text: data.message });
          // Reset form after successful submission
          setSelectedCustomer('');
          setSelectedTechnician('');
          setScheduledDate('');
          setScheduledTime('');
          setNotes('');
          // Redirect after a short delay
          setTimeout(() => {
            window.location.href = '/admin-dashboard/maintenance';
          }, 2000);
        } else {
          setMessage({ type: 'error', text: data.message || 'Failed to schedule maintenance' });
        }
      } else {
        // For technician view, use selected subscription
        const subscription = findSelectedSubscription();
        if (!subscription) {
          setMessage({ type: 'error', text: 'Please select a subscription' });
          setIsSubmitting(false);
          return;
        }
        
        const formData = new FormData();
        formData.append('subscriptionId', selectedSubscription);
        formData.append('userId', subscription.user_id.toString());
        formData.append('scheduledDate', scheduledDate);
        formData.append('scheduledTime', scheduledTime);
        formData.append('technicianName', technicianName);
        formData.append('notes', notes);
        
        const response = await fetch('/api/technician/create-maintenance', {
          method: 'POST',
          body: formData,
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setMessage({ type: 'success', text: data.message });
          // Reset form after successful submission
          setSelectedSubscription('');
          setScheduledDate('');
          setScheduledTime('');
          setNotes('');
          // Redirect after a short delay
          setTimeout(() => {
            window.location.href = '/technician-dashboard/maintenance';
          }, 2000);
        } else {
          setMessage({ type: 'error', text: data.message || 'Failed to schedule maintenance' });
        }
      }
    } catch (error) {
      console.error('Error scheduling maintenance:', error);
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isAdminView ? (
        // Admin view - select customer and technician
        <>
          <div>
            <label htmlFor="customer" className="block text-sm font-medium text-gray-700">
              Select Customer
            </label>
            <select
              id="customer"
              name="customer"
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              required
            >
              <option value="">-- Select a customer --</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.email}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="technician" className="block text-sm font-medium text-gray-700">
              Assign Technician (optional)
            </label>
            <select
              id="technician"
              name="technician"
              value={selectedTechnician}
              onChange={(e) => setSelectedTechnician(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">-- Assign later --</option>
              {technicians.map((technician) => (
                <option key={technician.id} value={technician.id}>
                  {technician.name} - {technician.email}
                </option>
              ))}
            </select>
          </div>
          
          {selectedCustomer && (
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Selected Customer Details</h4>
              {(() => {
                const customer = findSelectedCustomer();
                if (!customer) return null;
                
                return (
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Name:</span> {customer.name}</p>
                    <p><span className="font-medium">Email:</span> {customer.email}</p>
                    {customer.phone && (
                      <p><span className="font-medium">Phone:</span> {customer.phone}</p>
                    )}
                    {customer.address && (
                      <p><span className="font-medium">Address:</span> {customer.address}</p>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </>
      ) : (
        // Technician view - select subscription
        <>
          <div>
            <label htmlFor="subscription" className="block text-sm font-medium text-gray-700">
              Select Customer
            </label>
            <select
              id="subscription"
              name="subscription"
              value={selectedSubscription}
              onChange={(e) => setSelectedSubscription(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              required
            >
              <option value="">-- Select a customer --</option>
              {subscriptions.map((subscription) => (
                <option key={subscription.id} value={subscription.id}>
                  {subscription.user_name} - {subscription.plan_name} Plan
                </option>
              ))}
            </select>
          </div>
          
          {selectedSubscription && (
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Selected Customer Details</h4>
              {(() => {
                const subscription = findSelectedSubscription();
                if (!subscription) return null;
                
                return (
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Name:</span> {subscription.user_name}</p>
                    <p><span className="font-medium">Plan:</span> {subscription.plan_name}</p>
                    {subscription.address && (
                      <p><span className="font-medium">Address:</span> {subscription.address}</p>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700">
            Maintenance Date
          </label>
          <input
            type="date"
            id="scheduledDate"
            name="scheduledDate"
            min={minDate}
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        
        <div>
          <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-700">
            Preferred Time (optional)
          </label>
          <select
            id="scheduledTime"
            name="scheduledTime"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Any Time</option>
            <option value="9:00 AM">9:00 AM</option>
            <option value="10:00 AM">10:00 AM</option>
            <option value="11:00 AM">11:00 AM</option>
            <option value="12:00 PM">12:00 PM</option>
            <option value="1:00 PM">1:00 PM</option>
            <option value="2:00 PM">2:00 PM</option>
            <option value="3:00 PM">3:00 PM</option>
            <option value="4:00 PM">4:00 PM</option>
            <option value="5:00 PM">5:00 PM</option>
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Add any notes for this maintenance visit"
        ></textarea>
      </div>
      
      {message.text && (
        <div className={`p-3 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Scheduling...' : 'Schedule Maintenance'}
        </button>
      </div>
    </form>
  );
} 