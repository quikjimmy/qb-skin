/* ============================================
   QBSkin Mobile Suite — Core JavaScript
   Part of: QuickBase Mobile Skin Build
   Version: 1.0
   Last Updated: 2026-03-10

   Shared foundation for all QBSkin pages.
   Contains: CONFIG, API helpers, date utilities,
   UI helpers, navigation, and field discovery.
   ============================================ */

// ─────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────
const QBSKIN = {
  version: '1.0',
  realm: 'kin.quickbase.com',
  appId: 'br9kwm8bk',
  tables: {
    projects:     'br9kwm8na',
    arrivyTasks:  'bvbqgs5yc',
    events:       'bsbguxz4i',
    intakeEvents: 'bt4a8ypkq'
  },
  // QuickBase code page URL builder
  pageUrl: function(pageName) {
    return 'https://' + this.realm + '/db/' + this.appId + '?a=dbpage&pagename=' + pageName;
  },
  // Navigation pages
  pages: [
    { id: 'dashboard', label: 'Dashboard', icon: '&#xe871;', page: 'cc-quick-glance.html' },
    { id: 'project',   label: 'Project',   icon: '&#xe85d;', page: 'qb-skin-project-detail.html' },
    { id: 'tasks',     label: 'Tasks',     icon: '&#xe876;', page: 'qb-skin-tasks.html' },
    { id: 'labor',     label: 'Labor',     icon: '&#xe7fb;', page: 'qb-skin-labor.html' },
    { id: 'trends',    label: 'Trends',    icon: '&#xe6df;', page: 'qb-skin-trends.html' }
  ]
};

// ─────────────────────────────────────────────
// AUTHENTICATION
// Embedded app token for mobile QB user access
// ─────────────────────────────────────────────
function qbGetToken() {
  return 'b6teb3_p3bs_0_bzh28isbyba5yh9ujb73hqthh5';
}

// ─────────────────────────────────────────────
// API HELPERS
// ─────────────────────────────────────────────
function qbApiHeaders() {
  return {
    'QB-Realm-Hostname': QBSKIN.realm,
    'Authorization': 'QB-USER-TOKEN ' + qbGetToken(),
    'Content-Type': 'application/json'
  };
}

/**
 * Fetch all fields for a table. Returns a map of label→id and id→label.
 */
async function qbGetFields(tableId) {
  const r = await fetch(
    'https://api.quickbase.com/v1/fields?tableId=' + tableId,
    { headers: qbApiHeaders() }
  );
  if (!r.ok) throw new Error('Fields fetch failed: ' + r.status);
  const fields = await r.json();
  const map = {};
  fields.forEach(function(f) {
    map[f.label] = f.id;
    map[f.id] = f.label;
  });
  return map;
}

/**
 * Query records from a QuickBase table.
 * @param {string} tableId - The table to query
 * @param {string} where - QB query string
 * @param {number[]} select - Array of field IDs to return
 * @param {object} opts - Optional: sortBy, top, skip
 */
async function qbQuery(tableId, where, select, opts) {
  opts = opts || {};
  const body = {
    from: tableId,
    select: select,
    where: where || '',
    sortBy: opts.sortBy || [],
    options: { top: opts.top || 500 }
  };
  if (opts.skip) body.options.skip = opts.skip;

  const r = await fetch('https://api.quickbase.com/v1/records/query', {
    method: 'POST',
    headers: qbApiHeaders(),
    body: JSON.stringify(body)
  });
  if (!r.ok) {
    const txt = await r.text();
    throw new Error('Query failed: ' + r.status + ' ' + txt);
  }
  return r.json();
}

/**
 * Create or update records in a QuickBase table.
 * @param {string} tableId - Target table
 * @param {object[]} records - Array of record objects [{field_id: {value: x}}]
 * @param {number[]} fieldsToReturn - Field IDs to return in response
 */
async function qbUpsert(tableId, records, fieldsToReturn) {
  const body = {
    to: tableId,
    data: records,
    fieldsToReturn: fieldsToReturn || [3]
  };
  const r = await fetch('https://api.quickbase.com/v1/records', {
    method: 'POST',
    headers: qbApiHeaders(),
    body: JSON.stringify(body)
  });
  if (!r.ok) {
    const txt = await r.text();
    throw new Error('Upsert failed: ' + r.status + ' ' + txt);
  }
  return r.json();
}

// ─────────────────────────────────────────────
// FIELD DISCOVERY & CACHING
// ─────────────────────────────────────────────
let qbFieldMaps = {};

/**
 * Discover fields for all configured tables.
 * Stores results in qbFieldMaps global.
 */
async function qbDiscoverFields() {
  const results = await Promise.all([
    qbGetFields(QBSKIN.tables.projects),
    qbGetFields(QBSKIN.tables.arrivyTasks),
    qbGetFields(QBSKIN.tables.events),
    qbGetFields(QBSKIN.tables.intakeEvents)
  ]);
  qbFieldMaps = {
    projects:     results[0],
    arrivyTasks:  results[1],
    events:       results[2],
    intakeEvents: results[3]
  };
  return qbFieldMaps;
}

