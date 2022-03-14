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
    const spreadsheetId = process.env["SPREADSHEET_ID"];
    const sheetName = "Data";

    // スプレッドシートへ値を追加.
    const now = Date.now();
    const request = {
      spreadsheetId,
      range: `${sheetName}!A2:C`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      resource: {
        majorDimension: "ROWS",
        values: `now, ${now}, ${new Date(now).toString()}`,
      },
      auth: authClient,
    };
    await sheets.spreadsheets.values.append(request);

    // スプレッドシートから値を取得.
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A2:C`,
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
  } catch (err) {
    console.log("The API returned an error: " + err);
    process.exit(1);
  }
}
const auth = new google.auth.GoogleAuth({
  scopes: SCOPES,
});
main(auth);
