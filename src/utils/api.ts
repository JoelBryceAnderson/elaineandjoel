import { RsvpData } from '../server/api/types';

// Use Netlify function endpoint
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/.netlify/functions';

export const fetchRsvpData = async (inviteCode: string): Promise<RsvpData> => {
  const response = await fetch(`${API_BASE_URL}/rsvp/${inviteCode}`);
  if (!response.ok) {
    throw new Error('Invalid invite code');
  }
  return response.json();
};

export const submitRsvp = async (inviteCode: string, rsvpResponse: RsvpData['response']): Promise<RsvpData> => {
  const response = await fetch(`${API_BASE_URL}/rsvp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inviteCode, response: rsvpResponse }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to submit RSVP');
  }
  
  return response.json();
};