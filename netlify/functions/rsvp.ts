import { Handler } from '@netlify/functions';
import { google } from 'googleapis';
import { RsvpData, RsvpResponse } from '../../src/types/rsvp';

// Configure Google Sheets authentication
const credentials = {
  client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
  // This line is now fixed to correctly handle newlines in the private key
  private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY
};

const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

async function getGoogleSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  return google.sheets({ version: 'v4', auth });
}

// Finds a guest's party by their first and last name
async function findPartyByGuestName(sheets: any, firstName: string, lastName: string): Promise<RsvpData | null> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      // Assumes columns: PartyID, FirstName, LastName, AllowedEvents, AdditionalGuests
      range: 'Invites!A:E' 
    });

    const rows = response.data.values || [];
    if (rows.length === 0) return null;

    const headers = rows[0];
    const firstNameIndex = headers.indexOf('FirstName');
    const lastNameIndex = headers.indexOf('LastName');
    const partyIdIndex = headers.indexOf('PartyID');

    // Find the row for the guest who is searching
    const guestRow = rows.find((row: string[]) => 
      row[firstNameIndex]?.trim().toLowerCase() === firstName.trim().toLowerCase() &&
      row[lastNameIndex]?.trim().toLowerCase() === lastName.trim().toLowerCase()
    );

    if (!guestRow) return null;

    const partyId = guestRow[partyIdIndex];
    // Find all guests belonging to the same party
    const partyRows = rows.filter((row: string[]) => row[partyIdIndex] === partyId);

    if (partyRows.length === 0) return null;

    const firstRowOfParty = partyRows[0];
    const allowedEventsIndex = headers.indexOf('AllowedEvents');
    const additionalGuestsIndex = headers.indexOf('AdditionalGuests');

    // Construct the party data object
    return {
      partyId: partyId,
      guestGroup: {
        guests: partyRows.map(row => ({
          firstName: row[firstNameIndex],
          lastName: row[lastNameIndex]
        })),
        allowedEvents: firstRowOfParty[allowedEventsIndex]?.split(',').map((s: string) => s.trim()) || [],
        additionalGuests: parseInt(firstRowOfParty[additionalGuestsIndex] || '0'),
      }
    };
  } catch (error) {
    console.error('Error fetching RSVP data by guest name:', error);
    return null;
  }
}

// Appends the RSVP responses to the 'Responses' sheet
async function updateRsvpResponse(sheets: any, partyId: string, rsvpResponse: RsvpResponse) {
  try {
    if (!rsvpResponse || !rsvpResponse.guests) {
      throw new Error("Invalid RSVP response format");
    }

    // Create a row for each guest in the response
    const values = rsvpResponse.guests.map(guest => [
      partyId,
      `${guest.firstName} ${guest.lastName}`,
      guest.attending ? 'Yes' : 'No',
      guest.dietaryRestrictions || '',
      rsvpResponse.songRequest || '',
      new Date().toISOString()
    ]);

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      // Assumes columns: PartyID, GuestName, Attending, DietaryRestrictions, SongRequest, SubmissionDate
      range: 'Responses!A:F', 
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: values
      }
    });

  } catch (error) {
    console.error('Error submitting RSVP:', error);
    throw error;
  }
}

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: 'Success' };
  }

  if (!process.env.GOOGLE_SHEETS_CLIENT_EMAIL || !process.env.GOOGLE_SHEETS_PRIVATE_KEY || !spreadsheetId) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Google Sheets configuration is missing' }) };
  }

  try {
    const sheets = await getGoogleSheetsClient();

    // GET request to fetch party data by name
    if (event.httpMethod === 'GET') {
      const firstName = event.queryStringParameters?.firstName;
      const lastName = event.queryStringParameters?.lastName;

      if (!firstName || !lastName) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'First and last name are required' }) };
      }

      const rsvpData = await findPartyByGuestName(sheets, firstName, lastName);

      if (!rsvpData) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Guest not found' }) };
      }

      return { statusCode: 200, headers, body: JSON.stringify(rsvpData) };
    }

    // POST request to submit the RSVP
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { partyId, response } = body;

      if (!partyId || !response) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid RSVP submission' }) };
      }

      await updateRsvpResponse(sheets, partyId, response);

      return { statusCode: 200, headers, body: JSON.stringify({ message: 'RSVP submitted successfully' }) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  } catch (error) {
    console.error('Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error', details: errorMessage }) };
  }
};