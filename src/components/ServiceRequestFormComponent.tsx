"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Service {
  id: number;
  name: string;
  description: string;
}

export default function ServiceRequestFormComponent({ userId }: { userId: number }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState({
    serviceId: '',
    description: '',
    preferredDate: '',
    preferredTime: '',
    address: '',
  });

  useEffect(() => {
    // Fetch available services
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        const data = await response.json();
        
        if (data.success) {
          setServices(data.services);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    
    fetchServices();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.serviceId || !formData.description || !formData.preferredDate) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('/api/service-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          serviceId: parseInt(formData.serviceId),
          description: formData.description,
          preferredDate: formData.preferredDate,
          preferredTime: formData.preferredTime,
          address: formData.address,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setError(data.message || 'Failed to submit service request. Please try again.');
      }
    } catch (error) {
      console.error('Service request error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">Service request submitted!</h3>
        <p className="mt-2 text-sm text-gray-500">
          Your service request has been submitted successfully. We'll contact you shortly to confirm the details.
        </p>
      </div>
    );
  }

  // Dummy services if API call fails
  const dummyServices = [
    { id: 1, name: 'Regular Maintenance', description: 'Standard AC maintenance service' },
    { id: 2, name: 'Repairs', description: 'Fix AC problems and issues' },
    { id: 3, name: 'Installation', description: 'New AC unit installation' },
    { id: 4, name: 'Relocation', description: 'Move AC units to a new location' },
  ];

  const availableServices = services.length > 0 ? services : dummyServices;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-100 rounded-md">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700">
          Service Type <span className="text-red-600">*</span>
        </label>
        <div className="mt-1">
          <select
            id="serviceId"
            name="serviceId"
            value={formData.serviceId}
            onChange={handleChange}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md text-gray-900"
            required
          >
            <option value="">Select a service</option>
            {availableServices.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Issue Description <span className="text-red-600">*</span>
        </label>
        <div className="mt-1">
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Please describe the issue you're experiencing with your air conditioner"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700">
            Preferred Date <span className="text-red-600">*</span>
          </label>
          <div className="mt-1">
            <input
              type="date"
              name="preferredDate"
              id="preferredDate"
              value={formData.preferredDate}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700">
            Preferred Time
          </label>
          <div className="mt-1">
            <select
              id="preferredTime"
              name="preferredTime"
              value={formData.preferredTime}
              onChange={handleChange}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md text-gray-900"
            >
              <option value="">Select a time</option>
              <option value="morning">Morning (9 AM - 12 PM)</option>
              <option value="afternoon">Afternoon (12 PM - 3 PM)</option>
              <option value="evening">Evening (3 PM - 6 PM)</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Service Address
        </label>
        <div className="mt-1">
          <textarea
            id="address"
            name="address"
            rows={3}
            value={formData.address}
            onChange={handleChange}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter the address where service is needed (if different from registered address)"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Service Request'}
        </button>
      </div>
    </form>
  );
} 