'use strict';

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const CRITERIA = [
  { code:'C1', name:'Outcome-Based Curriculum',  marks:120, pct:78, status:'Complete',    incharge:'Dr. Sharma',    docs:'10/12', desig:'Assoc. Professor' },
  { code:'C2', name:'Teaching Learning',          marks:120, pct:45, status:'In Progress', incharge:'Prof. Kulkarni',docs:'5/8',   desig:'Asst. Professor'  },
  { code:'C3', name:'Outcome-Based Assessment',   marks:120, pct:62, status:'In Progress', incharge:'Dr. Patil',    docs:'7/10',  desig:'Professor'        },
  { code:'C4', name:'Students Performance',       marks:120, pct:91, status:'Complete',    incharge:'Prof. Mehta',  docs:'15/15', desig:'Assoc. Professor' },
  { code:'C5', name:'Faculty Information',        marks:100, pct:38, status:'In Progress', incharge:'Dr. Joshi',    docs:'8/20',  desig:'Professor'        },
  { code:'C6', name:'Faculty Contributions',      marks:120, pct:22, status:'Not Started', incharge:'Prof. Desai',  docs:'1/25',  desig:'Asst. Professor'  },
  { code:'C7', name:'Facilities & Tech Support',  marks:100, pct:55, status:'In Progress', incharge:'Dr. Nair',     docs:'5/8',   desig:'Assoc. Professor' },
  { code:'C8', name:'Continuous Improvement',     marks:80,  pct:18, status:'Not Started', incharge:'Prof. Singh',  docs:'2/6',   desig:'Asst. Professor'  },
  { code:'C9', name:'Student Support',            marks:120, pct:71, status:'In Progress', incharge:'Dr. Rao',      docs:'13/18', desig:'Professor'        },
];

const DOCUMENTS = [
  { name:'CO_Attainment_Report_C3.xlsx',      ext:'xlsx', crit:'C3', faculty:'Dr. Patil',    date:'Today',      size:'1.2 MB' },
  { name:'Course_Files_Semester6_C2.pdf',     ext:'pdf',  crit:'C2', faculty:'Prof. Kulkarni',date:'Yesterday',  size:'4.8 MB' },
  { name:'Faculty_Resume_Dr_Joshi_C5.pdf',    ext:'pdf',  crit:'C5', faculty:'Dr. Joshi',    date:'2 days ago', size:'820 KB' },
  { name:'Lab_Invoices_FY2024_C7.pdf',        ext:'pdf',  crit:'C7', faculty:'Dr. Nair',     date:'3 days ago', size:'2.1 MB' },
  { name:'PO_Mapping_Matrix_C1.xlsx',         ext:'xlsx', crit:'C1', faculty:'Dr. Sharma',   date:'4 days ago', size:'650 KB' },
  { name:'Student_Feedback_C9.docx',          ext:'docx', crit:'C9', faculty:'Dr. Rao',      date:'4 days ago', size:'340 KB' },
  { name:'Assessment_Rubrics_C2.docx',        ext:'docx', crit:'C2', faculty:'Prof. Kulkarni',date:'5 days ago', size:'210 KB' },
  { name:'NBA_Self_Assessment_C4.pdf',        ext:'pdf',  crit:'C4', faculty:'Prof. Mehta',  date:'5 days ago', size:'3.3 MB' },
  { name:'Research_Publications_C5.docx',     ext:'docx', crit:'C5', faculty:'Dr. Joshi',    date:'6 days ago', size:'480 KB' },
  { name:'Continuous_Improv_Plan_C8.pdf',     ext:'pdf',  crit:'C8', faculty:'Prof. Singh',  date:'7 days ago', size:'1.1 MB' },
  { name:'Faculty_Contributions_List_C6.xlsx',ext:'xlsx', crit:'C6', faculty:'Prof. Desai',  date:'8 days ago', size:'740 KB' },
  { name:'Infrastructure_Report_C7.pdf',      ext:'pdf',  crit:'C7', faculty:'Dr. Nair',     date:'9 days ago', size:'5.2 MB' },
];

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function getBarColor(pct, status) {
  if (status === 'Submitted') return { cls:'#2563EB', name:'blue' };
  if (pct < 30)  return { cls:'#EF4444', name:'red' };
  if (pct < 70)  return { cls:'#F59E0B', name:'amber' };
  return { cls:'#16A34A', name:'green' };
}

function getStatusPill(status) {
  const map = {
    'Complete':    'pill pill-complete',
    'In Progress': 'pill pill-progress',
    'Not Started': 'pill pill-notstarted',
    'Submitted':   'pill pill-submitted',
  };
  return `<span class="${map[status] || 'pill'}">${status}</span>`;
}

function getFileIconHTML(ext) {
  const map = { pdf:'PDF', xlsx:'XLS', docx:'DOC' };
  const cls  = { pdf:'pdf', xlsx:'xlsx', docx:'docx' };
  return `<div class="file-icon ${cls[ext] || 'pdf'}">${map[ext] || 'FILE'}</div>`;
}

