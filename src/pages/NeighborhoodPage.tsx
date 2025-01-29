import React, { useState, useRef, useEffect } from 'react';
import { MapPin, LandPlot, Utensils } from 'lucide-react';
import { Loader } from '@googlemaps/js-api-loader';

// Type definitions
declare global {
  interface Window {
    google: any;
  }
}

type MarkerType = google.maps.marker.AdvancedMarkerElement & {
  content?: HTMLElement;
};

interface Location {
  name: string;
  description: string;
  address: string;
  mapUrl: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface LocationCategories {
  parks: Location[];
  food: Location[];
}

const locations: LocationCategories = {
  parks: [
    {
      name: "Domino Park",
      description: "Waterfront park with stunning Manhattan views, featuring an elevated walkway, fountain plaza, and playground.",
      address: "15 River St, Brooklyn, NY 11249",
      mapUrl: "https://maps.app.goo.gl/rHwXMUa4DRACnLsUA",
      coordinates: {
        lat: 40.7147,
        lng: -73.9670
      }
    },
    {
      name: "Bushwick Inlet Park",
      description: "Waterfront green space perfect for picnics and recreational activities with skyline views.",
      address: "50 Kent Ave, Brooklyn, NY 11249",
      mapUrl: "https://maps.app.goo.gl/86add65A8fy8MXVN7",
      coordinates: {
        lat: 40.7232,
        lng: -73.9591
      }
    }
  ],
  food: [
    {
      name: "L'industrie Pizzeria",
      description: "Local favorite serving excellent NY-style pizza with creative toppings.",
      address: "254 S 2nd St, Brooklyn, NY 11211",
      mapUrl: "https://maps.app.goo.gl/wGSs41rHrYH5GQWP6",
      coordinates: {
        lat: 40.7124,
        lng: -73.9577
      }
    },
    {
      name: "Leon's Bagels",
      description: "Classic NYC bagel shop offering hand-rolled bagels and various spreads.",
      address: "128 Bedford Ave Suite B, Brooklyn, NY 11249",
      mapUrl: "https://maps.app.goo.gl/sY9vYgbQH7C8AQRP7",
      coordinates: {
        lat: 40.7196,
        lng: -73.9561
      }
    }
  ]
};

// Access environment variables using:
const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
const mapId = process.env.REACT_APP_GOOGLE_MAPS_ID || '';

const WILLIAMSBURG_BOUNDS = {
  north: 40.7252,
  south: 40.7023,
  west: -73.9776,
  east: -73.9344
};

interface LocationCardProps extends Location {
  isSelected: boolean;
  onSelect: () => void;
}

const LocationCard: React.FC<LocationCardProps> = ({ 
  name, 
  description, 
  address, 
  mapUrl, 
  isSelected,
  onSelect 
}) => (
  <div 
    className={`mb-6 p-4 rounded-lg cursor-pointer transition-colors ${
      isSelected ? 'bg-[#1B365D]/10' : 'hover:bg-gray-50'
    }`}
    onClick={onSelect}
  >
    <div className="flex items-center mb-2">
      <MapPin className={`w-4 h-4 mr-2 ${
        isSelected ? 'text-[#C5A572]' : 'text-[#1B365D]'
      }`} />
      <a 
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`font-semibold ${
          isSelected ? 'text-[#C5A572]' : 'text-[#1B365D] hover:text-[#C5A572]'
        } transition-colors`}
        onClick={(e) => e.stopPropagation()}
      >
        {name}
      </a>
    </div>
    <p className="text-gray-600 mb-2 pl-6">{description}</p>
    <p className="text-sm text-gray-500 pl-6">{address}</p>
  </div>
);

