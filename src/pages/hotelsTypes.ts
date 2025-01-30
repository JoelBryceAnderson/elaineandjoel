export interface Location {
  name: string;
  description: string;
  address: string;
  mapUrl: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Airport extends Location {
  code: string;
  travelInfo: {
    drivingTime: string;
    distance: string;
  };
}

export const HOTEL: Location = {
  name: "Arlo Williamsburg",
  description: "Our suggested hotel for out-of-town guests. More details on room blocks coming soon!",
  address: "96 Wythe Ave, Brooklyn, NY 11249",
  mapUrl: "https://maps.app.goo.gl/Lj8LF8FSfSbsf8Zu7",
  coordinates: {
    lat: 40.7215,
    lng: -73.9577
  }
};

export const VENUE: Location = {
  name: "Aurora Restaurant",
  description: "Wedding venue - ceremony and reception.",
  address: "70 Grand Street, Brooklyn, NY",
  mapUrl: "https://maps.app.goo.gl/XgpetCEfV694dqG78",
  coordinates: {
    lat: 40.7157,
    lng: -73.9667
  }
};

export const AIRPORTS: Airport[] = [
    {
    name: "LaGuardia Airport",
    code: "LGA",
    description: "Domestic airport with flights from across the United States. Our recommended airport.",
    address: "Queens, NY 11371",
    mapUrl: "https://maps.app.goo.gl/YnWztQErTnfZ7Czo8",
    coordinates: {
      lat: 40.7769,
      lng: -73.8740
    },
    travelInfo: {
      drivingTime: "30-45 minutes",
      distance: "8.5 miles"
    }
  },
  {
    name: "JFK International Airport",
    code: "JFK",
    description: "Major international airport with flights from around the world.",
    address: "Queens, NY 11430",
    mapUrl: "https://maps.app.goo.gl/jjxxqWQqLx826Pfm8",
    coordinates: {
      lat: 40.6413,
      lng: -73.7781
    },
    travelInfo: {
      drivingTime: "45-60 minutes",
      distance: "15.5 miles"
    }
  },
  {
    name: "Newark Liberty International Airport",
    code: "EWR",
    description: "International airport serving the New York/New Jersey area.",
    address: "3 Brewster Rd, Newark, NJ 07114",
    mapUrl: "https://maps.app.goo.gl/R9DjVP7sWb7HFGF57",
    coordinates: {
      lat: 40.6895,
      lng: -74.1745
    },
    travelInfo: {
      drivingTime: "60-75 minutes",
      distance: "13.5 miles"
    }
  }
];

export const NYC_BOUNDS = {
  north: 40.9176,  // Upper Bronx
  south: 40.4774,  // Lower Staten Island
  west: -74.2590,  // Western New Jersey
  east: -73.7002   // Eastern Queens
};