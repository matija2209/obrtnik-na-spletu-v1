"use client"
import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

interface MapWithCircleOverlayProps {
  radius?: number | null; // Radius in meters
  lat?: number;
  lng?: number;
  disableDefaultUI?: boolean;
}

// Global state to manage Google Maps loading
let isGoogleMapsLoading = false;
let googleMapsPromise: Promise<void> | null = null;

const loadGoogleMaps = (): Promise<void> => {
  // If already loaded, resolve immediately
  if (window.google?.maps) {
    return Promise.resolve();
  }

  // If already loading, return the existing promise
  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  // Check if script already exists
  const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
  if (existingScript && !window.google?.maps) {
    // Script exists but not loaded yet, wait for it
    googleMapsPromise = new Promise((resolve, reject) => {
      const checkLoaded = () => {
        if (window.google?.maps) {
          resolve();
        } else {
          setTimeout(checkLoaded, 100);
        }
      };
      checkLoaded();
      
      // Add timeout to prevent infinite waiting
      setTimeout(() => reject(new Error('Google Maps loading timeout')), 10000);
    });
    return googleMapsPromise;
  }

  // Create new script
  if (!existingScript) {
    googleMapsPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=geometry`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        isGoogleMapsLoading = false;
        resolve();
      };
      
      script.onerror = () => {
        isGoogleMapsLoading = false;
        googleMapsPromise = null;
        reject(new Error('Failed to load Google Maps'));
      };
      
      document.head.appendChild(script);
      isGoogleMapsLoading = true;
    });
  }

  return googleMapsPromise || Promise.resolve();
};

const MapWithCircleOverlay: React.FC<MapWithCircleOverlayProps> = ({
  lat = 46.2191697, 
  lng = 15.4705641, 
  radius = 60000, 
  disableDefaultUI = false 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const circleRef = useRef<google.maps.Circle | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  // Cleanup function to properly remove Google Maps elements
  const cleanupMapElements = () => {
    try {
      // Clean up circle
      if (circleRef.current) {
        circleRef.current.setMap(null);
        circleRef.current = null;
      }
      
      // Clean up marker
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      
      // Clear map reference but don't try to manipulate it
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    } catch (err) {
      // Silently handle cleanup errors to prevent React DOM errors
      console.warn('Error during map cleanup:', err);
    }
  };

  useEffect(() => {
    isMountedRef.current = true;

    const initializeMap = async () => {
      try {
        // Early return if component is unmounted
        if (!isMountedRef.current) return;
        
        await loadGoogleMaps();
        
        // Check again after async operation
        if (!isMountedRef.current || !mapRef.current) return;

        // Clean up existing map elements before creating new ones
        cleanupMapElements();

        const mapOptions: google.maps.MapOptions = {
          center: { lat, lng },
          zoom: 10,
          mapTypeId: 'roadmap',
          disableDefaultUI: disableDefaultUI,
        };

        // Create the map
        if (mapRef.current && isMountedRef.current) {
          mapInstanceRef.current = new google.maps.Map(mapRef.current, mapOptions);

          // Add the circle overlay
          const circle = new google.maps.Circle({
            strokeColor: '#4CAF50',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#4CAF50',
            fillOpacity: 0.1,
            map: mapInstanceRef.current,
            center: { lat, lng },
            radius: radius || 60000,
          });
          circleRef.current = circle;

          // Add a simple marker instead of custom overlay
          const marker = new google.maps.Marker({
            position: { lat, lng },
            map: mapInstanceRef.current,
            title: 'Location',
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#FF4500',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 2,
            },
          });
          markerRef.current = marker;

          // Adjust map bounds to fit the circle
          const bounds = circle.getBounds();
          if (bounds && mapInstanceRef.current) {
            mapInstanceRef.current.fitBounds(bounds);
          }

          if (isMountedRef.current) {
            setIsLoaded(true);
            setError(null);
          }
        }
      } catch (err) {
        if (isMountedRef.current) {
          setError(err instanceof Error ? err.message : 'Failed to load map');
          setIsLoaded(false);
        }
      }
    };

    initializeMap();

    return () => {
      isMountedRef.current = false;
      cleanupMapElements();
    };
  }, [lat, lng, radius, disableDefaultUI]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      cleanupMapElements();
    };
  }, []);

  if (error) {
    return (
      <div className="w-full">
        <div className="w-full h-96 rounded-lg shadow-lg bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <div className="text-gray-500 text-sm">Failed to load map</div>
            <div className="text-gray-400 text-xs mt-1">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      <div 
        ref={mapRef} 
        className="w-full h-96 rounded-lg shadow-lg bg-gray-100"
        style={{ minHeight: '384px' }}
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
            <div className="text-gray-500 text-sm">Loading map...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapWithCircleOverlay;