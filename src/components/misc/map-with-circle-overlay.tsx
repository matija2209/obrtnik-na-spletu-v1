"use client"
import React, { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

interface MapWithCircleOverlayProps {
  radius?: number; // Radius in meters
  lat?: number;
  lng?: number;
  disableDefaultUI?: boolean;
}

const MapWithCircleOverlay: React.FC<MapWithCircleOverlayProps> = ({lat=46.2191697, lng=15.4705641, radius = 60000, disableDefaultUI = false }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);


  useEffect(() => {
    // Load Google Maps API script
    const loadGoogleMapsAPI = () => {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDP-5oKuu49gtQ8I5CXWSa7YRzWKSDtLdI&callback=initMap`;
        script.async = true;
        script.defer = true;
        window.initMap = initMap;
        document.head.appendChild(script);
      } else {
        // Map already initialized, potentially update bounds if radius changes
        if (mapInstanceRef.current) {
          // Find the existing circle (assuming only one) and update its radius and map bounds
          // This part requires a more complex state management or refactoring
          // For simplicity now, we re-initialize, but ideally, we'd update existing elements.
          initMap(); 
        } else {
          initMap();
        }
      }
    };

    // Initialize the map
    const initMap = () => {
      const mapOptions: google.maps.MapOptions = {
        center: { lat, lng },
        // zoom: 12, // Zoom will be set by fitBounds
        mapTypeId: 'roadmap',
        disableDefaultUI: disableDefaultUI,
        // zoomControl: true, // We can optionally remove or keep this based on disableDefaultUI
      };

      // Create the map
      if (!mapRef.current) {
        console.error("Map container element not found");
        return;
      }
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, mapOptions);

      // Add the circle overlay
      const circle = new window.google.maps.Circle({
        strokeColor: '#4CAF50',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#4CAF50',
        fillOpacity: 0.1,
        map: mapInstanceRef.current,
        center: { lat, lng },
        radius: radius, // Use the radius prop
      });

      // Adjust map bounds to fit the circle
      if (mapInstanceRef.current) {
        mapInstanceRef.current.fitBounds(circle.getBounds()!);
      }

      // Define a custom overlay class
      class CustomOverlay extends window.google.maps.OverlayView {
        private div: HTMLDivElement | null = null;
        private lat: number;
        private lng: number;

        constructor(lat: number, lng: number) {
          super();
          this.lat = lat;
          this.lng = lng;
        }

        onAdd() {
          const div = document.createElement('div');
          div.style.position = 'absolute';
          div.className = 'custom-marker';
          // Use MapPin icon directly or construct SVG string carefully
          div.innerHTML = `<div style="color: #FF4500; transform: translate(-50%, -100%);">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>`;
          this.div = div;
          const panes = this.getPanes();
          if (panes) {
            panes.overlayLayer.appendChild(div);
          }
        }

        draw() {
          const overlayProjection = this.getProjection();
          if (!overlayProjection || !this.div) {
            return;
          }
          const position = overlayProjection.fromLatLngToDivPixel(
            new window.google.maps.LatLng(this.lat, this.lng)
          );
          
          if (position) {
            this.div.style.left = position.x + 'px';
            this.div.style.top = position.y + 'px';
          }
        }

        onRemove() {
          if (this.div) {
            (this.div.parentNode as HTMLElement).removeChild(this.div);
            this.div = null;
          }
        }
      }

      // Create the overlay for React component
      const customOverlay = new CustomOverlay(lat, lng);
      customOverlay.setMap(mapInstanceRef.current);
      
      // REMOVED OLD onAdd and draw assignments
      // Add the Lucide React component to the overlay
      // customOverlay.onAdd = function() { ... };
      // Position the overlay
      // customOverlay.draw = function() { ... };
    };

    loadGoogleMapsAPI();

    return () => {
      // Clean up
      if (window.google && mapInstanceRef.current) {
        window.google.maps.event.clearInstanceListeners(mapInstanceRef.current);
      }
    };
  }, [radius]); // Add radius to dependency array

  return (
    <div className="w-full">
      <div ref={mapRef} className="w-full h-96 rounded-lg shadow-lg"></div>
      {/* <div className="mt-4 text-sm text-gray-600">
        Coordinates: {lat}, {lng}
      </div> */}
    </div>
  );
};

export default MapWithCircleOverlay;