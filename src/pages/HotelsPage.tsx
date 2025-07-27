import React, { useState, useRef, useEffect } from 'react';
import { Plane, Hotel, Car, Building2Icon, LucideCarTaxiFront, Footprints } from 'lucide-react';
import { loader, mapId } from '../utils/mapUtils';
import { Airport, HOTEL, VENUE, AIRPORTS, ALT_HOTELS } from './hotelsTypes';
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
      subtitle="We haven’t reserved a hotel block, since we know that — with an NYC wedding — everyone’s preferences, budgets, schedules, and rewards points vary widely. You're welcome to stay for just the weekend or make a longer trip of it! We trust you'll find the accommodations that work best for you, but to help get you started, we've listed a few hotels nearby below."
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
              href={HOTEL.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#ccac6c] transition-colors"
            >
              {HOTEL.name}
            </a>
          </h3>
          <p className="text-gray-600 mb-2">{HOTEL.description}</p>
            <a 
              href={HOTEL.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[#ccac6c] transition-colors"
            >
              {HOTEL.address}
            </a>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mt-2">
                <span className="flex items-center">
                  <Footprints className="w-4 h-4 mr-1" />
                  {HOTEL.walkingTime}
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <Car className="w-4 h-4 mr-1" />
                  {HOTEL.drivingTime}
                </span>
              </div>
        </div>
      </div>

      <HotelMap />      
    </div>

    {/* Alternative Hotels Section */}
    <div className="mb-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <Building2Icon className="w-6 h-6 mr-2 text-[#1B365D]" />
          <h2 className="text-2xl font-medium text-[#1B365D]">Alternative Hotels in Williamsburg</h2>
        </div>
      </div>

      <div className="space-y-8 mr-6 ml-6">
        {ALT_HOTELS.map((alt_hotel) => (
        <div className="max-w-2xl mx-auto">
          <h3 className="text-xl font-medium text-[#1B365D] mb-2">
            <a 
              href={alt_hotel.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#ccac6c] transition-colors"
            >
              {alt_hotel.name}
            </a>
          </h3>
          <p className="text-gray-600 mb-2">{alt_hotel.description}</p>
            <a 
              href={alt_hotel.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[#ccac6c] transition-colors"
            >
              {alt_hotel.address}
            </a>
            <div className="flex space-x-4 text-sm text-gray-500 mt-2">
                <span className="flex">
                  <Footprints className="w-4 h-4 mr-1" />
                  {alt_hotel.walkingTime}
                </span>
                <span>•</span>
                <span className="flex">
                  <Car className="w-4 h-4 mr-1" />
                  {alt_hotel.drivingTime}
                </span>
              </div>
        </div>
        ))}
      </div>

    </div>

    {/* Outside Williamsburg Section */}
    <div className="mb-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <LucideCarTaxiFront className="w-6 h-6 mr-2 text-[#1B365D]" />
          <h2 className="text-2xl font-medium text-[#1B365D]">Staying outside Williamsburg?</h2>
        </div>
      </div>

      <div className="space-y-2 mr-6 ml-6">
        <p className="text-gray-600">
        If you’re staying in Manhattan, you can cab or take the subway—just give yourself plenty of extra time in case of weekend train delays or traffic.
        </p>
        <p className="text-gray-600">
        If you’re further out in Brooklyn (and not near a subway line), a cab is likely your best bet—but weekend traffic can be unpredictable.        </p>
        <p className="text-gray-600">
        To keep things simple, we recommend staying in Williamsburg, Greenpoint, or Bushwick if you can!
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
                  {airport.drivingTime}
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
