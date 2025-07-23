import React, { useState, useRef, useEffect } from 'react';
import { MapPin, LandPlot, Utensils } from 'lucide-react';
import { loader, mapId } from '../utils/mapUtils';
import PageTemplate from "../components/PageTemplate";

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
  coffee: Location[];
}

const locations: LocationCategories = {
  parks: [
    {
      name: "Domino Park",
      description: "Waterfront park with stunning Manhattan views, featuring an elevated walkway, fountain plaza, and playground.",
      address: "15 River St, Brooklyn, NY 11249",
      mapUrl: "https://maps.app.goo.gl/F9fWaYX142uTNLrs6",
      coordinates: {
        lat: 40.7147,
        lng: -73.9670
      }
    },
    {
      name: "Bushwick Inlet Park",
      description: "Waterfront green space perfect for picnics and recreational activities with skyline views.",
      address: "50 Kent Ave, Brooklyn, NY 11249",
      mapUrl: "https://maps.app.goo.gl/LSWdCG5u2hYtwEvXA",
      coordinates: {
        lat: 40.7232,
        lng: -73.9591
      }
    }
  ],
  coffee: [
    {
      name: "Oslo Coffee Roasters",
      description: "Tasty coffee close to the Moxy hotel.",
      address: "328 Bedford Ave, Brooklyn, NY 11249",
      mapUrl: "https://maps.app.goo.gl/HjwVoJM65WM5C5Nj6",
      coordinates: {
        lat: 40.7134,
        lng: -73.9622
      }
    }
  ],
  food: [
    {
      name: "L'industrie Pizzeria",
      description: "The neighborhood's (and possibly the city's) best pizza. Elaine loves their fig jam & bacon slice.",
      address: "254 S 2nd St, Brooklyn, NY 11211",
      mapUrl: "https://maps.app.goo.gl/RsP7MzGcDGH9ZLRf9",
      coordinates: {
        lat: 40.7124,
        lng: -73.9577
      }
    },
    {
      name: "Court Street Grocers",
      description: "Joel & Elaine's go-to work lunch: enormous, tasty sandwiches. Joel loves the Turkish Delight.",
      address: "378 Metropolitan Ave, Brooklyn, NY 11211",
      mapUrl: "https://maps.app.goo.gl/guwHDZkGb3oa7izP7",
      coordinates: {
        lat: 40.7140,
        lng: -73.9555
      }
    },
    {
      name: "Leon's Bagels",
      description: "Our local bagel shop. Joel & Elaine both love their everything bagel with jalapeño cream cheese.",
      address: "128 Bedford Ave Suite B, Brooklyn, NY 11249",
      mapUrl: "https://maps.app.goo.gl/bhmTLbLbobFyFE2d9",
      coordinates: {
        lat: 40.7196,
        lng: -73.9561
      }
    },
    {
      name: "Fish Cheeks",
      description: "Elaine’s favorite Thai restaurant. Joel did cry once because the spice level was too high so beware.",
      address: "661 Driggs Ave, Brooklyn, NY 11211",
      mapUrl: "https://maps.app.goo.gl/G669b5saxviW15c89",
      coordinates: {
        lat: 40.7146,
        lng: -73.9588
      }
    }
  ]
};

const WILLIAMSBURG_BOUNDS = {
  north: 40.7492, // Up to around Greenpoint/Long Island City
  south: 40.6893, // Down to Navy Yard/South Williamsburg
  west: -74.0096, // Over to East Village/Lower Manhattan
  east: -73.9144  // Out to Bushwick/East Williamsburg
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
        isSelected ? 'text-[#ccac6c]' : 'text-[#1B365D]'
      }`} />
      <a 
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`font-semibold ${
          isSelected ? 'text-[#ccac6c]' : 'text-[#1B365D] hover:text-[#ccac6c]'
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
  const [mapError, setMapError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<MarkerType[]>([]);

  useEffect(() => {
    const initMap = async () => {
      try {
        // Load the Google Maps script
        await loader.load();

        // Import required libraries
        const { Map } = await window.google.maps.importLibrary("maps") as google.maps.MapsLibrary;
        const { AdvancedMarkerElement, PinElement } = await window.google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
        
        if (!mapRef.current) return;

        const mapOptions = {
          center: { lat: 40.7182, lng: -73.9596 },
          zoom: 10,
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
        const allLocations = [...locations.parks, ...locations.food, ...locations.coffee];
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
            background: '#ccac6c',
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
      } catch (error) {
        console.error('Error loading map:', error);
        setMapError('Failed to load map');
      }
    };

    initMap();
  }, []);

  useEffect(() => {
    if (selectedLocation && googleMapRef.current) {
      const map = googleMapRef.current;

      map.setZoom(10);
      
      // Simple pan
      map.panTo(selectedLocation.coordinates);
      
      // Ensure zoom transition is smooth
      google.maps.event.addListenerOnce(map, 'idle', () => {
        map.setZoom(17);
      });
    }
  }, [selectedLocation]);

  return (
    <PageTemplate
      title="Williamsburg, BK"
      subtitle="Our favorite spots in the neighborhood."
    >          
        <div className="ml-12 mr-12">
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

              {/* Food Section */}
              <div>
                <div className="flex items-center mb-6">
                  <Utensils className="w-5 h-5 mr-2 text-[#1B365D]" />
                  <h2 className="text-xl font-medium text-[#1B365D]">Coffee</h2>
                </div>
                {locations.coffee.map((location) => (
                  <LocationCard 
                    key={location.name} 
                    {...location} 
                    isSelected={selectedLocation?.name === location.name}
                    onSelect={() => setSelectedLocation(location)}
                  />
                ))}
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

          </div>
        </div>
      </PageTemplate>
  );
};

export default NeighborhoodPage;