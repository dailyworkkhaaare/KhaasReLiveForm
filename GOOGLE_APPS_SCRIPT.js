// INSTRUCTIONS:
// 1. Go to https://script.google.com/
// 2. Open your project.
// 3. Replace the content of 'Code.gs' with this code.
// 4. Click 'Deploy' > 'Manage Deployments' > 'Edit' (pencil icon) > Version: 'New version' > 'Deploy'.
// 5. Ensure your Google Sheet (Row 1) has columns for: Timestamp, Name, Phone, Tickets, Age, Drink Preference, Terms, ID.

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName("Sheet1");
    // Fallback to the first sheet if "Sheet1" is not found
    if (!sheet) {
      sheet = doc.getSheets()[0];
    }

    // Get all headers from the first row
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow() + 1;
    var newRow = [];

    // Map parameters to headers flexibly (Case insensitive & handles variations)
    for (var i = 0; i < headers.length; i++) {
      var headerOriginal = headers[i];
      // Normalize header: trim whitespace and convert to lowercase
      var header = headerOriginal.toString().trim().toLowerCase();
      var value = "";

      // Smart Matching Logic
      if (header === "timestamp" || header === "date" || header === "time") {
        value = e.parameter.timestamp;
      } 
      else if (header === "full name" || header === "name" || header === "fullname" || header === "attendee") {
        value = e.parameter.fullName;
      } 
      else if (header === "phone number" || header === "phone" || header === "mobile" || header === "contact") {
        value = e.parameter.phoneNumber;
      } 
      else if (header === "ticket count" || header === "tickets" || header === "seats" || header.indexOf("seat") !== -1) {
        value = e.parameter.ticketCount;
      } 
      else if (header === "age") {
        value = e.parameter.age;
      } 
      else if (header === "drink preference" || header === "drink" || header === "preference") {
        value = e.parameter.drinkPreference;
      } 
      else if (header === "agreed to terms" || header === "terms" || header === "agreement") {
        value = e.parameter.agreedToTerms;
      } 
      else if (header === "id" || header === "uuid" || header === "booking id") {
        value = e.parameter.id;
      }

      // Default to empty string if undefined
      if (value === undefined || value === null) {
        value = "";
      }

      // Add a single quote to force the cell to be treated as Text
      // This prevents Phone Numbers from losing leading zeros or being formatted as math.
      if (value !== "") {
        newRow.push("'" + value);
      } else {
        newRow.push("");
      }
    }

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "row": nextRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": e.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}