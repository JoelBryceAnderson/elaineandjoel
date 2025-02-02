export interface RsvpData {
  inviteCode: string;
  guestGroup: {
    maxGuests: number;
    allowedEvents: string[];
    primaryContact: string;
  };
  response?: {
    attending: boolean;
    guestCount: number;
    guestNames: string[];
    dietaryRestrictions: string[];
    songRequest: string;
    submittedAt: string;
  };
}

export interface Event {
  id: string;
  name: string;
  date: string;
  description: string;
  location: string;
}