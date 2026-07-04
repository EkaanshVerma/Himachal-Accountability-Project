/**
 * Himachal Accountability Project — Report Receiver
 * 
 * HOW TO DEPLOY:
 * 1. Go to https://script.google.com
 * 2. Create a new project (name it "HAP Report Receiver")
 * 3. Paste this entire code into the editor (replace any existing code)
 * 4. Click "Deploy" → "New deployment"
 * 5. Select Type: "Web app"
 * 6. Set "Execute as": "Me"
 * 7. Set "Who has access": "Anyone"
 * 8. Click "Deploy" and authorize when prompted
 * 9. Copy the Web App URL
 * 10. Paste that URL into index.html where it says 'YOUR_GOOGLE_APPS_SCRIPT_URL'
 *
 * The script will automatically create a "Reports" sheet and a "HAP_Photos" 
 * folder in your Google Drive.
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    
    // Get or create the spreadsheet and sheet
    var ss = getOrCreateSpreadsheet();
    var sheet = ss.getSheetByName('Reports');
    
    // Save photo to Google Drive if present
    var photoUrl = '';
    if (data.photo && data.photo.startsWith('data:image')) {
      photoUrl = savePhotoToDrive(data.photo, data.ref || 'report');
    }
    
    // Append row to sheet
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.ref || '',
      data.coordinates || '',
      data.location || '',
      data.description || '',
      photoUrl,
      'New'  // Status column
    ]);
    
    // Send email notification
    sendNotification(data, photoUrl);
    
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'success' })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({ status: 'ok', message: 'HAP Report Receiver is running.' })
  ).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Get or create the spreadsheet for storing reports
 */
function getOrCreateSpreadsheet() {
  var props = PropertiesService.getScriptProperties();
  var ssId = props.getProperty('SPREADSHEET_ID');
  
  if (ssId) {
    try {
      return SpreadsheetApp.openById(ssId);
    } catch (e) {
      // Spreadsheet was deleted, create a new one
    }
  }
  
  // Create new spreadsheet
  var ss = SpreadsheetApp.create('HAP Field Reports');
  var sheet = ss.getActiveSheet();
  sheet.setName('Reports');
  
  // Set up headers
  sheet.appendRow([
    'Timestamp',
    'Reference ID', 
    'Coordinates',
    'Location',
    'Description',
    'Photo Link',
    'Status'
  ]);
  
  // Format headers
  var headerRange = sheet.getRange(1, 1, 1, 7);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#2D3B2D');
  headerRange.setFontColor('#F3F1E6');
  
  // Set column widths
  sheet.setColumnWidth(1, 180);  // Timestamp
  sheet.setColumnWidth(2, 130);  // Ref ID
  sheet.setColumnWidth(3, 200);  // Coordinates
  sheet.setColumnWidth(4, 250);  // Location
  sheet.setColumnWidth(5, 350);  // Description
  sheet.setColumnWidth(6, 300);  // Photo Link
  sheet.setColumnWidth(7, 100);  // Status
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  // Save spreadsheet ID
  props.setProperty('SPREADSHEET_ID', ss.getId());
  
  Logger.log('Created spreadsheet: ' + ss.getUrl());
  return ss;
}

/**
 * Save base64 photo to Google Drive and return the shareable link
 */
function savePhotoToDrive(base64Data, refId) {
  // Get or create folder
  var folders = DriveApp.getFoldersByName('HAP_Photos');
  var folder;
  if (folders.hasNext()) {
    folder = folders.next();
  } else {
    folder = DriveApp.createFolder('HAP_Photos');
    folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  }
  
  // Extract base64 content
  var parts = base64Data.split(',');
  var mimeType = parts[0].match(/:(.*?);/)[1];
  var bytes = Utilities.base64Decode(parts[1]);
  var blob = Utilities.newBlob(bytes, mimeType, refId + '.jpg');
  
  // Save to Drive
  var file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  
  return file.getUrl();
}

/**
 * Send email notification for new report
 */
function sendNotification(data, photoUrl) {
  var email = Session.getActiveUser().getEmail();
  if (!email) return;
  
  var subject = '🔔 New Field Report: ' + (data.ref || 'Unknown');
  var body = 'New field report submitted via the HAP website.\n\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'Reference: ' + (data.ref || '—') + '\n' +
    'Location: ' + (data.location || '—') + '\n' +
    'Coordinates: ' + (data.coordinates || '—') + '\n' +
    'Description: ' + (data.description || '(none)') + '\n' +
    'Timestamp: ' + (data.timestamp || new Date().toISOString()) + '\n';
  
  if (photoUrl) {
    body += 'Photo: ' + photoUrl + '\n';
  }
  
  body += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
    'View all reports: Open the "HAP Field Reports" spreadsheet in Google Drive.';
  
  MailApp.sendEmail(email, subject, body);
}
