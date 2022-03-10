import fs from "fs";
import readline from "readline";
import { google } from "googleapis";
import { GoogleAuth } from "google-auth-library";
import { JSONClient } from "google-auth-library/build/src/auth/googleauth";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
async function main(auth: GoogleAuth<JSONClient>) {
  const authClient = await auth.getClient();

  const sheets = google.sheets({ version: "v4", auth: authClient });
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env["SPREADSHEET_ID"],
      range: "Data!A2:C",
    });
    const rows = res.data.values;
    if (rows && rows.length) {
      console.log("label, now, date");
      rows.map((row) => {
        console.log(`${row[0]}, ${row[1]}, ${row[2]}`);
      });
    } else {
      console.log("No data found.");
    }
    // https://stackoverflow.com/questions/48987861/google-sheets-api-append-method-last-on-top
    const sheetId = 0;
    const now = Date.now();
    const request = {
      spreadsheetId: process.env["SPREADSHEET_ID"],
      resource: {
        requests: [
          {
            insertRange: {
              range: {
                sheetId,
                startRowIndex: 1,
                endRowIndex: 2,
              },
              shiftDimension: "ROWS",
            },
          },
          {
            pasteData: {
              data: `now, ${now}, ${new Date(now).toString()}`,
              type: "PASTE_NORMAL",
              delimiter: ",",
              coordinate: {
                sheetId,
                rowIndex: 1,
              },
            },
          },
        ],
      },
    };
    const addRes = await sheets.spreadsheets.batchUpdate(request);
  } catch (err) {
    console.log("The API returned an error: " + err);
  }
}
const auth = new google.auth.GoogleAuth({
  scopes: SCOPES,
});
main(auth);
