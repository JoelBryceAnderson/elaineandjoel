// A single guest, either from the invite list or added as a +1
export interface Guest {
  firstName: string;
  lastName: string;
}

// The response for a single guest, including their RSVP status and details
export interface GuestResponse extends Guest {
  attending: boolean;
  dietaryRestrictions?: string;
}

// The main data structure for a party, fetched from the backend
export interface RsvpData {
  partyId: string;
  guestGroup: {
    guests: Guest[];
    allowedEvents: string[];
    additionalGuests: number; // Renamed from maxGuests
  };
  response?: RsvpResponse; // Optional, if they've already responded
}

// The complete RSVP submission from the frontend
export interface RsvpResponse {
  guests: GuestResponse[];
  songRequest?: string;
  submittedAt: string;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  description: string;
  location: string;
}