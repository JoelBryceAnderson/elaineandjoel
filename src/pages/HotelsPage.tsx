import React, { useState, useRef, useEffect } from 'react';
import { Plane, Hotel, Car } from 'lucide-react';
import { loader, mapId } from '../utils/mapUtils';
import { Airport, HOTEL, VENUE, AIRPORTS } from './hotelsTypes';
import PageTemplate from "../components/PageTemplate";

// HotelMap component remains unchanged
const HotelMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        await loader.load();

        const { Map } = await window.google.maps.importLibrary("maps");
        const { AdvancedMarkerElement, PinElement } = await window.google.maps.importLibrary("marker");
        
        if (!mapRef.current) return;

        const bounds = new google.maps.LatLngBounds();
        bounds.extend(HOTEL.coordinates);
        bounds.extend(VENUE.coordinates);

        const map = new Map(mapRef.current, {
          mapId,
          disableDefaultUI: true,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        [
          { ...HOTEL, type: 'hotel' },
          { ...VENUE, type: 'venue' }
        ].forEach(location => {
          const container = document.createElement('div');
          container.className = 'marker-container';
          container.style.position = 'relative';
          
          const pinContainer = document.createElement('div');
          pinContainer.style.position = 'absolute';
          pinContainer.style.left = '50%';
          pinContainer.style.transform = 'translateX(-50%)';
          pinContainer.style.bottom = '24px';
          
          const pin = new PinElement({
            background: location.type === 'venue' ? '#ccac6c' : '#1B365D',
            borderColor: '#FFFFFF',
            glyphColor: '#FFFFFF',
          });

          const label = document.createElement('div');
          label.className = 'marker-label';
          label.style.position = 'relative';
          label.style.textAlign = 'center';
          label.innerHTML = `
            <div class="bg-white px-2 py-1 rounded shadow-md text-sm">
              <span class="font-medium text-[#1B365D]">${location.name}</span>
            </div>
          `;

          pinContainer.appendChild(pin.element);
          container.appendChild(label);
          container.appendChild(pinContainer);

          new AdvancedMarkerElement({
            position: location.coordinates,
            map,
            content: container,
            title: location.name,
          });
        });

        map.fitBounds(bounds, { left: 100, right: 100, top: 100, bottom: 100 });
      } catch (error) {
        console.error('Error loading map:', error);
        setMapError('Failed to load map');
      }
    };

    initMap();
  }, []);

  return (
    <div className="h-96 rounded-lg overflow-hidden shadow-lg">
      {mapError ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
          {mapError}
        </div>
      ) : (
        <div ref={mapRef} className="w-full h-full" />
      )}
    </div>
  );
};

const RouteMap: React.FC<{ airport: Airport }> = ({ airport }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        await loader.load();

        const { Map } = await window.google.maps.importLibrary("maps");
        const { AdvancedMarkerElement, PinElement } = await window.google.maps.importLibrary("marker");
        
        if (!mapRef.current) return;

        const map = new Map(mapRef.current, {
          mapId,
          disableDefaultUI: true,
          zoomControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          clickableIcons: false,
          gestureHandling: "none",
        });

        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer({
          map,
          suppressMarkers: true,
          preserveViewport: false,
          polylineOptions: {
            strokeColor: '#1B365D',
            strokeWeight: 4
          }
        });

        const startPin = new PinElement({
          background: '#DC2626',
          borderColor: '#ffffff',
          glyphColor: '#ffffff',
          scale: 0.8
        });

        new AdvancedMarkerElement({
          position: airport.coordinates,
          map,
          content: startPin.element,
          title: airport.name,
        });

        const endPin = new PinElement({
          background: '#1B365D',
          borderColor: '#ffffff',
          glyphColor: '#ffffff',
          scale: 0.8
        });

        new AdvancedMarkerElement({
          position: HOTEL.coordinates,
          map,
          content: endPin.element,
          title: HOTEL.name,
        });

        const request = {
          origin: airport.coordinates,
          destination: HOTEL.coordinates,
          travelMode: google.maps.TravelMode.DRIVING
        };

        directionsService.route(request, (result, status) => {
          if (status === 'OK') {
            directionsRenderer.setDirections(result);
          }
        });

      } catch (error) {
        console.error('Error loading map:', error);
        setMapError('Failed to load map');
      }
    };

    initMap();
  }, [airport]);

  return (
    <div className="h-48 w-full sm:h-32 sm:w-48 rounded-lg overflow-hidden shadow-md">
      {mapError ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 text-xs">
          {mapError}
        </div>
      ) : (
        <div ref={mapRef} className="w-full h-full" />
      )}
    </div>
  );
};

const HotelsPage: React.FC = () => {
  return (
    <PageTemplate
      title="Accommodations"
      subtitle="Hotels, airports, and useful travel tips"
    >

    {/* Hotel Section */}
    <div className="mb-12">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Hotel className="w-6 h-6 mr-2 text-[#1B365D]" />
          <h2 className="text-2xl font-medium text-[#1B365D]">Where to Stay</h2>
        </div>
        <div className="max-w-2xl mx-auto">
          <h3 className="text-xl font-medium text-[#1B365D] mb-2">
            <a 
              href={HOTEL.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#ccac6c] transition-colors"
            >
              {HOTEL.name}
            </a>
          </h3>
          <p className="text-gray-600 mb-2">{HOTEL.description}</p>
          <p className="text-gray-500">{HOTEL.address}</p>
        </div>
      </div>

      <HotelMap />
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-500">
          The hotel is just a {" "}
          <span className="font-medium text-[#1B365D]">12-minute walk</span>
          {" "} or {" "}
          <span className="font-medium text-[#1B365D]">5-minute drive</span>
          {" "} from the venue
        </p>
      </div>
    </div>

    {/* Airports Section */}
    <div>
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <Plane className="w-6 h-6 mr-2 text-[#1B365D]" />
          <h2 className="text-2xl font-medium text-[#1B365D]">Getting Here</h2>
        </div>
      </div>

      <div className="space-y-8">
        {AIRPORTS.map((airport) => (
          <div 
            key={airport.code}
            className="flex flex-col sm:flex-row sm:items-center gap-6 p-6 rounded-lg hover:bg-[#1B365D]/5 transition-colors"
          >
            {/* Airport Info */}
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <h3 className="text-lg font-medium text-[#1B365D]">
                  <a 
                    href={airport.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#ccac6c] transition-colors"
                  >
                    {airport.name}
                  </a>
                </h3>
                <span className="ml-2 text-sm font-medium text-gray-500">({airport.code})</span>
              </div>
              <p className="text-gray-600 mb-2">{airport.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <Car className="w-4 h-4 mr-1" />
                  {airport.travelInfo.drivingTime}
                </span>
                <span>•</span>
                <span>{airport.travelInfo.distance}</span>
              </div>
            </div>

            {/* Route Map */}
            <RouteMap airport={airport} />
          </div>
        ))}
      </div>
      </div>
    </PageTemplate>
  );
};

export default HotelsPage;