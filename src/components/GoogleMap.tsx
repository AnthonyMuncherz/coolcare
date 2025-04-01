"use client";

import { Location } from '@/lib/db/locations';

interface Props {
  locations: Location[];
}

export default function GoogleMapComponent({ locations }: Props) {
  // Using an iframe embed for Google Maps instead of the API
  return (
    <div className="w-full h-[500px] overflow-hidden rounded-lg">
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.749433321801!2d101.7376456749712!3d3.1606081968147564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc37b2dd6a4a0f%3A0xbfd0abeeb88774d9!2sJln%20Ampang!5e0!3m2!1sen!2smy!4v1743499029017!5m2!1sen!2smy" 
        width="100%" 
        height="100%" 
        style={{ border: 0 }} 
        allowFullScreen={true} 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
} 