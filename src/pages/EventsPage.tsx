import React, { useState, useRef, useEffect } from 'react';
import { Calendar, MapPin, CalendarPlus } from 'lucide-react';
import { loader, mapId } from '../utils/mapUtils';
import PageTemplate from "../components/PageTemplate";

// Helper function to generate calendar links
const generateCalendarLink = (event: typeof EVENTS[0]) => {
  const startDate = new Date(event.date + ' ' + event.time);
  const endDate = new Date(startDate.getTime() + (2 * 60 * 60 * 1000)); // Adding 2 hours as default duration
  
  const formatDateForGoogle = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d+/g, '');
  };

  const details = `${event.description}\n\nLocation: ${event.location}\nAddress: ${event.address}`;
  
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name)}&dates=${formatDateForGoogle(startDate)}/${formatDateForGoogle(endDate)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(event.address)}`;
};

const EVENTS = [
  {
    name: "Rehearsal Dinner",
    date: "November 14, 2025",
    day: "Thursday",
    time: "7:00 PM",
    location: "The Four Horsemen",
    description: "Join us for an intimate rehearsal dinner with close family and wedding party.",
    address: "295 Grand St, Brooklyn, NY 11211",
    mapUrl: "https://maps.app.goo.gl/v5u8VKwbU5qLwNWR7",
    coordinates: {
      lat: 40.7124,
      lng: -73.9577
    }
  },
  {
    name: "Wedding Party Photos",
    date: "November 15, 2025",
    day: "Friday",
    time: "3:00 PM",
    location: "Domino Park",
    description: "Wedding party photos with Manhattan skyline backdrop.",
    address: "15 River St, Brooklyn, NY 11249",
    mapUrl: "https://maps.app.goo.gl/F9fWaYX142uTNLrs6",
    coordinates: {
      lat: 40.7147,
      lng: -73.9670
    }
  },
  {
    name: "Wedding Ceremony & Reception",
    date: "November 15, 2025",
    day: "Friday",
    time: "6:00 PM",
    location: "Aurora Restaurant",
    description: "Ceremony followed by cocktail hour and reception.",
    address: "70 Grand Street, Brooklyn, NY",
    mapUrl: "https://maps.app.goo.gl/XgpetCEfV694dqG78",
    coordinates: {
      lat: 40.7157,
      lng: -73.9607
    }
  },
  {
    name: "Farewell Brunch",
    date: "November 16, 2025",
    day: "Saturday",
    time: "11:00 AM",
    location: "Egg Shop",
    description: "Join us for a casual farewell brunch.",
    address: "138 N 8th St, Brooklyn, NY 11249",
    mapUrl: "https://maps.app.goo.gl/as7cPTF8VV8AV9Xt7",
    coordinates: {
      lat: 40.7197,
      lng: -73.9556
    }
  }
];

// Group events by date
const eventsByDate = EVENTS.reduce((acc, event) => {
  if (!acc[event.date]) {
    acc[event.date] = {
      day: event.day,
      events: []
    };
  }
  acc[event.date].events.push(event);
  return acc;
}, {} as Record<string, { day: string, events: typeof EVENTS }>);

interface EventMapProps {
  coordinates: {
    lat: number;
    lng: number;
  };
  name: string;
}

const EventMap: React.FC<EventMapProps> = ({ coordinates, name }) => {
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
          center: coordinates,
          zoom: 15,
          mapId,
          disableDefaultUI: true,
          gestureHandling: "none",
          zoomControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false
        });

        const pin = new PinElement({
          background: '#ccac6c',
          borderColor: '#1B365D',
          glyphColor: '#1B365D',
          scale: 0.8
        });

        new AdvancedMarkerElement({
          position: coordinates,
          map,
          content: pin.element,
          title: name
        });

      } catch (error) {
        console.error('Error loading map:', error);
        setMapError('Failed to load map');
      }
    };

    initMap();
  }, [coordinates, name]);

  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-md">
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

const EventsPage: React.FC = () => {
  return (
    <PageTemplate
      title="Schedule of Events"
      subtitle="Currently subject to change."
    >
    <div>
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Calendar className="w-6 h-6 mr-2 text-[#1B365D]" />
          <h2 className="text-2xl font-medium text-[#1B365D]">Weekend Activities</h2>
        </div>
      </div>

      <div className="space-y-16 mr-12 ml-12">
        {Object.entries(eventsByDate).map(([date, { day, events }]) => (
          <div key={date}>
            {/* Date Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-serif text-[#1B365D] mb-1">{day}</h2>
              <p className="text-lg text-gray-500">{date}</p>
            </div>

            {/* Events for this date */}
            <div className="space-y-12">
              {events.map((event) => (
                <div 
                  key={event.name}
                  className="p-6 rounded-lg hover:bg-[#1B365D]/5 transition-colors"
                >
                  {/* Event Info */}
                  <div className="flex flex-col md:flex-row md:items-start md:space-x-6 space-y-6 md:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-medium text-[#1B365D]">
                          {event.name}
                        </h3>
                      </div>
                      <p className="text-gray-600 mb-4">{event.description}</p>
                      <div className="space-y-1 text-sm text-gray-500">
                        <p className="font-medium">{event.time}</p>
                        <div className="flex">
                          <MapPin className="w-4 h-4 mt-4 mr-2 flex-shrink-0" />
                          <div>
                            <a 
                              href={event.mapUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-[#ccac6c] transition-colors block"
                            >
                              {event.location}
                            </a>
                            <p className="text-gray-400">{event.address}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 w-full md:w-48">
                      {/* Event Location Map */}
                      <div className="w-full md:w-48 h-48 md:h-32">
                        <EventMap 
                          coordinates={event.coordinates}
                          name={event.location}
                        />
                      </div>
                      {/* Add to Calendar Button */}
                      <a
                        href={generateCalendarLink(event)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center px-3 py-2 rounded-md bg-[#1B365D]/10 text-[#1B365D] hover:bg-[#1B365D]/20 transition-colors text-sm"
                      >
                        <CalendarPlus className="w-4 h-4 inline-block mr-1" />
                        Add to Calendar
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      </div>
    </PageTemplate>
  );
};

export default EventsPage;