const NeighborhoodPage: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<MarkerType[]>([]);

  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: apiKey,
          version: "weekly",
          libraries: ["places", "marker"],
          mapIds: [mapId]  // Add your Map ID here
        });

        // Load the Google Maps script
        await loader.load();

        // Import required libraries
        const { Map } = await window.google.maps.importLibrary("maps") as google.maps.MapsLibrary;
        const { AdvancedMarkerElement, PinElement } = await window.google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
        
        if (!mapRef.current) return;

        const mapOptions = {
          center: { lat: 40.7138, lng: -73.9624 },
          zoom: 15,
          mapId: mapId,
          restriction: {
            latLngBounds: WILLIAMSBURG_BOUNDS,
            strictBounds: true,
          },
          disableDefaultUI: true,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false
        };

        const map = new Map(mapRef.current, mapOptions);
        googleMapRef.current = map;

        // Create markers for all locations
        const allLocations = [...locations.parks, ...locations.food];
        markersRef.current = allLocations.map(location => {
          // Create the container for the marker
          const container = document.createElement('div');
          container.className = 'marker-container';
          container.style.position = 'relative';
          
          // Create pin container
          const pinContainer = document.createElement('div');
          pinContainer.style.position = 'absolute';
          pinContainer.style.left = '50%';
          pinContainer.style.transform = 'translateX(-50%)';
          pinContainer.style.bottom = '24px'; // Add space above label
          
          // Create pin element
          const pin = new PinElement({
            background: '#C5A572',
            borderColor: '#1B365D',
            glyphColor: '#1B365D',
          });

          // Create label element
          const label = document.createElement('div');
          label.className = 'marker-label';
          label.style.position = 'relative';
          label.style.textAlign = 'center';
          label.innerHTML = `
            <div class="bg-white px-2 py-1 rounded shadow-md text-sm">
              <span class="font-medium text-[#1B365D]">${location.name}</span>
            </div>
          `;

          // Assemble the marker
          pinContainer.appendChild(pin.element);
          container.appendChild(label);
          container.appendChild(pinContainer);

          const marker = new AdvancedMarkerElement({
            position: location.coordinates,
            map,
            content: container,
            title: location.name,
          }) as MarkerType;

          // Add click listener
          marker.addListener('click', () => {
            setSelectedLocation(location);
          });

          return marker;
        });

        setMapLoaded(true);
      } catch (error) {
        console.error('Error loading map:', error);
        setMapError('Failed to load map');
      }
    };

    initMap();
  }, []);

  useEffect(() => {
    if (selectedLocation && googleMapRef.current) {
      googleMapRef.current.panTo(selectedLocation.coordinates);
      googleMapRef.current.setZoom(17);

      // Update markers styles
      markersRef.current.forEach(marker => {
        if (marker.content) {
          const pin = marker.content.querySelector('.gmp-pin') as HTMLElement;
          const label = marker.content.querySelector('.marker-label') as HTMLElement;
          
          // if (marker.title === selectedLocation.name) {
          //   pin.style.setProperty('--gmpx-color__surface', '#1B365D');
          //   pin.style.setProperty('--gmpx-color__on-surface', '#C5A572');
          //   label.style.transform = 'scale(1.05)';
          // } else {
          //   pin.style.setProperty('--gmpx-color__surface', '#C5A572');
          //   pin.style.setProperty('--gmpx-color__on-surface', '#1B365D');
          //   label.style.transform = 'scale(1)';
          // }
        }
      });
    }
  }, [selectedLocation]);

  return (
    <div className="min-h-screen bg-[#112543] p-8">
      <div className="max-w-2xl mx-auto px-8 py-24 relative">
        <div className="absolute inset-0 bg-white/95 rounded-xl shadow-lg" />
        
        <div className="relative z-10">
          {/* Main content */}
          <div className="text-center space-y-8 mb-16">
            <h2 className="text-[#1B365D] tracking-wide text-sm">WELCOME TO</h2>
            <h1 className="text-4xl font-serif tracking-wide text-[#1B365D]">
              Williamsburg
            </h1>
            <p className="text-[#1B365D] mt-3">Our favorite spots in the neighborhood</p>
          </div>

          <div className="space-y-12">
            {/* Map Section */}
            <div className="h-96 rounded-lg overflow-hidden shadow-lg mb-12">
              {mapError ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                  {mapError}
                </div>
              ) : (
                <div ref={mapRef} className="w-full h-full" />
              )}
            </div>

            {/* Parks Section */}
            <div>
              <div className="flex items-center mb-6">
                <LandPlot className="w-5 h-5 mr-2 text-[#1B365D]" />
                <h2 className="text-xl font-medium text-[#1B365D]">Parks & Waterfront</h2>
              </div>
              {locations.parks.map((location) => (
                <LocationCard 
                  key={location.name} 
                  {...location} 
                  isSelected={selectedLocation?.name === location.name}
                  onSelect={() => setSelectedLocation(location)}
                />
              ))}
            </div>

            {/* Food Section */}
            <div>
              <div className="flex items-center mb-6">
                <Utensils className="w-5 h-5 mr-2 text-[#1B365D]" />
                <h2 className="text-xl font-medium text-[#1B365D]">Food & Drinks</h2>
              </div>
              {locations.food.map((location) => (
                <LocationCard 
                  key={location.name} 
                  {...location} 
                  isSelected={selectedLocation?.name === location.name}
                  onSelect={() => setSelectedLocation(location)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeighborhoodPage;