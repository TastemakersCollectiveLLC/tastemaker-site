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

   To rebuild the spreadsheet layout (labeled columns on every tab, the
   Status dropdown, colors, filters and the Summary tab with its
   formulas): pick fixSheet in the editor's function menu and press Run.
   It is safe to run again at any time and never deletes a submission.
   ============================================ */

/* Where notifications go. Overridable without editing code: Project
   Settings > Script properties > NOTIFY_EMAIL. */
var DEFAULT_NOTIFY_EMAIL = 'hello@tastemakerscollective.us';

/* The fixed leading columns on every tab, in this order. Received is the
   Pacific timestamp, Status is left blank for Danny to work the row, and
   Flag is set by this script. Submitted fields follow, in the order of
   FIELDS below. Existing columns are never reordered or renamed by a
   submission. */
var FIXED_COLUMNS = ['Received', 'Status', 'Flag'];

/* Every field each website form sends, in column order, with the label
   the sheet and the email use. The key is the field's name in the site's
   HTML. A field that is not listed here still gets a column, labeled from
   its name, so a new form field never loses data. */
var FIELDS = {
  contact: [
    ['name', 'Name'],
    ['email', 'Email'],
    ['phone', 'Phone'],
    ['event_type', 'Event type'],
    ['service_style', 'Service style'],
    ['date', 'Date'],
    ['location', 'Location'],
    ['guests', 'Guest count'],
    ['dietary', 'Dietary needs and allergies'],
    ['budget', 'Budget'],
    ['attendance', 'Expected attendance'],
    ['service_hours', 'Load-in and service hours'],
    ['power_water', 'Power and water on site'],
    ['notes', 'Additional notes'],
    ['form_source', 'Form'],
    ['_gotcha', 'Spam trap']
  ],
  order: [
    ['name', 'Name'],
    ['email', 'Email'],
    ['phone', 'Phone'],
    ['date', 'Delivery date'],
    ['delivery_window', 'Delivery window'],
    ['address', 'Delivery address or area'],
    ['guests', 'Guest count'],
    ['dietary', 'Dietary needs and allergies'],
    ['notes', 'Notes'],
    ['form_source', 'Form'],
    ['_gotcha', 'Spam trap']
  ],
  onset: [
    ['production_company', 'Production company'],
    ['name', 'Contact name'],
    ['role', 'Role'],
    ['email', 'Email'],
    ['phone', 'Phone'],
    ['project_type', 'Project type'],
    ['union', 'Union or non-union'],
    ['shoot_dates', 'Shoot dates'],
    ['call_time', 'Call time'],
    ['meal_times', 'Meal times'],
    ['crew_headcount', 'Crew headcount'],
    ['talent_headcount', 'Talent or client headcount'],
    ['location', 'Location'],
    ['parking_access', 'Parking and access notes'],
    ['power_water', 'Power and water on site'],
    ['service_style', 'Service style'],
    ['dietary_counts', 'Dietary counts'],
    ['budget_per_head', 'Budget per head'],
    ['billing_contact', 'Billing contact or PO'],
    ['coi_holder', 'COI holder name'],
    ['form_source', 'Form'],
    ['_gotcha', 'Spam trap']
  ],
  review: [
    ['name', 'Name'],
    ['email', 'Email'],
    ['event', 'Event'],
    ['rating', 'Rating'],
    ['review', 'Review'],
    ['consent', 'OK to publish'],
    ['form_source', 'Form'],
    ['_gotcha', 'Spam trap']
  ]
};

/* The Status dropdown. Blank means new and not yet handled. The dropdown
   suggests these but accepts anything typed. */
var LEAD_STATUSES = ['Replied', 'Quoted', 'Booked', 'Lost', 'Spam'];
var REVIEW_STATUSES = ['Approved', 'Published', 'Declined'];

/* Fields with long free text: wider columns, wrapped. */
var LONG_FIELDS = ['notes', 'dietary', 'dietary_counts', 'parking_access', 'review', 'address', 'location'];

/* The tabs setup() creates. A form_source value with no tab gets one on
   first use, so a new form needs no change here.

   onset: a production catering quote request from the website's /on-set
   form.

   review: a customer review from the website's /reviews form. It is
   written and emailed like everything else and is NEVER published by
   this script or by anything automatic. Danny reads the row, marks
   Status, and only then does a review go on the site, by hand. */
var KNOWN_FORMS = ['contact', 'order', 'onset', 'review'];

/* A form_source whose tab is named differently. Every other form_source
   is its own tab name. */
var TAB_NAMES = {
  onset: 'onset',
  review: 'reviews'
};

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
      rowNumber = appendSubmission(sheet, data, flag, formSource);
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

/* The tab for a form_source: its TAB_NAMES entry if it has one, otherwise
   the form_source itself. A sheet tab name may not contain : \ / ? * [ ]
   and is capped at 100 characters. Anything else is kept as sent. */
function tabNameFor(formSource) {
  var source = String(formSource);
  if (Object.prototype.hasOwnProperty.call(TAB_NAMES, source)) source = TAB_NAMES[source];
  var name = source.replace(/[:\\\/\?\*\[\]]/g, ' ').trim();
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

/* The sheet and email label for one field of one form. */
function fieldLabel(formSource, key) {
  var list = FIELDS[String(formSource)] || [];
  for (var i = 0; i < list.length; i++) {
    if (list[i][0] === key) return list[i][1];
  }
  var label = labelFor(key);
  /* An unknown field may never land in Received, Status or Flag. */
  return FIXED_COLUMNS.indexOf(label) === -1 ? label : 'Field ' + label;
}

/* The full header a form's tab should carry, in order. */
function headerFor(formSource) {
  return FIXED_COLUMNS.concat((FIELDS[String(formSource)] || []).map(function (f) { return f[1]; }));
}

/* Grows the grid when a write would land past its edge. */
function ensureSize(sheet, rows, cols) {
  if (rows > sheet.getMaxRows()) sheet.insertRowsAfter(sheet.getMaxRows(), rows - sheet.getMaxRows() + 100);
  if (cols > sheet.getMaxColumns()) sheet.insertColumnsAfter(sheet.getMaxColumns(), cols - sheet.getMaxColumns());
}

/* Reads the header, adds a labeled column for any field not seen before,
   then writes the row aligned to the header. Returns the row number. */
function appendSubmission(sheet, data, flag, formSource) {
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

  /* Each field goes in the column carrying its label (or, on a tab built
     before labels, its raw name). A field with no column gets one after
     everything that exists. Never inserted, never reordered. */
  var fields = Object.keys(data);
  var columnOf = {};
  fields.forEach(function (key) {
    var label = fieldLabel(formSource, key);
    var at = header.indexOf(label);
    if (at === -1) at = header.indexOf(key);
    if (at === -1) {
      header.push(label);
      at = header.length - 1;
      ensureSize(sheet, 1, header.length);
      sheet.getRange(1, header.length).setValue(label).setFontWeight('bold');
    }
    columnOf[key] = at;
  });

  var row = header.map(function () { return ''; });
  row[header.indexOf('Received')] = Utilities.formatDate(new Date(), TIME_ZONE, 'yyyy-MM-dd HH:mm:ss');
  row[header.indexOf('Status')] = '';
  row[header.indexOf('Flag')] = flag;
  fields.forEach(function (key) {
    row[columnOf[key]] = asLiteral(data[key]);
  });

  var rowNumber = sheet.getLastRow() + 1;
  ensureSize(sheet, rowNumber, row.length);
  var target = sheet.getRange(rowNumber, 1, 1, row.length);
  /* Plain text first, then the values. The text format stops Sheets from
     turning a phone number or a zip code into a number, which would drop
     the + and any leading zero. It does NOT stop setValues from evaluating
     a string that begins with = as a formula (confirmed on the real sheet:
     "=1+1" landed as 2), so asLiteral above adds the apostrophe prefix as
     well. Received is a formatted string and stays one. */
  target.setNumberFormat('@');
  target.setValues([row]);
  return rowNumber;
}

/* A submitted value, made safe for a cell. Anything beginning with = + -
   or @ gets a single leading apostrophe, which Sheets reads as "this is
   text" and does not display. Only the cell gets this; the email carries
   the value exactly as submitted. */
function asLiteral(value) {
  var v = String(value);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
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
  } else if (formSource === 'onset') {
    var company = (data.production_company || '').trim();
    subject = 'New production catering quote request from ' + name + (company ? ', ' + company : '');
  } else if (formSource === 'review') {
    subject = 'New review from ' + name;
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
  /* Fields in the same order as the sheet's columns, then anything else.
     The form name is already in the subject, and the spam trap only
     matters when it was filled in. */
  var known = (FIELDS[String(formSource)] || []).map(function (f) { return f[0]; });
  var keys = known.filter(function (k) { return Object.prototype.hasOwnProperty.call(data, k); })
    .concat(Object.keys(data).filter(function (k) { return known.indexOf(k) === -1; }));
  keys.forEach(function (key) {
    if (key === 'form_source') return;
    if (key === '_gotcha' && !String(data[key]).trim()) return;
    lines.push(fieldLabel(formSource, key) + ': ' + data[key]);
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
   prompt for the two scopes in the manifest. It creates the contact,
   order, onset and reviews tabs with the fixed columns, leaves any
   existing tab alone, and
   sends one test email so the mail path is proven before the site is
   pointed here.
   ============================================ */
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var made = [];
  KNOWN_FORMS.forEach(function (form) {
    if (!ss.getSheetByName(tabNameFor(form))) {
      getOrCreateTab(form);
      made.push(tabNameFor(form));
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
      'Tabs created: ' + (made.length ? made.join(', ') : 'none, all existed already'),
      'Notifications go to: ' + to,
      '',
      'If this is a re-run after an update, the existing deployment stays as it is; publish the new code with Deploy > Manage deployments > edit > New version.',
      'First time: Deploy > New deployment > Web app, execute as Me, access Anyone, then send the /exec URL back.'
    ].join('\n'),
    { name: 'Tastemakers Collective website' }
  );
  Logger.log('Setup complete. Tabs created: %s. Test email sent to %s.', made.join(', ') || 'none', to);
}


/* ============================================
   SPREADSHEET LAYOUT
   Run from the editor: pick fixSheet in the function menu, press Run.
   Safe to run again at any time. It never deletes or moves a submission.

   On each form tab: the labeled header in order, bold and frozen; the
   Status dropdown; open rows (received, no Status yet) highlighted
   yellow, Booked and Published rows green, spam, Lost and Declined rows
   greyed out; a filter on the header; long text wrapped; the Form and
   Spam trap columns hidden. Then the Summary tab with live counts, and
   the empty default Sheet1 removed.
   ============================================ */
function fixSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  KNOWN_FORMS.forEach(function (form, i) {
    var name = tabNameFor(form);
    var sheet = ss.getSheetByName(name) || ss.insertSheet(name);
    layoutTab(sheet, form);
  });
  buildSummary(ss);

  /* Tab order: Summary, then the forms in KNOWN_FORMS order. */
  KNOWN_FORMS.forEach(function (form, i) {
    ss.setActiveSheet(ss.getSheetByName(tabNameFor(form)));
    ss.moveActiveSheet(i + 2);
  });

  /* The empty default tab a new spreadsheet starts with. Only removed
     when nothing at all is in it. */
  var blank = ss.getSheetByName('Sheet1');
  if (blank && blank.getLastRow() === 0 && blank.getLastColumn() === 0) ss.deleteSheet(blank);

  ss.setActiveSheet(ss.getSheetByName('Summary'));
  Logger.log('Layout fixed on %s, plus Summary.', KNOWN_FORMS.map(tabNameFor).join(', '));
}

function keyForLabel(form, label) {
  var list = FIELDS[form] || [];
  for (var i = 0; i < list.length; i++) {
    if (list[i][1] === label) return list[i][0];
  }
  return '';
}

function layoutTab(sheet, form) {
  var want = headerFor(form);
  var list = FIELDS[form] || [];
  var lastCol = sheet.getLastColumn();
  var header = lastCol
    ? sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function (h) { return String(h); })
    : [];

  if (sheet.getLastRow() <= 1) {
    /* Nothing submitted yet: the whole header, fresh and in order. */
    ensureSize(sheet, 2, want.length);
    sheet.getRange(1, 1, 1, sheet.getMaxColumns()).clearContent();
    header = want.slice();
  } else {
    /* Rows exist: raw field names become their labels in place, and any
       missing column is added at the end. Nothing moves. */
    header = header.map(function (h) {
      for (var i = 0; i < list.length; i++) {
        if (list[i][0] === h) return list[i][1];
      }
      return h;
    });
    want.forEach(function (label) {
      if (header.indexOf(label) === -1) header.push(label);
    });
    ensureSize(sheet, 2, header.length);
  }
  sheet.getRange(1, 1, 1, header.length).setValues([header]);

  var cols = header.length;
  var rows = sheet.getMaxRows();
  var width = sheet.getMaxColumns();

  sheet.getRange(1, 1, 1, cols)
    .setFontWeight('bold')
    .setBackground('#f1f3f4')
    .setWrap(true)
    .setVerticalAlignment('middle');
  sheet.setFrozenRows(1);
  sheet.getRange(2, 1, rows - 1, width).setVerticalAlignment('top');

  header.forEach(function (label, i) {
    var key = keyForLabel(form, label);
    var long = LONG_FIELDS.indexOf(key) !== -1;
    var px = label === 'Received' ? 150 : label === 'Status' ? 110 : label === 'Flag' ? 90 : long ? 280 : 160;
    sheet.setColumnWidth(i + 1, px);
    if (long) sheet.getRange(2, i + 1, rows - 1, 1).setWrap(true);
    if (key === 'form_source' || key === '_gotcha') sheet.hideColumns(i + 1);
  });

  /* Status: a dropdown that suggests, never rejects. */
  var statuses = form === 'review' ? REVIEW_STATUSES : LEAD_STATUSES;
  sheet.getRange(2, 2, rows - 1, 1).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(statuses, true)
      .setAllowInvalid(true)
      .setHelpText('Blank means new and not handled yet. Pick one or type your own.')
      .build()
  );

  /* Row colors, driven by Received, Status and Flag. */
  var body = sheet.getRange(2, 1, rows - 1, width);
  sheet.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=OR(LEFT($C2,8)="honeypot",$B2="Spam",$B2="Lost",$B2="Declined")')
      .setFontColor('#9aa0a6')
      .setRanges([body]).build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=OR($B2="Booked",$B2="Published")')
      .setBackground('#e6f4ea')
      .setRanges([body]).build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=AND($A2<>"",$B2="",LEFT($C2,8)<>"honeypot")')
      .setBackground('#fef7e0')
      .setRanges([body]).build()
  ]);

  /* A filter on the header row, covering every row. */
  var existing = sheet.getFilter();
  if (existing) existing.remove();
  sheet.getRange(1, 1, rows, cols).createFilter();
}

/* The Summary tab: live counts per form, all by formula, nothing typed. */
function buildSummary(ss) {
  var sheet = ss.getSheetByName('Summary') || ss.insertSheet('Summary', 0);
  sheet.clear();
  sheet.setConditionalFormatRules([]);
  sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns()).clearDataValidations();

  function ref(form) {
    return "'" + tabNameFor(form).replace(/'/g, "''") + "'!";
  }
  function link(form, text) {
    return '=HYPERLINK("#gid=' + ss.getSheetByName(tabNameFor(form)).getSheetId() + '","' + text + '")';
  }
  function countsRow(form, text, statuses, slots) {
    var t = ref(form);
    var real = '(' + t + '$A$2:$A<>"")*(LEFT(' + t + '$C$2:$C,8)<>"honeypot")';
    var row = [
      link(form, text),
      '=SUMPRODUCT(' + real + ')',
      '=SUMPRODUCT(' + real + '*(' + t + '$B$2:$B=""))'
    ];
    for (var i = 0; i < slots; i++) {
      row.push(statuses[i] ? '=COUNTIF(' + t + '$B$2:$B,"' + statuses[i] + '")' : '');
    }
    row.push('=SUMPRODUCT((' + t + '$A$2:$A<>"")*(LEFT(' + t + '$C$2:$C,8)="honeypot"))');
    row.push('=IFERROR(INDEX(SORT(FILTER(' + t + '$A$2:$A,' + t + '$A$2:$A<>""),1,FALSE),1),"")');
    return row;
  }

  var slots = LEAD_STATUSES.length;
  var cols = 3 + slots + 2;
  function pad(arr) {
    while (arr.length < cols) arr.push('');
    return arr;
  }

  sheet.getRange(1, 1).setValue('Website inquiries').setFontWeight('bold').setFontSize(14);
  sheet.getRange(2, 1).setValue('Everything here is counted by formula from the form tabs. Open means received with no Status yet. Spam trap hits count only under Flagged. Click a form name to jump to its tab.')
    .setFontColor('#5f6368');

  /* Leads */
  var leadHead = ['Leads', 'Total', 'Open'].concat(LEAD_STATUSES, ['Flagged', 'Last received']);
  var leadRows = [
    countsRow('contact', 'Contact inquiries', LEAD_STATUSES, slots),
    countsRow('order', 'Drop-off orders', LEAD_STATUSES, slots),
    countsRow('onset', 'On set quotes', LEAD_STATUSES, slots)
  ];
  var first = 5, last = first + leadRows.length - 1;
  var totals = [''];
  for (var c = 2; c <= cols - 1; c++) {
    var col = String.fromCharCode(64 + c);
    totals.push('=SUM(' + col + first + ':' + col + last + ')');
  }
  var lastCol = String.fromCharCode(64 + cols);
  totals.push('=IFERROR(INDEX(SORT(FILTER(' + lastCol + first + ':' + lastCol + last + ',' + lastCol + first + ':' + lastCol + last + '<>""),1,FALSE),1),"")');

  sheet.getRange(4, 1, 1, cols).setValues([leadHead]);
  sheet.getRange(first, 1, leadRows.length, cols).setFormulas(leadRows);
  sheet.getRange(last + 1, 1, 1, cols).setFormulas([totals]);
  /* Plain text goes in with setValue: setFormulas turns it into a broken formula. */
  sheet.getRange(last + 1, 1).setValue('All leads');
  sheet.getRange(last + 1, 1, 1, cols).setFontWeight('bold').setBorder(true, null, null, null, null, null);

  /* Reviews */
  var revTop = last + 3;
  var revHead = pad(['Reviews', 'Total', 'Open'].concat(REVIEW_STATUSES));
  revHead[cols - 2] = 'Flagged';
  revHead[cols - 1] = 'Last received';
  sheet.getRange(revTop, 1, 1, cols).setValues([revHead]);
  sheet.getRange(revTop + 1, 1, 1, cols).setFormulas([countsRow('review', 'Website reviews', REVIEW_STATUSES, slots)]);

  [4, revTop].forEach(function (r) {
    sheet.getRange(r, 1, 1, cols).setFontWeight('bold').setBackground('#f1f3f4');
  });
  sheet.getRange(4, 2, revTop - 2, cols - 2).setHorizontalAlignment('center');
  sheet.setColumnWidth(1, 170);
  for (var w = 2; w < cols; w++) sheet.setColumnWidth(w, 80);
  sheet.setColumnWidth(cols, 160);
  sheet.setFrozenRows(0);
}
