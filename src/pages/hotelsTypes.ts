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
  description: "Our suggested hotel for out-of-town guests.",
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
    description: "Domestic airport with flights from across the United States.\n\nWhile any NYC area airport will work, we strongly suggest LaGuardia for its proximity to Williamsburg.",
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

export const NYC_BOUNDS = {
  north: 40.9176,  // Upper Bronx
  south: 40.4774,  // Lower Staten Island
  west: -74.2590,  // Western New Jersey
  east: -73.7002   // Eastern Queens
};