import { google } from 'googleapis';
import { RsvpData } from './types';
import * as dotenv from 'dotenv';

dotenv.config();

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

class GoogleSheetsService {
  private auth;
  private sheets;

  constructor() {
    this.auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: SCOPES,
    });

    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
  }

  async getRsvpByInviteCode(inviteCode: string): Promise<RsvpData | null> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'RSVPs!A1:J'
      });

      const rows = response.data.values;
      if (!rows) return null;

      // Find the row with matching invite code
      const rsvpRow = rows.find(row => row[0] === inviteCode);
      if (!rsvpRow) return null;

      return {
        inviteCode,
        guestGroup: {
          maxGuests: parseInt(rsvpRow[1]),
          allowedEvents: JSON.parse(rsvpRow[2]),
          primaryContact: rsvpRow[3],
        },
        response: rsvpRow[4] ? {
          attending: rsvpRow[4] === 'true',
          guestCount: parseInt(rsvpRow[5]),
          guestNames: JSON.parse(rsvpRow[6]),
          dietaryRestrictions: JSON.parse(rsvpRow[7]),
          songRequest: rsvpRow[8],
          submittedAt: rsvpRow[9],
        } : undefined,
      };
    } catch (error) {
      console.error('Error fetching RSVP:', error);
      return null;
    }
  }

  async saveRsvpResponse(rsvpData: RsvpData): Promise<boolean> {
    try {
      // First get all rows to find the matching invite code
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'RSVPs!A1:J'
      });

      const rows = response.data.values;
      if (!rows) return false;

      // Find the row index with matching invite code (skip header row)
      const rowIndex = rows.findIndex((row, index) => index > 0 && row[0] === rsvpData.inviteCode);
      
      if (rowIndex === -1) {
        console.error('Could not find row with invite code:', rsvpData.inviteCode);
        return false;
      }

      // Update the existing row (add 1 to rowIndex because Google Sheets is 1-based)
      const range = `RSVPs!A${rowIndex + 1}:J${rowIndex + 1}`;
      console.log('Updating range:', range);  // Debug log
      
      const values = [
        [
          rsvpData.inviteCode,
          rsvpData.guestGroup.maxGuests,
          JSON.stringify(rsvpData.guestGroup.allowedEvents),
          rsvpData.guestGroup.primaryContact,
          rsvpData.response?.attending.toString(),
          rsvpData.response?.guestCount,
          JSON.stringify(rsvpData.response?.guestNames),
          JSON.stringify(rsvpData.response?.dietaryRestrictions),
          rsvpData.response?.songRequest,
          new Date().toISOString(),
        ],
      ];

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: range,
        valueInputOption: 'RAW',
        requestBody: {
          values,
        },
      });

      return true;
    } catch (error) {
      console.error('Error saving RSVP:', error);
      return false;
    }
  }
}

export const sheetsService = new GoogleSheetsService();