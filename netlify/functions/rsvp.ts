import { Handler } from '@netlify/functions';
import { RsvpData } from '../../src/server/api/types';

// Mock data - you'll replace this with your actual database logic
const mockRsvpData: Record<string, RsvpData> = {
  'JOEL2024': {
    inviteCode: 'JOEL2024',
    guestGroup: {
      maxGuests: 2,
      allowedEvents: ['Ceremony', 'Reception'],
      primaryContact: 'Joel Anderson'
    }
  },
  'ELAINE2024': {
    inviteCode: 'ELAINE2024',
    guestGroup: {
      maxGuests: 2,
      allowedEvents: ['Ceremony', 'Reception'],
      primaryContact: 'Elaine Wong'
    }
  }
};

export const handler: Handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: 'Preflight request successful'
    };
  }

  // GET request to fetch RSVP data
  if (event.httpMethod === 'GET') {
    const inviteCode = event.path.split('/').pop();
    
    if (!inviteCode) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid invite code' })
      };
    }

    const rsvpData = mockRsvpData[inviteCode];

    if (!rsvpData) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Invite code not found' })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(rsvpData)
    };
  }

  // POST request to submit RSVP
  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}');
      const { inviteCode, response } = body;

      if (!inviteCode || !response) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid RSVP submission' })
        };
      }

      // In a real implementation, you'd save this to a database
      const existingRsvp = mockRsvpData[inviteCode];
      
      if (!existingRsvp) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Invalid invite code' })
        };
      }

      // Update the RSVP response
      existingRsvp.response = {
        ...response,
        submittedAt: new Date().toISOString()
      };

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(existingRsvp)
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Internal server error' })
      };
    }
  }

  // Method not allowed
  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
};