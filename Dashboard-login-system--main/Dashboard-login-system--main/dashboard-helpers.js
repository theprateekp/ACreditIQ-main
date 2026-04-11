'use strict';
/* ─── UI helpers ─────────────────────────────────────────── */
const bClr=(p,s)=>s==='Submitted'?'#2563EB':p<30?'#EF4444':p<70?'#F59E0B':'#16A34A';
const pCS={'Complete':'pill-complete','In Progress':'pill-progress','Not Started':'pill-notstarted',
  'Submitted':'pill-submitted','Approved':'pill-approved','Rejected':'pill-rejected','Pending Review':'pill-pending'};
const pill=s=>`<span class="pill ${pCS[s]||'pill-notstarted'}">${s}</span>`;
const ficn=e=>({pdf:'pdf',xlsx:'xlsx',docx:'docx',xls:'xlsx',doc:'docx'})[e]||'pdf';
const ficnL=e=>({pdf:'PDF',xlsx:'XLS',docx:'DOC',xls:'XLS',doc:'DOC'})[e]||'FILE';
const gF=id=>D.faculty.find(f=>f.id===id);
const gC=code=>D.criteria.find(c=>c.code===code);
const gSkel=code=>NBA_SKELETONS[code];
const tbar=(p,c)=>`<div style="display:flex;align-items:center;gap:8px;"><div class="table-bar-wrap"><div class="table-bar" style="background:${c};" data-target="${p}"></div></div><span class="mono" style="font-size:11px;color:${c};">${p}%</span></div>`;
const anim=()=>setTimeout(()=>document.querySelectorAll('[data-target]').forEach(b=>b.style.width=b.dataset.target+'%'),80);
const esc=s=>String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const uid=()=>'id_'+Math.random().toString(36).slice(2,9)+Date.now().toString(36);

/* ─── Icons ─────────────────────────────────────────────── */
const I={
grid:`<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`,
chart:`<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>`,
clip:`<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>`,
folder:`<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>`,
users:`<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
tbl:`<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/></svg>`,
ai:`<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>`,
rep:`<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`,
cog:`<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>`,
up:`<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>`,
plus:`<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>`,
edit:`<svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>`,
trash:`<svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>`,
srch:`<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>`,
dl:`<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>`,
send:`<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z"/></svg>`,
check:`<svg width="14" height="14" fill="none" stroke="#166534" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>`,
x:`<svg width="14" height="14" fill="none" stroke="#991B1B" stroke-width="2.5" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>`,
search:`<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>`,
book:`<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>`,
};

/* ─── Auth ───────────────────────────────────────────────── */
const Auth = {
  login(email, pw) {
    const f = D.faculty.find(f => f.email.toLowerCase() === email.toLowerCase() && f.pwd === pw);
    if (!f) return false;
    D.session = {
      role: f.role === 'Super Admin' ? 'Super Admin' : 'Faculty Member',
      user: f,
      initials: f.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
    };
    saveD();
    return true;
  },
  logout() { D.session = null; saveD(); showLogin(); },
  isAdmin() { return D.session?.role === 'Super Admin'; }
};

/* ─── Modal ──────────────────────────────────────────────── */
const Mdl = {
  show(t, h) {
    document.getElementById('modal-title').textContent = t;
    document.getElementById('modal-body').innerHTML = h;
    document.getElementById('modal-overlay').style.display = 'flex';
  },
  hide() { document.getElementById('modal-overlay').style.display = 'none'; }
};

/* ─── Routes ─────────────────────────────────────────────── */
const aR = [
  {id:'dashboard', l:'Dashboard',        ic:'grid',   h:'Dashboard'},
  {id:'sar',       l:'SAR Progress',     ic:'chart',  h:'SAR Progress'},
  {id:'criteria',  l:'Criteria',         ic:'clip',   h:'Criteria Management'},
  {id:'vault',     l:'Document Vault',   ic:'folder', h:'Document Vault'},
  {id:'docsearch', l:'Document Search',  ic:'search', h:'Document Search'},
  {id:'faculty',   l:'Faculty & Roles',  ic:'users',  h:'Faculty & Roles'},
  {id:'copo',      l:'CO-PO Mapping',    ic:'tbl',    h:'CO-PO Mapping'},
  {id:'reports',   l:'Reports & Export', ic:'rep',    h:'Reports & Export'},
  {id:'settings',  l:'Settings',         ic:'cog',    h:'Settings'},
];
const fR = [
  {id:'fdash',     l:'Dashboard',        ic:'grid',   h:'My Dashboard'},
  {id:'mycrits',   l:'My Criteria',      ic:'clip',   h:'My Criteria'},
  {id:'upload',    l:'Upload Documents', ic:'up',     h:'Upload Documents'},
  {id:'docsearch', l:'Document Search',  ic:'search', h:'Document Search'},
  {id:'copo',      l:'CO-PO Mapping',    ic:'tbl',    h:'CO-PO Mapping'},
  {id:'aiasst',    l:'AI Assistant',     ic:'ai',     h:'AI Assistant'},
];

