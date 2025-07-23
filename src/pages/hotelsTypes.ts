export interface Location {
  name: string;
  description: string;
  address: string;
  mapUrl: string;
  websiteUrl: string;
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
  name: "Moxy Williamsburg",
  description: "Our suggested hotel for out-of-town guests. This is the closest hotel to the venue.",
  address: "247 Metropolitan Ave, Brooklyn, NY 11211",
  mapUrl: "https://maps.app.goo.gl/jRnnjdkJrXdGftMv5",
  websiteUrl: "https://www.marriott.com/en-us/hotels/nycxb-moxy-brooklyn-williamsburg/overview/?scid=f2ae0541-1279-4f24-b197-a979c79310b0",
  coordinates: {
    lat: 40.7117,
    lng: -73.9629
  }
};

export const VENUE: Location = {
  name: "Aurora Restaurant",
  description: "Wedding venue - ceremony and reception.",
  address: "70 Grand Street, Brooklyn, NY",
  mapUrl: "https://maps.app.goo.gl/XgpetCEfV694dqG78",
  websiteUrl: "https://www.aurorabk.com",
  coordinates: {
    lat: 40.7157,
    lng: -73.9667
  }
};

export const AIRPORTS: Airport[] = [
    {
    name: "LaGuardia Airport",
    code: "LGA",
    description: "Domestic airport with flights from across the United States.\nWhile any NYC area airport will work, we strongly suggest LaGuardia for its proximity to Williamsburg.",
    address: "Queens, NY 11371",
    mapUrl: "https://maps.app.goo.gl/YnWztQErTnfZ7Czo8",
    websiteUrl: "",
    coordinates: {
      lat: 40.7769,
      lng: -73.8740
    },
    travelInfo: {
      drivingTime: "30-45 minutes",
      distance: "7.8 miles"
    }
  },
];

export const ALT_HOTELS: Location[] = [
    {
    name: "Coda Hotel",
    description: "Slightly more upscale hotel just off of McCarren Park. A bit farther from the venue.",
    address: "160 N 12th St, Brooklyn, NY 11249",
    mapUrl: "https://maps.app.goo.gl/ZsfdJXKUY6KD3XDFA",
    websiteUrl: "https://www.codahotels.com",
    coordinates: {
      lat: 40.7212,
      lng: -73.9555
    }
  },
    {
    name: "The William Vale",
    description: "The high-end option. Beautiful city views, still within walking distance of (or a short cab ride to) the venue.",
    address: "111 N 12th St, Brooklyn, NY 11249",
    mapUrl: "https://maps.app.goo.gl/yX19Aqm3BhLfj8QB8",
    websiteUrl: "https://www.thewilliamvale.com",
    coordinates: {
      lat: 40.7221,
      lng: -73.9565
    }
  },
    {
    name: "The Penny",
    description: "Another affordable option -- not withing walking distance, but a short cab ride away.",
    address: "288 N 8th St, Brooklyn, NY 11211",
    mapUrl: "https://maps.app.goo.gl/15LxRKmoPMYxZ7Mz5",
    websiteUrl: "https://www.penny-hotel.com",
    coordinates: {
      lat: 40.7221,
      lng: -73.9565
    }
  },
];

export const NYC_BOUNDS = {
  north: 40.9176,  // Upper Bronx
  south: 40.4774,  // Lower Staten Island
  west: -74.2590,  // Western New Jersey
  east: -73.7002   // Eastern Queens
};