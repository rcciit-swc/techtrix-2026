'use server';

import { google } from 'googleapis';

const SPONSOR_SHEET_ID = '1C6yftEz7WVazFNNZb2U78i2iQpzKBLFQBa01idEetH4';
const RANGE = 'Form Responses 1!B:B'; // Only fetch the Email address column

export async function checkUserSponsorProofAction(
  email: string
): Promise<boolean> {
  if (!email) return false;

  try {
    const authJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    if (!authJson) {
      console.warn('GOOGLE_SERVICE_ACCOUNT_JSON not found in environment');
      return false;
    }

    const credentials = JSON.parse(authJson);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPONSOR_SHEET_ID,
      range: RANGE,
    });
    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return false;
    }

    // Check if the user email exists in any of the rows (case-insensitive)
    // rows is an array of arrays, e.g., [['Email address'], ['user1@example.com'], ['user2@example.com']]
    const exists = rows.some(
      (row) => row[0]?.trim().toLowerCase() === email.trim().toLowerCase()
    );
    return exists;
  } catch (error) {
    console.error('Error checking sponsor proof via server action:', error);
    return false;
  }
}
