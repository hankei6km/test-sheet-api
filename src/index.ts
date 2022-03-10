import fs from "fs";
import readline from "readline";
import { google } from "googleapis";
import { GoogleAuth } from "google-auth-library";
import { JSONClient } from "google-auth-library/build/src/auth/googleauth";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
async function main(auth: GoogleAuth<JSONClient>) {
  const authClient = await auth.getClient();

  const sheets = google.sheets({ version: "v4", auth: authClient });
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env["SPREADSHEET_ID"],
      range: "Class Data!A2:E",
    });
    const rows = res.data.values;
    if (rows && rows.length) {
      console.log("Name, Major:");
      // Print columns A and E, which correspond to indices 0 and 4.
      rows.map((row) => {
        console.log(`${row[0]}, ${row[4]}`);
      });
    } else {
      console.log("No data found.");
    }
  } catch (err) {
    console.log("The API returned an error: " + err);
  }
}
const auth = new google.auth.GoogleAuth({
  scopes: SCOPES,
});
main(auth);