/**
 * Look up a field ID by table name and label (fuzzy match).
 */
function qbFid(tableName, label) {
  var m = qbFieldMaps[tableName];
  if (!m) return null;
  if (m[label] !== undefined) return m[label];
  // Fuzzy: find first key containing the label (case-insensitive)
  var keys = Object.keys(m).filter(function(k) { return typeof k === 'string' && isNaN(k); });
  var match = keys.find(function(k) { return k.toLowerCase().includes(label.toLowerCase()); });
  return match ? m[match] : null;
}

/**
 * Extract a value from a QB record by field ID.
 */
function qbVal(rec, fid) {
  if (!fid || !rec[fid]) return '';
  var v = rec[fid];
  return (typeof v === 'object' && v !== null)
    ? (v.value !== undefined ? v.value : JSON.stringify(v))
    : v;
}

// ─────────────────────────────────────────────
// DATE HELPERS
// ─────────────────────────────────────────────
function qbTodayStr() {
  var d = new Date();
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

function qbDateOffset(days) {
  var d = new Date();
  d.setDate(d.getDate() + days);
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

function qbStartOfWeek() {
  var d = new Date();
  d.setDate(d.getDate() - d.getDay());
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

function qbStartOfMonth() {
  var d = new Date();
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-01';
}

/**
 * Build a QuickBase WHERE clause for a date range.
 */
function qbDateWhere(fieldId, from, to) {
  if (!from) from = qbTodayStr();
  if (!to) to = qbTodayStr();
  if (from === to) {
    return "{'" + fieldId + "'.IR.'" + from + "'}";
  }
  return "{'" + fieldId + "'.OAF.'" + from + "'}AND{'" + fieldId + "'.OBF.'" + to + "T23:59:59Z'}";
}

function qbFmtDate(d) {
  if (!d) return '-';
  var dt = new Date(d);
  return isNaN(dt) ? d : dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function qbFmtDateTime(d) {
  if (!d) return '-';
  var dt = new Date(d);
  if (isNaN(dt)) return d;
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' +
    dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function qbFmtDateFull(d) {
  if (!d) return '-';
  var dt = new Date(d);
  if (isNaN(dt)) return d;
  return dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function qbDaysSince(dateStr) {
  if (!dateStr) return '';
  var d = new Date(dateStr);
  if (isNaN(d)) return '';
  return Math.floor((new Date() - d) / (1000 * 60 * 60 * 24));
}

function qbDaysBetween(dateStr1, dateStr2) {
  if (!dateStr1 || !dateStr2) return null;
  var d1 = new Date(dateStr1), d2 = new Date(dateStr2);
  if (isNaN(d1) || isNaN(d2)) return null;
  return Math.floor(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24));
}

// ─────────────────────────────────────────────
// UI HELPERS
// ─────────────────────────────────────────────

/**
 * Generate a status pill HTML string.
 */
function qbStatusPill(status) {
  if (!status) return '';
  var low = status.toLowerCase().replace(/\s+/g, '');
  return '<span class="status-pill ' + low + '">' + status + '</span>';
}

/**
 * Show the loading overlay.
 */
function qbShowLoading(msg) {
  var overlay = document.getElementById('qbsLoadingOverlay');
  if (!overlay) return;
  var text = document.getElementById('qbsLoadingText');
  if (text) text.textContent = msg || 'Loading...';
  overlay.classList.remove('hidden');
}

/**
 * Hide the loading overlay.
 */
function qbHideLoading() {
  var overlay = document.getElementById('qbsLoadingOverlay');
  if (overlay) overlay.classList.add('hidden');
}

/**
 * Show an error banner.
 */
function qbShowError(msg) {
  var banner = document.getElementById('qbsErrorBanner');
  var text = document.getElementById('qbsErrorText');
  if (banner && text) {
    text.textContent = msg;
    banner.classList.add('show');
  }
}

/**
 * Dismiss the error banner.
 */
function qbDismissError() {
  var banner = document.getElementById('qbsErrorBanner');
  if (banner) banner.classList.remove('show');
}

/**
 * Show a success toast notification.
 */
function qbShowToast(msg, duration) {
  duration = duration || 3000;
  var existing = document.getElementById('qbsToast');
  if (existing) existing.remove();

  var toast = document.createElement('div');
  toast.id = 'qbsToast';
  toast.className = 'qbs-toast show';
  toast.textContent = msg;
  document.body.appendChild(toast);

  setTimeout(function() {
    toast.classList.remove('show');
    setTimeout(function() { toast.remove(); }, 300);
  }, duration);
}

// ─────────────────────────────────────────────
// NAVIGATION
// Renders a fixed bottom tab bar on all pages.
// ─────────────────────────────────────────────

/**
 * Render the bottom navigation bar.
 * @param {string} activePageId - The ID of the currently active page
 */
function qbRenderNav(activePageId) {
  var nav = document.createElement('nav');
  nav.className = 'qbs-bottom-nav';
  nav.id = 'qbsBottomNav';

  // Simple SVG icons instead of Material Icons (no external deps)
  var icons = {
    dashboard: '<svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>',
    project:   '<svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>',
    tasks:     '<svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M22 5.18L10.59 16.6l-4.24-4.24 1.41-1.41 2.83 2.83 10-10L22 5.18zM19.79 10.22C19.92 10.79 20 11.39 20 12c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8c1.58 0 3.04.46 4.28 1.25l1.44-1.44A9.9 9.9 0 0012 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10c0-1.19-.22-2.33-.6-3.39l-1.61 1.61z"/></svg>',
    labor:     '<svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>',
    trends:    '<svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/></svg>'
  };

  var html = '';
  QBSKIN.pages.forEach(function(p) {
    var isActive = (p.id === activePageId);
    var cls = 'qbs-nav-item' + (isActive ? ' active' : '');
    var url = QBSKIN.pageUrl(p.page);
    html += '<a href="' + url + '" class="' + cls + '">' +
      '<span class="qbs-nav-icon">' + icons[p.id] + '</span>' +
      '<span class="qbs-nav-label">' + p.label + '</span>' +
    '</a>';
  });

  nav.innerHTML = html;
  document.body.appendChild(nav);
}

// ─────────────────────────────────────────────
// SNAPSHOT MODE
// Hides nav/filters for clean screenshots.
// ─────────────────────────────────────────────
var qbSnapshotActive = false;

function qbToggleSnapshot() {
  qbSnapshotActive = !qbSnapshotActive;
  document.body.classList.toggle('qbs-snapshot-mode', qbSnapshotActive);

  // Show/hide watermark
  var wm = document.getElementById('qbsWatermark');
  if (qbSnapshotActive) {
    if (!wm) {
      wm = document.createElement('div');
      wm.id = 'qbsWatermark';
      wm.className = 'qbs-watermark';
      document.body.appendChild(wm);
    }
    var now = new Date();
    wm.textContent = 'Kin Home \u00B7 ' +
      now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
      ' ' + now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    wm.style.display = 'block';
  } else {
    if (wm) wm.style.display = 'none';
  }
}

// ─────────────────────────────────────────────
// COMMON HTML GENERATORS
// Returns HTML strings for reusable components.
// ─────────────────────────────────────────────

/**
 * Loading overlay HTML (insert in page body).
 */
function qbLoadingHTML() {
  return '<div class="qbs-loading-overlay hidden" id="qbsLoadingOverlay">' +
    '<div class="qbs-spinner"></div>' +
    '<div class="qbs-loading-text" id="qbsLoadingText">Loading...</div>' +
  '</div>';
}

/**
 * Error banner HTML (insert in page body).
 */
function qbErrorBannerHTML() {
  return '<div class="qbs-error-banner" id="qbsErrorBanner">' +
    '<span id="qbsErrorText"></span>' +
    '<span class="qbs-error-close" onclick="qbDismissError()">&times;</span>' +
  '</div>';
}

/**
 * Page header HTML with optional back button and snapshot toggle.
 * @param {string} title - Page title
 * @param {object} opts - { showBack, showSnapshot, showRefresh, onRefresh }
 */
function qbHeaderHTML(title, opts) {
  opts = opts || {};
  var leftHtml = '';
  if (opts.showBack) {
    leftHtml = '<button class="qbs-header-btn" onclick="history.back()" title="Back">' +
      '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>' +
    '</button>';
  }

  var rightHtml = '';
  if (opts.showSnapshot) {
    rightHtml += '<button class="qbs-header-btn" onclick="qbToggleSnapshot()" title="Snapshot Mode">' +
      '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>' +
    '</button>';
  }
  if (opts.showRefresh) {
    var refreshFn = opts.onRefresh || 'location.reload()';
    rightHtml += '<button class="qbs-header-btn" onclick="' + refreshFn + '" title="Refresh">' +
      '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>' +
    '</button>';
  }

  return '<header class="qbs-header">' +
    '<div class="qbs-header-top">' +
      '<div class="qbs-header-left">' + leftHtml +
        '<div><h1 class="qbs-header-title">' + title + '</h1>' +
        '<div class="qbs-header-sub" id="qbsDateDisplay"></div></div>' +
      '</div>' +
      '<div class="qbs-header-actions">' + rightHtml + '</div>' +
    '</div>' +
  '</header>';
}

// ─────────────────────────────────────────────
// URL PARAMETER HELPERS
// Used for passing record IDs between pages.
// ─────────────────────────────────────────────
function qbGetHashParam(key) {
  var hash = window.location.hash.substring(1);
  var params = new URLSearchParams(hash);
  return params.get(key);
}

function qbSetHashParam(key, value) {
  var hash = window.location.hash.substring(1);
  var params = new URLSearchParams(hash);
  params.set(key, value);
  window.location.hash = params.toString();
}

/**
 * Navigate to a QBSkin page with optional hash params.
 */
function qbNavigate(pageName, hashParams) {
  var url = QBSKIN.pageUrl(pageName);
  if (hashParams) {
    var params = new URLSearchParams(hashParams);
    url += '#' + params.toString();
  }
  window.location.href = url;
}

console.log('[QBSkin] Core v' + QBSKIN.version + ' loaded');
