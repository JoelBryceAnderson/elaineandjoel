import { RsvpData, RsvpResponse } from '../types/rsvp';

const API_BASE_URL = '/.netlify/functions/rsvp';

// Fetches the party details by providing the first and last name of a guest
export async function fetchRsvpData(firstName: string, lastName: string): Promise<RsvpData> {
  const response = await fetch(`${API_BASE_URL}?firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}`);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch RSVP data');
  }
  
  return response.json();
}

// Submits the completed RSVP form
export async function submitRsvp(partyId: string, rsvpResponse: RsvpResponse): Promise<void> {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      partyId,
      response: rsvpResponse,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to submit RSVP');
  }
}