let cR = '';
let cSubView = null; // e.g. {type:'skeleton', code:'C1'}

function nav(id, sub) {
  cR = id;
  cSubView = sub || null;
  const routes = Auth.isAdmin() ? aR : fR;
  const r = routes.find(x => x.id === id);
  if (r) document.getElementById('header-title').textContent = sub ? `${r.h} — ${sub.code||''}` : r.h;
  document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.r === id));
  document.getElementById('page-content').innerHTML = rPage(id, sub);
  bindEvents(id, sub);
  anim();
}

function buildSidebar() {
  const routes = Auth.isAdmin() ? aR : fR;
  const s = D.session;
  document.getElementById('dyn-nav').innerHTML = routes.map((r,i) =>
    `<div class="nav-item${i===0?' active':''}" data-r="${r.id}">${I[r.ic]||''} ${r.l}</div>`
  ).join('');
  document.getElementById('sidebar-initials').textContent = s.initials;
  document.getElementById('sidebar-name').textContent = s.user?.name || s.role;
  document.getElementById('sidebar-badge').textContent = s.role;
  document.getElementById('header-avatar').textContent = s.initials;
  // Header: show current year only
  const yrEl = document.getElementById('hdr-year');
  if (yrEl) yrEl.textContent = getCurrentAcademicYear();
  document.getElementById('dyn-nav').querySelectorAll('.nav-item').forEach(n =>
    n.addEventListener('click', () => nav(n.dataset.r))
  );
}

function showLogin() {
  document.getElementById('login-page').style.display = 'flex';
  document.getElementById('app').style.display = 'none';
}
function showApp() {
  document.getElementById('login-page').style.display = 'none';
  document.getElementById('app').style.display = 'flex';
  buildSidebar();
  nav(Auth.isAdmin() ? 'dashboard' : 'fdash');
  setTimeout(() => {
    const b = document.getElementById('bell-btn');
    b.classList.add('wobble');
    b.addEventListener('animationend', () => b.classList.remove('wobble'), {once:true});
  }, 1200);
}

/* ─── Document Text Extraction ──────────────────────────── */
async function extractText(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  try {
    if (ext === 'pdf')                return await extractPDF(file);
    if (ext === 'xlsx' || ext === 'xls') return await extractXLSX(file);
    if (ext === 'docx' || ext === 'doc') return await extractDOCX(file);
    if (ext === 'txt')                return await file.text();
    return '';
  } catch(e) { console.warn('Extraction failed:', e); return ''; }
}

async function extractPDF(file) {
  if (!window.pdfjsLib) return '';
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  const ab = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({data: ab}).promise;
  let text = '';
  const maxP = Math.min(pdf.numPages, 50); // cap at 50 pages
  for (let i = 1; i <= maxP; i++) {
    const page = await pdf.getPage(i);
    const tc = await page.getTextContent();
    text += `[Page: ${i}]\n` + tc.items.map(it => it.str).join(' ') + '\n';
  }
  return text.slice(0, 80000); // cap 80KB
}

async function extractXLSX(file) {
  if (!window.XLSX) return '';
  const ab = await file.arrayBuffer();
  const wb = XLSX.read(ab, {type:'array'});
  let text = '';
  wb.SheetNames.forEach(name => {
    const ws = wb.Sheets[name];
    text += `[Sheet: ${name}]\n` + XLSX.utils.sheet_to_csv(ws) + '\n';
  });
  return text.slice(0, 80000);
}

async function extractDOCX(file) {
  if (!window.mammoth) return '';
  const ab = await file.arrayBuffer();
  const result = await mammoth.extractRawText({arrayBuffer: ab});
  return (result.value || '').slice(0, 80000);
}

/* ─── Init ───────────────────────────────────────────────── */
function init() {
  // Login
  document.getElementById('login-btn').addEventListener('click', () => {
    const email = document.getElementById('login-email').value.trim();
    const pw    = document.getElementById('login-password').value;
    const err   = document.getElementById('login-error');
    if (Auth.login(email, pw)) { err.style.display='none'; showApp(); }
    else { err.textContent='Invalid email or password.'; err.style.display='block'; }
  });
  document.getElementById('login-password').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('login-btn').click();
  });
  // Logout
  document.getElementById('logout-btn').addEventListener('click', () => Auth.logout());
  // Bell
  const bell = document.getElementById('bell-btn');
  const np   = document.getElementById('notif-panel');
  bell.addEventListener('click', e => { e.stopPropagation(); np.classList.toggle('open'); });
  document.addEventListener('click', e => {
    if (!np.contains(e.target) && e.target !== bell) np.classList.remove('open');
  });
  document.getElementById('mark-all-btn').addEventListener('click', () => {
    document.querySelectorAll('.notif-item.unread').forEach(i => {
      i.classList.remove('unread'); i.classList.add('read');
    });
    document.getElementById('bell-badge').style.display = 'none';
  });
  // Modal close
  document.getElementById('modal-close').addEventListener('click', () => Mdl.hide());
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modal-overlay')) Mdl.hide();
  });
}

document.addEventListener('DOMContentLoaded', init);
