import React, { useState, useRef, useEffect } from 'react';
import { Calendar, MapPin, CalendarPlus } from 'lucide-react';
import { loader, mapId } from '../utils/mapUtils';
import PageTemplate from "../components/PageTemplate";

// Helper function to generate calendar links
const generateCalendarLink = (event: typeof EVENTS[0]) => {
  const startDate = new Date(event.date + ' ' + event.startTime);
  const endDate = new Date(event.date + ' ' + event.endTime); // Adding 2 hours as default duration
  
  const formatDateForGoogle = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d+/g, '');
  };

  const details = `${event.description}\n\nLocation: ${event.location}\nAddress: ${event.address}`;
  
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name)}&dates=${formatDateForGoogle(startDate)}/${formatDateForGoogle(endDate)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(event.address)}`;
};

const EVENTS = [
  {
    name: "Arrival Happy Hour",
    date: "November 14, 2025",
    day: "Friday",
    startTime: "7:00 PM",
    endTime: "10:00 PM",
    location: "The Cactus Shop",
    description: "Join us for a relaxed welcome party at one of our favorite local Mexican cantinas. It's a casual, drop-in style event, so please come and go as you please. While there's no open bar, food and drinks will be available for you to order.",
    address: "231 Kent Ave, Brooklyn, NY 11249",
    mapUrl: "https://maps.app.goo.gl/qGD9SV3JD72ZuCBN6",
    coordinates: {
      lat: 40.7168,
      lng: -73.9653
    }
  },
  {
    name: "Wedding Ceremony & Reception",
    date: "November 15, 2025",
    day: "Saturday",
    startTime: "6:00 PM",
    endTime: "11:00 PM",
    location: "Aurora Restaurant",
    description: "Doors open at 6:00 PM. Ceremony at 6:30 PM followed by cocktail hour and reception. Dress code is cocktail attire.",
    address: "70 Grand Street, Brooklyn, NY",
    mapUrl: "https://maps.app.goo.gl/XgpetCEfV694dqG78",
    coordinates: {
      lat: 40.7158,
      lng: -73.9647
    }
  },
  {
    name: "Post-Wedding Pow-Wow",
    date: "November 16, 2025",
    day: "Sunday",
    startTime: "2:00 PM",
    endTime: "4:00 PM",
    location: "TBD",
    description: "Join us to say farewell on Sunday! Location TBD.",
    address: "855 Lorimer St, Brooklyn, NY 11222",
    mapUrl: "https://maps.app.goo.gl/3PnVzra8XCsoqaS99",
    coordinates: {
      lat: 40.7220,
      lng: -73.9518
    }
  },
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
                        <p className="font-medium">{event.startTime} - {event.endTime}</p>
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