/* ─────────────────────────────────────────────
   BUILD: CRITERIA GRID (Admin)
───────────────────────────────────────────── */
function buildCriteriaGrid() {
  const grid = document.getElementById('criteria-grid');
  if (!grid) return;
  grid.innerHTML = CRITERIA.map(c => {
    const color = getBarColor(c.pct, c.status);
    return `
    <div class="crit-card">
      <div class="crit-card-top">
        <div style="display:flex;align-items:baseline;gap:6px;flex:1;min-width:0;">
          <span class="crit-code">${c.code}</span>
          <span class="crit-name">${c.name}</span>
        </div>
        <span class="crit-marks">${c.marks} marks</span>
      </div>
      <div class="crit-bar-wrap">
        <div class="crit-pct-row">
          <span class="crit-pct" style="color:${color.cls};">${c.pct}%</span>
        </div>
        <div class="progress-bar-wrap">
          <div class="progress-bar" style="background:${color.cls};" data-target="${c.pct}"></div>
        </div>
      </div>
      <div class="crit-bottom">
        <span class="crit-incharge">${c.incharge}</span>
        ${getStatusPill(c.status)}
      </div>
    </div>`;
  }).join('');
}

/* ─────────────────────────────────────────────
   BUILD: INCHARGE TABLE
───────────────────────────────────────────── */
function buildInchargeTable() {
  const tbody = document.getElementById('incharge-tbody');
  if (!tbody) return;
  tbody.innerHTML = CRITERIA.map(c => {
    const color = getBarColor(c.pct, c.status);
    return `<tr>
      <td><span class="crit-code-td">${c.code}</span></td>
      <td>${c.incharge}</td>
      <td style="color:var(--muted);font-size:12px;">${c.desig}</td>
      <td style="font-family:'Courier New',monospace;font-size:12px;">${c.docs}</td>
      <td>
        <div style="display:flex;align-items:center;gap:8px;">
          <div class="table-bar-wrap">
            <div class="table-bar" style="background:${color.cls};" data-target="${c.pct}"></div>
          </div>
          <span style="font-family:'Courier New',monospace;font-size:11px;color:${color.cls};">${c.pct}%</span>
        </div>
      </td>
      <td>${getStatusPill(c.status)}</td>
      <td><span class="view-link">View</span></td>
    </tr>`;
  }).join('');
}

/* ─────────────────────────────────────────────
   BUILD: FACULTY CRITERIA (2 cards)
───────────────────────────────────────────── */
function buildFacultyCriteria() {
  const grid = document.getElementById('faculty-crit-grid');
  if (!grid) return;
  const fac = [CRITERIA[1], CRITERIA[4]]; // C2, C5
  grid.innerHTML = fac.map(c => {
    const color = getBarColor(c.pct, c.status);
    return `
    <div class="crit-card">
      <div class="crit-card-top">
        <div style="display:flex;align-items:baseline;gap:6px;flex:1;min-width:0;">
          <span class="crit-code">${c.code}</span>
          <span class="crit-name">${c.name}</span>
        </div>
        <span class="crit-marks">${c.marks} marks</span>
      </div>
      <div class="crit-bar-wrap">
        <div class="crit-pct-row">
          <span class="crit-pct" style="color:${color.cls};">${c.pct}%</span>
        </div>
        <div class="progress-bar-wrap">
          <div class="progress-bar" style="background:${color.cls};" data-target="${c.pct}"></div>
        </div>
      </div>
      <div class="crit-bottom">
        <span class="crit-incharge">${c.incharge}</span>
        ${getStatusPill(c.status)}
      </div>
    </div>`;
  }).join('');
}

