"use client";

import { useState, useCallback, useMemo } from 'react';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';
import { Location } from '@/lib/db/locations';

interface Props {
  locations: Location[];
}

const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  scrollwheel: true,
  streetViewControl: true,
  mapTypeControl: true,
};

// The Google Maps API Key should ideally be an environment variable
// For this example, we'll just use a placeholder
// In a real application, you'd use process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
const apiKey = "YOUR_GOOGLE_MAPS_API_KEY";

export default function GoogleMapComponent({ locations }: Props) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  
  const center = useMemo(() => {
    // If there's a head office, use its coordinates as the center
    const headOffice = locations.find(loc => loc.isHeadOffice);
    if (headOffice) {
      return {
        lat: headOffice.latitude,
        lng: headOffice.longitude,
      };
    }
    
    // Otherwise, use the first location as the center
    if (locations.length > 0) {
      return {
        lat: locations[0].latitude,
        lng: locations[0].longitude,
      };
    }
    
    // Default to Kuala Lumpur if no locations
    return {
      lat: 3.139003,
      lng: 101.686855,
    };
  }, [locations]);
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
  });
  
  const onMapClick = useCallback(() => {
    setSelectedLocation(null);
  }, []);
  
  if (loadError) {
    return <div className="min-h-[500px] flex items-center justify-center bg-gray-100 rounded-lg">Error loading maps</div>;
  }
  
  if (!isLoaded) {
    return <div className="min-h-[500px] flex items-center justify-center bg-gray-100 rounded-lg">Loading maps...</div>;
  }
  
  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={6}
      center={center}
      onClick={onMapClick}
      options={mapOptions}
    >
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={{
            lat: location.latitude,
            lng: location.longitude,
          }}
          onClick={() => {
            setSelectedLocation(location);
          }}
          icon={{
            url: location.isHeadOffice 
              ? '/marker-head-office.svg' 
              : '/marker-branch.svg',
            scaledSize: new window.google.maps.Size(30, 40),
          }}
        />
      ))}
      
      {selectedLocation && (
        <InfoWindow
          position={{
            lat: selectedLocation.latitude,
            lng: selectedLocation.longitude,
          }}
          onCloseClick={() => {
            setSelectedLocation(null);
          }}
        >
          <div className="p-2 max-w-[300px]">
            <h3 className="text-lg font-semibold text-gray-900">{selectedLocation.name}</h3>
            <p className="mt-1 text-sm text-gray-700">{selectedLocation.address}</p>
            <p className="mt-1 text-sm text-gray-700">
              <strong>Phone:</strong> {selectedLocation.phone}
            </p>
            <p className="mt-1 text-sm text-gray-700">
              <strong>Email:</strong> {selectedLocation.email}
            </p>
            <p className="mt-1 text-sm text-gray-700">
              <strong>Hours:</strong><br />
              {selectedLocation.businessHours}
            </p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
} 