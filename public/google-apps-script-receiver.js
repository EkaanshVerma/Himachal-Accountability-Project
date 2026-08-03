/**
 * Himachal Accountability Project — Report Receiver
 * 
 * HOW TO DEPLOY:
 * 1. Go to https://script.google.com
 * 2. Create a new project (name it "HAP Report Receiver")
 * 3. Paste this entire code into the editor (replace any existing code)
 * 4. Click "Deploy" → "Manage deployments"
 * 5. Click the Edit (pencil) icon
 * 6. Under Version, select "New version"
 * 7. Click "Deploy" and authorize if prompted
 *
 * The script will automatically create a "Reports" and "Detailed Reports" sheet 
 * and a "HAP_Photos" folder in your Google Drive.
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = getOrCreateSpreadsheet();

    if (data.formType === 'detailed') {
      var sheet = ss.getSheetByName('Detailed Reports') || createDetailedSheet(ss);

      var issuePhotoUrl = '';
      if (data.issuePhoto && data.issuePhoto.startsWith('data:image')) {
        issuePhotoUrl = savePhotoToDrive(data.issuePhoto, 'issue_' + Date.now());
      }

      var priorityPhotoUrl = '';
      if (data.priorityPhoto && data.priorityPhoto.startsWith('data:image')) {
        priorityPhotoUrl = savePhotoToDrive(data.priorityPhoto, 'priority_' + Date.now());
      }

      sheet.appendRow([
        data.timestamp || new Date().toISOString(),
        data.pincode || '',
        data.issue || '',
        issuePhotoUrl,
        data.priority || '',
        priorityPhotoUrl,
        data.mlaPerception || '',
        data.leadership || '',
        data.whatsapp || '',
        'New' // Status
      ]);

      sendDetailedNotification(data, issuePhotoUrl, priorityPhotoUrl);

    } else if (data.formType === 'join') {
      var sheet = ss.getSheetByName('Volunteers') || createJoinSheet(ss);

      sheet.appendRow([
        data.timestamp || new Date().toISOString(),
        data.name || '',
        data.email || '',
        data.tel || '',
        data.constituency || '',
        data.roles || '',
        data.statement || '',
        'New' // Status
      ]);

      sendJoinNotification(data);

    } else if (data.formType === 'contact') {
      var sheet = ss.getSheetByName('Contact Messages') || createContactSheet(ss);

      sheet.appendRow([
        data.timestamp || new Date().toISOString(),
        data.name || '',
        data.email || '',
        data.subject || '',
        data.message || '',
        'New' // Status
      ]);

      sendContactNotification(data);

    } else {
      // Default: Quick Report from Home Page
      var sheet = ss.getSheetByName('Reports') || createQuickSheet(ss);

      var photoUrl = '';
      if (data.photo && data.photo.startsWith('data:image')) {
        photoUrl = savePhotoToDrive(data.photo, data.ref || 'report');
      }

      sheet.appendRow([
        data.timestamp || new Date().toISOString(),
        data.ref || '',
        data.coordinates || '',
        data.location || '',
        data.category || '',
        data.description || '',
        data.mlaApprove || '',
        photoUrl,
        'New'  // Status
      ]);

      sendNotification(data, photoUrl);
    }

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

function getOrCreateSpreadsheet() {
  var props = PropertiesService.getScriptProperties();
  var ssId = props.getProperty('SPREADSHEET_ID');

  if (ssId) {
    try {
      return SpreadsheetApp.openById(ssId);
    } catch (e) {
      // Spreadsheet deleted, will create a new one
    }
  }

  var ss = SpreadsheetApp.create('HAP Field Reports');

  // Default first sheet is 'Sheet1', let's rename it
  var sheet = ss.getSheets()[0];
  sheet.setName('Reports');

  createQuickSheet(ss, sheet);
  createDetailedSheet(ss);
  createContactSheet(ss);
  createJoinSheet(ss);

  props.setProperty('SPREADSHEET_ID', ss.getId());
  Logger.log('Created spreadsheet: ' + ss.getUrl());
  return ss;
}

function createQuickSheet(ss, existingSheet) {
  var sheet = existingSheet || ss.insertSheet('Reports');

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp', 'Reference ID', 'Coordinates', 'Location',
      'Category', 'Description', 'MLA Approval', 'Photo Link', 'Status'
    ]);

    var headerRange = sheet.getRange(1, 1, 1, 9);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#2D3B2D');
    headerRange.setFontColor('#F3F1E6');

    sheet.setColumnWidth(1, 180);
    sheet.setColumnWidth(2, 130);
    sheet.setColumnWidth(3, 200);
    sheet.setColumnWidth(4, 250);
    sheet.setColumnWidth(5, 150);
    sheet.setColumnWidth(6, 350);
    sheet.setColumnWidth(7, 120);
    sheet.setColumnWidth(8, 300);
    sheet.setColumnWidth(9, 100);

    sheet.setFrozenRows(1);
  }
  return sheet;
}

function createDetailedSheet(ss) {
  var sheet = ss.insertSheet('Detailed Reports');

  sheet.appendRow([
    'Timestamp', 'Pincode', 'Biggest Issue', 'Issue Photo',
    '#1 Priority', 'Priority Photo', 'MLA Perception', 'Leadership Needed', 'WhatsApp', 'Status'
  ]);

  var headerRange = sheet.getRange(1, 1, 1, 10);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#2D3B2D');
  headerRange.setFontColor('#F3F1E6');

  sheet.setColumnWidth(1, 180); // Timestamp
  sheet.setColumnWidth(2, 100); // Pincode
  sheet.setColumnWidth(3, 300); // Issue
  sheet.setColumnWidth(4, 250); // Issue Photo
  sheet.setColumnWidth(5, 300); // Priority
  sheet.setColumnWidth(6, 250); // Priority Photo
  sheet.setColumnWidth(7, 300); // MLA
  sheet.setColumnWidth(8, 300); // Leadership
  sheet.setColumnWidth(9, 120); // WhatsApp
  sheet.setColumnWidth(10, 100); // Status

  sheet.setFrozenRows(1);
  return sheet;
}

function savePhotoToDrive(base64Data, refId) {
  var folders = DriveApp.getFoldersByName('HAP_Photos');
  var folder;
  if (folders.hasNext()) {
    folder = folders.next();
  } else {
    folder = DriveApp.createFolder('HAP_Photos');
    folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  }

  var parts = base64Data.split(',');
  var mimeType = parts[0].match(/:(.*?);/)[1];
  var bytes = Utilities.base64Decode(parts[1]);
  var blob = Utilities.newBlob(bytes, mimeType, refId + '.jpg');

  var file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  return file.getUrl();
}

function sendNotification(data, photoUrl) {
  var email = Session.getActiveUser().getEmail();
  if (!email) return;

  var subject = '🔔 Quick Report: ' + (data.ref || 'Unknown');
  var body = 'New quick field report submitted.\n\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'Reference: ' + (data.ref || '—') + '\n' +
    'Location: ' + (data.location || '—') + '\n' +
    'Category: ' + (data.category || '—') + '\n' +
    'Description: ' + (data.description || '(none)') + '\n' +
    'Approve MLA?: ' + (data.mlaApprove || '—') + '\n' +
    'Timestamp: ' + (data.timestamp || new Date().toISOString()) + '\n';
  if (photoUrl) body += 'Photo: ' + photoUrl + '\n';

  MailApp.sendEmail(email, subject, body);
}

function sendDetailedNotification(data, issuePhoto, priorityPhoto) {
  var email = Session.getActiveUser().getEmail();
  if (!email) return;

  var subject = '📝 Detailed Survey: Pin ' + (data.pincode || 'Unknown');
  var body = 'New detailed survey response submitted.\n\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'Pincode: ' + (data.pincode || '—') + '\n' +
    'Biggest Issue: ' + (data.issue || '—') + '\n' +
    '#1 Priority: ' + (data.priority || '—') + '\n' +
    'MLA Perception: ' + (data.mlaPerception || '—') + '\n' +
    'Leadership Needed: ' + (data.leadership || '—') + '\n' +
    'WhatsApp: ' + (data.whatsapp || '—') + '\n' +
    'Timestamp: ' + (data.timestamp || new Date().toISOString()) + '\n';

  if (issuePhoto) body += 'Issue Photo: ' + issuePhoto + '\n';
  if (priorityPhoto) body += 'Priority Photo: ' + priorityPhoto + '\n';

  MailApp.sendEmail(email, subject, body);
}

function createContactSheet(ss) {
  var sheet = ss.insertSheet('Contact Messages');

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp', 'Name', 'Email', 'Subject', 'Message', 'Status'
    ]);

    var headerRange = sheet.getRange(1, 1, 1, 6);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#2D3B2D');
    headerRange.setFontColor('#F3F1E6');

    sheet.setColumnWidth(1, 180);
    sheet.setColumnWidth(2, 150);
    sheet.setColumnWidth(3, 200);
    sheet.setColumnWidth(4, 200);
    sheet.setColumnWidth(5, 400);
    sheet.setColumnWidth(6, 100);

    sheet.setFrozenRows(1);
  }
  return sheet;
}

function sendContactNotification(data) {
  var email = Session.getActiveUser().getEmail();
  if (!email) return;

  var subject = '✉️ Contact Form: ' + (data.subject || 'New Message');
  var body = 'New contact message received via HAP website.\n\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'Name: ' + (data.name || '—') + '\n' +
    'Email: ' + (data.email || '—') + '\n' +
    'Subject: ' + (data.subject || '—') + '\n' +
    'Message:\n' + (data.message || '(no message)') + '\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'Timestamp: ' + (data.timestamp || new Date().toISOString()) + '\n';

  MailApp.sendEmail(email, subject, body);
}

function createJoinSheet(ss) {
  var sheet = ss.insertSheet('Volunteers');

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp', 'Name', 'Email', 'Phone', 'Constituency', 'Roles', 'Statement', 'Status'
    ]);

    var headerRange = sheet.getRange(1, 1, 1, 8);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#2D3B2D');
    headerRange.setFontColor('#F3F1E6');

    sheet.setColumnWidth(1, 180);
    sheet.setColumnWidth(2, 150);
    sheet.setColumnWidth(3, 200);
    sheet.setColumnWidth(4, 150);
    sheet.setColumnWidth(5, 200);
    sheet.setColumnWidth(6, 250);
    sheet.setColumnWidth(7, 400);
    sheet.setColumnWidth(8, 100);

    sheet.setFrozenRows(1);
  }
  return sheet;
}

function sendJoinNotification(data) {
  var email = Session.getActiveUser().getEmail();
  if (!email) return;

  var subject = '🙋 New Volunteer: ' + (data.name || 'Unknown');
  var body = 'New volunteer application received via HAP website.\n\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'Name: ' + (data.name || '—') + '\n' +
    'Email: ' + (data.email || '—') + '\n' +
    'Phone: ' + (data.tel || '—') + '\n' +
    'Constituency: ' + (data.constituency || '—') + '\n' +
    'Roles: ' + (data.roles || '—') + '\n' +
    'Statement:\n' + (data.statement || '(no statement)') + '\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'Timestamp: ' + (data.timestamp || new Date().toISOString()) + '\n';

  MailApp.sendEmail(email, subject, body);
}