/* ─────────────────────────────────────────────
   BUILD: DOCUMENT VAULT GRID
───────────────────────────────────────────── */
function buildDocGrid(docs) {
  const grid = document.getElementById('doc-grid');
  if (!grid) return;
  if (docs.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;" class="empty-state">
      <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>
      <p>No documents found.</p>
      <span>Try adjusting your search or filters.</span>
    </div>`;
    return;
  }
  grid.innerHTML = docs.map(d => `
    <div class="doc-card">
      <div class="doc-card-top">
        ${getFileIconHTML(d.ext)}
        <div class="three-dot">⋯</div>
      </div>
      <div class="doc-name">${d.name}</div>
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
        <span class="crit-pill-sm">${d.crit}</span>
        <span class="doc-faculty">${d.faculty}</span>
      </div>
      <div class="doc-date">${d.date}</div>
      <div class="doc-bottom">
        <span class="doc-size">${d.size}</span>
        <button class="btn-preview">Preview</button>
      </div>
    </div>
  `).join('');
}

/* ─────────────────────────────────────────────
   ANIMATE PROGRESS BARS
───────────────────────────────────────────── */
function animateBars() {
  requestAnimationFrame(() => {
    document.querySelectorAll('[data-target]').forEach(bar => {
      const target = parseFloat(bar.dataset.target);
      bar.style.width = target + '%';
    });
  });
}

/* ─────────────────────────────────────────────
   SCREEN NAVIGATION
───────────────────────────────────────────── */
const SCREENS = {
  dashboard: 'screen-dashboard',
  faculty:   'screen-faculty',
  vault:     'screen-vault',
};

let currentScreen = 'dashboard';
const headerTitle = document.getElementById('header-title');

function switchScreen(screenKey, title) {
  if (!SCREENS[screenKey]) return;
  currentScreen = screenKey;

  // Hide all screens
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  // Show target
  const target = document.getElementById(SCREENS[screenKey]);
  if (target) {
    target.classList.add('active');
  }

  // Update header title
  if (title) headerTitle.textContent = title;

  // Re-animate bars
  setTimeout(animateBars, 50);

  // Close notifications panel
  document.getElementById('notif-panel').classList.remove('open');
}

/* ─────────────────────────────────────────────
   ROLE SWITCHER
───────────────────────────────────────────── */
const roleSwitcher = document.getElementById('role-switcher');
const navAdmin     = document.getElementById('nav-admin');
const navFaculty   = document.getElementById('nav-faculty');
const roleBadge    = document.getElementById('role-badge');

function setRole(role) {
  if (role === 'faculty') {
    navAdmin.style.display   = 'none';
    navFaculty.style.display = 'block';
    roleBadge.textContent    = 'Faculty Member';
    switchScreen('faculty', 'My Dashboard');
    // Reset faculty nav active state
    navFaculty.querySelectorAll('.nav-item').forEach((item, i) => {
      item.classList.toggle('active', i === 0);
    });
  } else {
    navAdmin.style.display   = 'block';
    navFaculty.style.display = 'none';
    roleBadge.textContent    = 'Super Admin';
    switchScreen('dashboard', 'Dashboard');
    // Reset admin nav active state
    navAdmin.querySelectorAll('.nav-item').forEach((item, i) => {
      item.classList.toggle('active', i === 0);
    });
  }
}

roleSwitcher.addEventListener('change', e => setRole(e.target.value));

/* ─────────────────────────────────────────────
   NAV CLICK HANDLERS
───────────────────────────────────────────── */
function bindNavClicks(nav) {
  nav.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      nav.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      const screen = item.dataset.screen;
      const header = item.dataset.header;
      switchScreen(screen, header);
    });
  });
}
bindNavClicks(navAdmin);
bindNavClicks(navFaculty);

/* ─────────────────────────────────────────────
   NOTIFICATION PANEL
───────────────────────────────────────────── */
const bellBtn    = document.getElementById('bell-btn');
const notifPanel = document.getElementById('notif-panel');
const bellBadge  = document.getElementById('bell-badge');
const markAllBtn = document.getElementById('mark-all-btn');

bellBtn.addEventListener('click', e => {
  e.stopPropagation();
  notifPanel.classList.toggle('open');
});

document.addEventListener('click', e => {
  if (!notifPanel.contains(e.target) && e.target !== bellBtn) {
    notifPanel.classList.remove('open');
  }
});

markAllBtn.addEventListener('click', () => {
  document.querySelectorAll('.notif-item.unread').forEach(item => {
    item.classList.remove('unread');
    item.classList.add('read');
  });
  bellBadge.style.display = 'none';
  markAllBtn.textContent = 'All read';
});

/* Bell wobble on load */
setTimeout(() => {
  bellBtn.classList.add('wobble');
  bellBtn.addEventListener('animationend', () => bellBtn.classList.remove('wobble'), { once: true });
}, 1200);

/* ─────────────────────────────────────────────
   DOCUMENT VAULT SEARCH
───────────────────────────────────────────── */
const docSearch = document.getElementById('doc-search');
if (docSearch) {
  docSearch.addEventListener('input', () => {
    const q = docSearch.value.toLowerCase();
    const filtered = DOCUMENTS.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.crit.toLowerCase().includes(q) ||
      d.faculty.toLowerCase().includes(q)
    );
    buildDocGrid(filtered);
  });
}

/* ─────────────────────────────────────────────
   UPLOAD ZONE DRAG FEEDBACK
───────────────────────────────────────────── */
const uploadZone = document.getElementById('upload-zone');
if (uploadZone) {
  ['dragover', 'dragenter'].forEach(evt => {
    uploadZone.addEventListener(evt, e => {
      e.preventDefault();
      uploadZone.style.borderColor = 'var(--accent)';
      uploadZone.style.background  = '#F8FAFF';
    });
  });
  ['dragleave', 'drop'].forEach(evt => {
    uploadZone.addEventListener(evt, e => {
      e.preventDefault();
      uploadZone.style.borderColor = '';
      uploadZone.style.background  = '';
    });
  });
}

/* ─────────────────────────────────────────────
   INIT
───────────────────────────────────────────── */
function init() {
  buildCriteriaGrid();
  buildInchargeTable();
  buildFacultyCriteria();
  buildDocGrid(DOCUMENTS);
  // Animate bars after a short delay for visual effect
  setTimeout(animateBars, 150);
}

document.addEventListener('DOMContentLoaded', init);
