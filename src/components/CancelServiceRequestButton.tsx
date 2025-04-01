"use client";

import { useState } from "react";

interface CancelServiceRequestButtonProps {
  requestId: number;
}

export default function CancelServiceRequestButton({ requestId }: CancelServiceRequestButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = async () => {
    if (confirm('Are you sure you want to cancel this service request?')) {
      setIsSubmitting(true);
      
      const formData = new FormData();
      formData.append('requestId', requestId.toString());
      
      try {
        const response = await fetch('/api/service-requests/cancel', {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          window.location.href = '/dashboard/service-requests?cancelled=true';
        } else {
          console.error('Failed to cancel service request');
          alert('Failed to cancel service request. Please try again.');
        }
      } catch (error) {
        console.error('Error cancelling service request:', error);
        alert('An error occurred. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <button
      type="button"
      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
      onClick={handleCancel}
      disabled={isSubmitting}
    >
      {isSubmitting ? 'Cancelling...' : 'Cancel Request'}
    </button>
  );
} 