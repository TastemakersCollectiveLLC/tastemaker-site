/* ============================================
   TASTEMAKERS COLLECTIVE
   Form backend: Google Apps Script, bound to a spreadsheet

   The website posts each form as JSON to this script's /exec URL. Every
   submission is written to the bound spreadsheet, one tab per form, and
   emailed to the business inbox. Nothing is ever dropped: a honeypot hit
   is written and sent with a flag, and the sheet write and the email are
   independent, so one failing never loses the other.

   Deployed as a web app, executing as the deploying user, open to anyone
   anonymous. One file, no libraries.

   Danny's one-time setup: open this project from the spreadsheet
   (Extensions > Apps Script), paste this file over Code.gs and the
   manifest over appsscript.json, run setup() once from the editor and
   accept the authorization prompt, then Deploy > New deployment > Web
   app, execute as Me, access Anyone, and send the /exec URL back.
   ============================================ */

/* Where notifications go. Overridable without editing code: Project
   Settings > Script properties > NOTIFY_EMAIL. */
var DEFAULT_NOTIFY_EMAIL = 'hello@tastemakerscollective.us';

/* The fixed leading columns on every tab, in this order. Received is the
   Pacific timestamp, Status is left blank for Danny to work the row, and
   Flag is set by this script. Submitted fields follow, in the order they
   first appeared. Existing columns are never reordered or renamed. */
var FIXED_COLUMNS = ['Received', 'Status', 'Flag'];

/* The tabs setup() creates. A form_source value with no tab gets one on
   first use, so a new form needs no change here. */
var KNOWN_FORMS = ['contact', 'order'];

var TIME_ZONE = 'America/Los_Angeles';


/* ============================================
   WEB APP ENTRY POINTS
   ============================================ */

/* A browser check. Open the /exec URL and this is what you see. */
function doGet() {
  return ContentService.createTextOutput('ok').setMimeType(ContentService.MimeType.TEXT);
}

/* One submission in, one JSON reply out. */
function doPost(e) {
  var result = { ok: false };
  try {
    var data = parseSubmission(e);
    result = handleSubmission(data);
  } catch (err) {
    result = { ok: false, error: String(err && err.message ? err.message : err) };
  }
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}


/* ============================================
   PARSING
   ============================================ */

/* The site sends JSON as text/plain, which keeps the browser from making
   a CORS preflight request that a web app cannot answer. A plain form
   post (application/x-www-form-urlencoded) lands in e.parameter instead,
   so that is the fallback. Every value is coerced to a string. */
function parseSubmission(e) {
  var raw = {};
  var body = e && e.postData && e.postData.contents ? e.postData.contents : '';
  var parsed = null;
  if (body) {
    try { parsed = JSON.parse(body); } catch (ignore) { parsed = null; }
  }
  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
    raw = parsed;
  } else if (e && e.parameter) {
    raw = e.parameter;
  }
  var data = {};
  Object.keys(raw).forEach(function (key) {
    var k = String(key).trim();
    if (!k) return;
    var v = raw[key];
    if (v === null || v === undefined) v = '';
    if (Array.isArray(v)) v = v.join(', ');
    else if (typeof v === 'object') v = JSON.stringify(v);
    data[k] = String(v);
  });
  return data;
}


/* ============================================
   THE SUBMISSION
   ============================================ */

function handleSubmission(data) {
  var formSource = (data.form_source || '').trim() || 'unknown';
  var flagged = !!(data._gotcha && String(data._gotcha).trim());
  var flag = flagged ? 'honeypot' : '';

  /* 1. The sheet. Locked so two submissions arriving together cannot
        both read the header, both append a column and write into each
        other's cells. */
  var sheetError = '';
  var rowNumber = 0;
  var sheet = null;
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
    try {
      sheet = getOrCreateTab(formSource);
      rowNumber = appendSubmission(sheet, data, flag);
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    sheetError = String(err && err.message ? err.message : err);
  }

  /* 2. The email. Sent whether or not the sheet write worked; if it did
        not, the email says so, so the submission is still in the inbox. */
  var mailError = '';
  try {
    sendNotification(formSource, data, flagged, sheetError);
  } catch (err) {
    mailError = String(err && err.message ? err.message : err);
  }

  /* 3. If the email failed but the row exists, the row carries the error
        in Flag so Danny can see it in the sheet. */
  if (mailError && sheet && rowNumber) {
    try {
      var current = flag ? flag + '; ' : '';
      sheet.getRange(rowNumber, FIXED_COLUMNS.indexOf('Flag') + 1)
        .setValue(current + 'email failed: ' + mailError);
    } catch (ignore) {}
  }

  /* The submission reached Danny if either the row or the email made it,
     so that is a success for the visitor: telling them it failed would
     only make them send it twice. Both failing is the only failure. */
  if (sheetError && mailError) {
    return { ok: false, error: 'sheet: ' + sheetError + '; email: ' + mailError };
  }
  var result = { ok: true };
  if (sheetError) result.warning = 'sheet: ' + sheetError;
  if (mailError) result.warning = 'email: ' + mailError;
  return result;
}


/* ============================================
   THE SPREADSHEET
   ============================================ */

/* A sheet tab name may not contain : \ / ? * [ ] and is capped at 100
   characters. Anything else in form_source is kept as sent. */
function tabNameFor(formSource) {
  var name = String(formSource).replace(/[:\\\/\?\*\[\]]/g, ' ').trim();
  if (!name) name = 'unknown';
  return name.slice(0, 100);
}

