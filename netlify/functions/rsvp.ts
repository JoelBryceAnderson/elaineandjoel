import { Handler } from '@netlify/functions';
import { google } from 'googleapis';
import { RsvpData } from '../../src/server/api/types';

// Configure Google Sheets authentication
const credentials = {
  client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
  private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n')
};

const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

async function getGoogleSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  return google.sheets({ version: 'v4', auth });
}

async function findRsvpByInviteCode(sheets: any, inviteCode: string): Promise<RsvpData | null> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Invites!A:F' // Adjust range as needed
    });

    const rows = response.data.values || [];
    const headers = rows[0];
    const inviteCodeIndex = headers.indexOf('InviteCode');
    
    const matchingRowIndex = rows.findIndex((row: string[]) => row[inviteCodeIndex] === inviteCode);
    
    if (matchingRowIndex === -1) return null;

    // Map row to RsvpData structure
    return {
      inviteCode,
      guestGroup: {
        maxGuests: parseInt(rows[matchingRowIndex][headers.indexOf('MaxGuests')] || '2'),
        allowedEvents: rows[matchingRowIndex][headers.indexOf('AllowedEvents')]?.split(',') || [],
        primaryContact: rows[matchingRowIndex][headers.indexOf('PrimaryContact')] || ''
      }
    };
  } catch (error) {
    console.error('Error fetching RSVP data:', error);
    return null;
  }
}

async function updateRsvpResponse(sheets: any, inviteCode: string, rsvpResponse: RsvpData['response']) {
  try {
    const sheetsResponse = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Responses!A:G', // Adjust range as needed
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [[
          inviteCode,
          rsvpResponse?.attending ? 'Yes' : 'No',
          rsvpResponse?.guestCount || 0,
          rsvpResponse?.guestNames?.join(', ') || '',
          rsvpResponse?.dietaryRestrictions?.join(', ') || '',
          rsvpResponse?.songRequest || '',
          new Date().toISOString()
        ]]
      }
    });

    return sheetsResponse.data;
  } catch (error) {
    console.error('Error submitting RSVP:', error);
    throw error;
  }
}

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

  // Validate required environment variables
  if (!process.env.GOOGLE_SHEETS_CLIENT_EMAIL || !process.env.GOOGLE_SHEETS_PRIVATE_KEY || !spreadsheetId) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Google Sheets configuration is missing' })
    };
  }

  try {
    const sheets = await getGoogleSheetsClient();

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

      const rsvpData = await findRsvpByInviteCode(sheets, inviteCode);

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
      const body = JSON.parse(event.body || '{}');
      const { inviteCode, response } = body;

      if (!inviteCode || !response) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid RSVP submission' })
        };
      }

      // Verify invite code exists first
      const existingRsvp = await findRsvpByInviteCode(sheets, inviteCode);
      
      if (!existingRsvp) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Invalid invite code' })
        };
      }

      // Submit response to Google Sheets
      await updateRsvpResponse(sheets, inviteCode, response);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          ...existingRsvp,
          response: {
            ...response,
            submittedAt: new Date().toISOString()
          }
        })
      };
    }

    // Method not allowed
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  } catch (error) {
    console.error('Unexpected error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: (error as Error).message })
    };
  }
};