"use client";

import { useState } from "react";

interface UpdateMaintenanceStatusButtonProps {
  scheduleId: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  buttonText: string;
  className?: string;
}

export default function UpdateMaintenanceStatusButton({ 
  scheduleId, 
  status,
  buttonText,
  className = ""
}: UpdateMaintenanceStatusButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleClick = async () => {
    if (status === 'cancelled' && !window.confirm('Are you sure you want to cancel this maintenance visit?')) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('scheduleId', scheduleId.toString());
      formData.append('status', status);
      
      const response = await fetch('/api/technician/update-maintenance', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Refresh the page to reflect the update
        window.location.reload();
      } else {
        console.error('Failed to update maintenance status:', data.message);
        alert('Failed to update maintenance status: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating maintenance status:', error);
      alert('An error occurred while updating the maintenance status');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isSubmitting}
      className={`${className} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isSubmitting ? '...' : buttonText}
    </button>
  );
} 