function getOrCreateTab(formSource) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var name = tabNameFor(formSource);
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    writeHeader(sheet, FIXED_COLUMNS);
  } else if (sheet.getLastRow() === 0) {
    writeHeader(sheet, FIXED_COLUMNS);
  }
  return sheet;
}

function writeHeader(sheet, columns) {
  sheet.getRange(1, 1, 1, columns.length).setValues([columns]);
  sheet.getRange(1, 1, 1, columns.length).setFontWeight('bold');
  sheet.setFrozenRows(1);
}

/* Reads the header, adds a column for any field not seen before, then
   writes the row aligned to the header. Returns the row number. */
function appendSubmission(sheet, data, flag) {
  var lastCol = Math.max(sheet.getLastColumn(), FIXED_COLUMNS.length);
  var header = sheet.getRange(1, 1, 1, lastCol).getValues()[0]
    .map(function (h) { return String(h); });

  /* The fixed columns are guaranteed to lead, whatever state the tab is in. */
  FIXED_COLUMNS.forEach(function (name, i) {
    if (header[i] !== name) {
      header[i] = name;
      sheet.getRange(1, i + 1).setValue(name).setFontWeight('bold');
    }
  });

  /* New fields are appended after everything that exists. Never inserted,
     never reordered. */
  var fields = Object.keys(data);
  fields.forEach(function (key) {
    if (header.indexOf(key) === -1) {
      header.push(key);
      sheet.getRange(1, header.length).setValue(key).setFontWeight('bold');
    }
  });

  var row = header.map(function () { return ''; });
  row[header.indexOf('Received')] = Utilities.formatDate(new Date(), TIME_ZONE, 'yyyy-MM-dd HH:mm:ss');
  row[header.indexOf('Status')] = '';
  row[header.indexOf('Flag')] = flag;
  fields.forEach(function (key) {
    row[header.indexOf(key)] = data[key];
  });

  var rowNumber = sheet.getLastRow() + 1;
  var target = sheet.getRange(rowNumber, 1, 1, row.length);
  /* Plain text first, then the values. Without this, Sheets reads a value
     that starts with = + - or @ as a formula and turns a phone number or
     a zip code into a number, dropping the + and any leading zero. The
     timestamp in Received is already a formatted string and stays one. */
  target.setNumberFormat('@');
  target.setValues([row]);
  return rowNumber;
}


/* ============================================
   THE EMAIL
   ============================================ */

function notifyEmail() {
  var stored = PropertiesService.getScriptProperties().getProperty('NOTIFY_EMAIL');
  return (stored && stored.trim()) || DEFAULT_NOTIFY_EMAIL;
}

function isEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || '').trim());
}

/* "event_type" reads as "Event type" in the email. */
function labelFor(key) {
  var s = String(key).replace(/^_+/, '').replace(/[_\-]+/g, ' ').trim();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : String(key);
}

function subjectFor(formSource, data, flagged) {
  var name = (data.name || '').trim() || 'unknown';
  var subject;
  if (formSource === 'contact') {
    var type = (data.event_type || '').trim() || 'event';
    subject = 'New inquiry: ' + type + ' from ' + name;
  } else if (formSource === 'order') {
    subject = 'New drop-off order request from ' + name;
  } else {
    subject = 'New website submission (' + formSource + ') from ' + name;
  }
  return (flagged ? '[Flagged] ' : '') + subject;
}

function sendNotification(formSource, data, flagged, sheetError) {
  var lines = [];
  if (flagged) {
    lines.push('FLAGGED: the hidden honeypot field was filled in, which a person cannot do.');
    lines.push('Written and sent anyway so nothing is lost.');
    lines.push('');
  }
  if (sheetError) {
    lines.push('WARNING: this submission could not be written to the spreadsheet.');
    lines.push('Error: ' + sheetError);
    lines.push('This email is the only copy.');
    lines.push('');
  }
  Object.keys(data).forEach(function (key) {
    lines.push(labelFor(key) + ': ' + data[key]);
  });
  lines.push('');
  lines.push('Received: ' + Utilities.formatDate(new Date(), TIME_ZONE, 'EEEE, MMMM d, yyyy h:mm a') + ' Pacific');
  try {
    lines.push('Spreadsheet: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl());
  } catch (ignore) {}

  var options = { name: 'Tastemakers Collective website' };
  if (isEmail(data.email)) options.replyTo = String(data.email).trim();

  MailApp.sendEmail(notifyEmail(), subjectFor(formSource, data, flagged), lines.join('\n'), options);
}


/* ============================================
   ONE-TIME SETUP
   Run from the editor: Run > setup. The first run opens the authorization
   prompt for the two scopes in the manifest. It creates the contact and
   order tabs with the fixed columns, leaves any existing tab alone, and
   sends one test email so the mail path is proven before the site is
   pointed here.
   ============================================ */
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var made = [];
  KNOWN_FORMS.forEach(function (form) {
    if (!ss.getSheetByName(tabNameFor(form))) {
      getOrCreateTab(form);
      made.push(form);
    }
  });
  var to = notifyEmail();
  MailApp.sendEmail(
    to,
    'Tastemakers Collective form backend: setup complete',
    [
      'The form backend is authorized and ready.',
      '',
      'Spreadsheet: ' + ss.getUrl(),
      'Tabs created: ' + (made.length ? made.join(', ') : 'none, both existed already'),
      'Notifications go to: ' + to,
      '',
      'Next: Deploy > New deployment > Web app, execute as Me, access Anyone, then send the /exec URL back.'
    ].join('\n'),
    { name: 'Tastemakers Collective website' }
  );
  Logger.log('Setup complete. Tabs created: %s. Test email sent to %s.', made.join(', ') || 'none', to);
}
