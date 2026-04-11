'use strict';
function rPage(id,sub){
  const m={dashboard:pgDash,sar:pgSAR,criteria:()=>pgCriteria(sub),vault:pgVault,docsearch:pgDocSearch,faculty:pgFaculty,copo:pgCOPO,ai:pgAI,reports:pgReports,settings:pgSettings,fdash:pgFacDash,mycrits:()=>pgMyCrits(sub),upload:pgUpload,aiasst:pgAIAsst};
  return (m[id]||pgDash)();
}

/* ── DASHBOARD ─────────────────────────────────────────── */
function pgDash(){
  const active=D.criteria, tot=active.reduce((s,c)=>s+c.marks,0)||0;
  const ach=active.reduce((s,c)=>s+Math.round((c.marks||0)*(c.pct||0)/100),0);
  const sp=tot?Math.round(ach/tot*100):0;
  const comp=active.filter(c=>c.status==='Complete').length;
  const docs=D.documents.length;
  const colName=D.college.name||'Your Institution';
  if(!active.length) return `<div class="page-section"><div class="empty-hero"><div class="empty-hero-icon">${I.grid}</div><h2>Welcome to AccreditIQ</h2><p>No criteria activated yet. Go to <b>Settings</b> to configure your institution, then <b>Criteria</b> to activate criteria and assign faculty.</p><button class="btn-primary" onclick="nav('settings')">⚙ Open Settings</button></div></div>`;
  return`<div class="page-section">
<div class="row-4">
<div class="card"><div class="stat-label">Overall SAR Readiness</div><div class="stat-number">${sp}%</div><div class="progress-bar-wrap"><div class="progress-bar blue" data-target="${sp}"></div></div><div class="stat-sub" style="margin-top:8px;">${active.length} criteria active · ${comp} complete</div></div>
<div class="card"><div class="stat-label">Documents Uploaded</div><div class="stat-number">${docs}</div><div class="stat-sub">Across all criteria</div></div>
<div class="card"><div class="stat-label">Criteria Complete</div><div class="stat-number">${comp}</div><div class="stat-sub">of ${active.length} active</div><div class="criteria-circles">${active.map(c=>`<div class="crit-dot" title="${c.code}: ${c.status}" style="background:${bClr(c.pct||0,c.status)};"></div>`).join('')}</div></div>
<div class="card"><div class="stat-label">Academic Year</div><div class="stat-number" style="font-size:22px;">${getCurrentAcademicYear()}</div><div class="stat-sub">${colName}</div></div>
</div>
<div><div class="section-label" style="margin-bottom:12px;">Active Criteria Progress</div>
<div class="criteria-grid">${active.map(c=>{const cl=bClr(c.pct||0,c.status),f=gF(c.fid);return`<div class="crit-card" style="cursor:pointer;" onclick="nav('criteria',{type:'skeleton',code:'${c.code}'})">
<div class="crit-card-top"><div style="display:flex;align-items:baseline;gap:6px;flex:1;min-width:0;"><span class="crit-code">${c.code}</span><span class="crit-name">${c.name||NBA_CRITERIA_LIST.find(x=>x.code===c.code)?.name||''}</span></div><span class="crit-marks">${c.marks} marks</span></div>
<div class="crit-bar-wrap"><div class="crit-pct-row"><span class="crit-pct" style="color:${cl};">${c.pct||0}%</span></div><div class="progress-bar-wrap"><div class="progress-bar" style="background:${cl};" data-target="${c.pct||0}"></div></div></div>
<div class="crit-bottom"><span class="crit-incharge">${f?.name||'—'}</span>${pill(c.status)}</div></div>`;}).join('')}</div></div>
<div class="row-60-40">
<div class="card"><div class="activity-header"><span class="section-label">Recent Documents</span><span class="view-all" onclick="nav('vault')">View All</span></div>
${D.documents.length?D.documents.slice(0,5).map(d=>`<div class="activity-item"><div class="file-icon ${ficn(d.ext)}" style="width:28px;height:28px;font-size:9px;flex-shrink:0;">${ficnL(d.ext)}</div><div class="activity-body"><div class="activity-text">${esc(d.name)}</div><div class="activity-sub"><span class="crit-pill-sm">${d.crit}</span> · ${d.date}</div></div>${pill(d.status)}</div>`).join(''):`<div class="empty-state" style="padding:30px;"><p>No documents uploaded yet.</p></div>`}
</div>
<div class="col-right-stack">
<div class="card"><div class="section-label" style="margin-bottom:12px;">Upcoming Deadlines</div>
${active.filter(c=>c.deadline&&c.status!=='Complete').sort((a,b)=>a.deadline>b.deadline?1:-1).slice(0,4).map(c=>{const days=Math.ceil((new Date(c.deadline)-new Date())/(864e5));const col=days<=3?'#EF4444':days<=7?'#F59E0B':'#16A34A';return`<div class="deadline-item"><span class="deadline-code">${c.code}</span><span class="deadline-name">${NBA_CRITERIA_LIST.find(x=>x.code===c.code)?.name?.split(' ').slice(0,2).join(' ')||c.code}</span><span class="deadline-days" style="color:${col};">${days<0?'Overdue':days+' days'}</span></div>`;}).join('')||'<div class="text-muted" style="font-size:13px;">No deadlines set.</div>'}
</div>
</div></div></div>`;
}

/* ── SAR ───────────────────────────────────────────────── */
function pgSAR(){
  if(!D.criteria.length) return `<div class="page-section"><div class="empty-hero"><div class="empty-hero-icon">${I.chart}</div><h2>No Criteria Activated</h2><p>Activate criteria first from the Criteria page.</p><button class="btn-primary" onclick="nav('criteria')">Go to Criteria</button></div></div>`;
  const tot=D.criteria.reduce((s,c)=>s+c.marks,0),ach=D.criteria.reduce((s,c)=>s+Math.round(c.marks*(c.pct||0)/100),0),sp=tot?Math.round(ach/tot*100):0;
  return`<div class="page-section">
<div class="row-4">
<div class="card"><div class="stat-label">Overall SAR Score</div><div class="stat-number">${sp}%</div><div class="stat-sub">Weighted across ${D.criteria.length} active criteria</div></div>
<div class="card"><div class="stat-label">Points Achieved</div><div class="stat-number">${ach}</div><div class="stat-sub">of ${tot} total marks</div></div>
<div class="card"><div class="stat-label">Criteria Complete</div><div class="stat-number">${D.criteria.filter(c=>c.status==='Complete').length}</div><div class="stat-sub">of ${D.criteria.length} active</div></div>
<div class="card"><div class="stat-label">Academic Year</div><div class="stat-number" style="font-size:22px;">${getCurrentAcademicYear()}</div><div class="stat-sub">${D.college.name||'—'}</div></div>
</div>
<div class="card"><div class="table-header-row"><span class="section-label">Criteria Score Summary</span><button class="btn-outline-blue" onclick="alert('Export feature coming soon.')">${I.dl} Export SAR</button></div>
<div style="overflow-x:auto;"><table class="data-table"><thead><tr><th>Code</th><th>Criterion</th><th>Max</th><th>Completion</th><th>Achieved</th><th>Deadline</th><th>Incharge</th><th>Status</th></tr></thead><tbody>
${D.criteria.map(c=>{const cl=bClr(c.pct||0,c.status),f=gF(c.fid),ach=Math.round(c.marks*(c.pct||0)/100);return`<tr><td class="crit-code-td">${c.code}</td><td style="font-weight:500;">${c.name||NBA_CRITERIA_LIST.find(x=>x.code===c.code)?.name||''}</td><td class="mono">${c.marks}</td><td>${tbar(c.pct||0,cl)}</td><td class="mono">${ach}/${c.marks}</td><td style="font-size:12px;">${c.deadline||'—'}</td><td style="font-size:12px;">${f?.name||'—'}</td><td>${pill(c.status)}</td></tr>`;}).join('')}
</tbody></table></div></div></div>`;
}

/* ── CRITERIA LIST + SKELETON ──────────────────────────── */
function pgCriteria(sub){
  if(sub&&sub.type==='skeleton') return pgCritSkeleton(sub.code);
  const isA=Auth.isAdmin();
  const activeCodes=D.criteria.map(c=>c.code);
  return`<div class="page-section">
<div class="card">
<div class="table-header-row"><div class="filters-bar"><span class="section-label">NBA Criteria <span class="badge-count">${NBA_CRITERIA_LIST.length}</span></span></div>${isA?`<button class="btn-primary" id="activate-crit-btn">${I.plus} Activate Criterion</button>`:''}</div>
<div style="overflow-x:auto;"><table class="data-table"><thead><tr><th>Code</th><th>Criterion Name</th><th>Max Marks</th><th>Status</th><th>Completion</th><th>Incharge</th><th>Deadline</th><th>Actions</th></tr></thead><tbody>
${NBA_CRITERIA_LIST.map(nc=>{
  const inst=D.criteria.find(c=>c.code===nc.code);
  const active=!!inst, f=inst?gF(inst.fid):null;
  const cl=inst?bClr(inst.pct||0,inst.status):'#94A3B8';
  return`<tr style="${!active?'opacity:0.55;':''}">
<td class="crit-code-td">${nc.code}</td>
<td style="font-weight:500;">${nc.name}</td>
<td class="mono">${nc.marks}</td>
<td>${active?pill(inst.status):`<span class="pill pill-notstarted">Inactive</span>`}</td>
<td>${active?tbar(inst.pct||0,cl):'<span class="text-muted">—</span>'}</td>
<td style="font-size:12px;">${f?.name||'—'}</td>
<td style="font-size:12px;">${inst?.deadline||'—'}</td>
<td><div class="btn-group">
${active?`<button class="btn-icon edit" title="Open Skeleton" onclick="nav('criteria',{type:'skeleton',code:'${nc.code}'})">${I.clip}</button>`:''}
${isA&&active?`<button class="btn-icon edit" title="Edit" onclick="editCritInst('${nc.code}')">${I.edit}</button><button class="btn-icon del" title="Deactivate" onclick="deactivateCrit('${nc.code}')">${I.trash}</button>`:''}
${isA&&!active?`<button class="btn-primary" style="padding:4px 10px;font-size:11px;" onclick="activateCritModal('${nc.code}')">Activate</button>`:''}
</div></td></tr>`;}).join('')}
</tbody></table></div></div></div>`;
}

/* ── CRITERIA SKELETON VIEW ────────────────────────────── */
function pgCritSkeleton(code){
  const skel=NBA_SKELETONS[code], inst=D.criteria.find(c=>c.code===code);
  const nc=NBA_CRITERIA_LIST.find(x=>x.code===code);
  if(!skel||!nc) return `<div class="page-section"><div class="card"><p>Skeleton not found for ${code}.</p></div></div>`;
  const data=(D.criteriaData||{})[code]||{};
  const f=inst?gF(inst.fid):null;

  // Gather all sections (flat + nested subSections)
  const allSections=[];
  (skel.sections||[]).forEach(s=>{
    if(s.subSections){allSections.push({...s,isParent:true});s.subSections.forEach(ss=>allSections.push({...ss,parentCode:s.code}));}
    else allSections.push(s);
  });

  const renderField=(secCode,f)=>{
    return `<div style="margin-bottom:12px;padding:12px;background:var(--surface);border-radius:6px;border-left:3px solid var(--accent);">
      <div style="font-weight:600;font-size:13px;margin-bottom:4px;color:var(--text);">${f.label} <span style="font-size:11px;color:var(--muted);font-weight:normal;">(${f.type==='table'?'Tabular Data Expected':'Textual/Numeric Data'})</span></div>
      <div style="font-size:12px;color:var(--muted);">${esc(f.hint)}</div>
      ${f.type==='table'?`<div style="margin-top:6px;font-size:11px;font-family:monospace;background:var(--bg);padding:6px;border-radius:4px;border:1px solid var(--border);">Columns Required: ${(f.cols||[]).join(' | ')}</div>`:''}
    </div>`;
  };

  return`<div class="page-section">
<div class="skel-header">
  <div>
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
      <span class="crit-code" style="font-size:18px;">${code}</span>
      <span style="font-size:16px;font-weight:600;">${nc.name}</span>
      <span class="crit-marks">${nc.marks} marks</span>
      ${inst?pill(inst.status):''}
    </div>
    <div style="font-size:13px;color:var(--muted);">${skel.desc||''} ${f?`· Incharge: <b>${f.name}</b>`:''}</div>
  </div>
  <button class="btn-primary" id="skel-back-btn">${I.clip} All Criteria</button>
</div>
<div class="ask-ai-bar">
  <span class="ask-ai-icon">${I.ai}</span>
  <input class="ask-ai-input" id="ask-ai-inp" placeholder="Ask AI — Get guidance on filling this criterion, understanding marks, required documents…" readonly/>
  <button class="btn-primary ask-ai-btn" onclick="alert('AI Assistant coming soon. This bar will connect to an AI bot to help you fill this criterion.')">Ask AI</button>
</div>
${allSections.filter(s=>!s.isParent).map(s=>{
  const secData=data[s.code]||{};
  const filled=(s.fields||[]).filter(f=>(secData[f.id]||'').toString().trim()).length;
  const total=(s.fields||[]).length;
  const pct=total?Math.round(filled/total*100):0;
  return`<div class="skel-section">
  <div class="skel-sec-hdr" onclick="this.parentElement.classList.toggle('open')">
    <div style="display:flex;align-items:center;gap:10px;flex:1;">
      <span class="crit-code-td" style="font-size:12px;">${s.code}</span>
      <span style="font-weight:600;">${s.title}</span>
      ${s.marks?`<span class="crit-marks">${s.marks} marks</span>`:''}
    </div>
    <div style="display:flex;align-items:center;gap:10px;">
      <span class="skel-chevron">▸</span>
    </div>
  </div>
  <div class="skel-sec-body">
    <div style="background:var(--bg);padding:14px;border-radius:8px;border-left:4px solid var(--accent);margin-bottom:20px;">
        <div style="font-weight:600;font-size:13px;color:var(--text);margin-bottom:6px;">Section Guidelines & Overview</div>
        <div style="font-size:13px;color:var(--muted);line-height:1.5;">${s.desc||'Review the required data points below systematically to fulfill the NBA requirements for this section.'}</div>
    </div>
    <div style="font-weight:600;font-size:13px;margin-bottom:12px;">Required Data Points:</div>
    ${(s.fields||[]).map(f=>renderField(s.code,f)).join('')}
    ${(s.docs||[]).length?`<div class="req-docs"><div class="req-docs-label">📎 Required Documents to Upload in Vault</div><ul>${s.docs.map(d=>`<li>${d}</li>`).join('')}</ul></div>`:''}
  </div>
</div>`;}).join('')}
<div class="form-actions" style="background:var(--surface);padding:16px;border-radius:12px;margin-top:16px;">
  <button class="btn-outline-blue" id="skel-back-btn2">${I.clip} Back to Criteria</button>
  ${inst&&Auth.isAdmin()?`<button class="btn-success" onclick="markCritComplete('${code}')">✓ Mark Complete</button>`:''}
</div>`;
}

/* ── DOCUMENT VAULT ────────────────────────────────────── */
function pgVault(){
  const isA=Auth.isAdmin();
  const critOpts=D.criteria.map(c=>`<option value="${c.code}">${c.code} — ${c.name||NBA_CRITERIA_LIST.find(x=>x.code===c.code)?.name||''}</option>`).join('');
  return`<div class="page-section">
<div class="filters-bar">
  <div class="search-wrap"><span class="search-icon">${I.srch}</span><input class="search-input" id="vsrch" placeholder="Search by name or criterion…"/></div>
  <select class="select-sm" style="height:40px;" id="vcrit"><option value="">All Criteria</option>${critOpts}</select>
  <select class="select-sm" style="height:40px;" id="vstatus"><option value="">All Statuses</option><option>Approved</option><option>Pending Review</option><option>Rejected</option></select>
  ${isA?`<button class="btn-dark" onclick="alert('ZIP export coming soon.')">${I.dl} Export ZIP</button>`:''}
</div>
<div class="card" id="vault-upload-box">
  <div class="section-label" style="margin-bottom:16px;">Upload New Document</div>
  <div class="upload-two-col">
    <div>
      <div class="form-group"><label class="form-label">Criterion</label><select class="input-field" id="ul-crit">${D.criteria.length?critOpts:'<option>No criteria active</option>'}</select></div>
      <div class="form-group"><label class="form-label">Document Type</label><select class="input-field" id="ul-type"><option>Course File</option><option>CO Attainment Sheet</option><option>PO Mapping Matrix</option><option>Faculty Resume</option><option>Lab Invoice</option><option>Assessment Rubric</option><option>Placement Data</option><option>Other</option></select></div>
      <div class="upload-zone" id="ul-zone">
        <div class="upload-icon" style="margin-bottom:12px;">${I.up}</div>
        <div class="upload-title">Drag and drop or click to browse</div>
        <div class="upload-sub">PDF, DOCX, XLSX, TXT supported</div>
        <input type="file" id="ul-file" accept=".pdf,.docx,.xlsx,.xls,.doc,.txt" style="display:none;" multiple/>
        <button class="btn-outline-blue" onclick="document.getElementById('ul-file').click()">${I.up} Browse Files</button>
      </div>
      <div id="ul-progress" style="display:none;margin-top:12px;" class="card"><div style="font-size:13px;color:var(--muted);">⏳ Extracting text from document…</div></div>
    </div>
    <div>
      <div class="upload-files-label">Recent Uploads</div>
      <div id="recent-uploads-list">${renderRecentUploads()}</div>
    </div>
  </div>
</div>
<div class="doc-grid" id="doc-grid">${renderDocs(D.documents,isA)}</div>
</div>`;
}

function renderRecentUploads(){
  const recent=D.documents.slice(-5).reverse();
  if(!recent.length) return `<div class="empty-state" style="padding:20px;"><p>No uploads yet.</p></div>`;
  return recent.map(d=>`<div class="file-item"><div class="file-icon ${ficn(d.ext)}">${ficnL(d.ext)}</div><div class="file-body"><div class="file-name">${esc(d.name)}</div><div class="file-meta"><span class="crit-pill-sm">${d.crit}</span> <span class="file-date">${d.date}</span></div></div>${pill(d.status)}</div>`).join('');
}

function renderDocs(docs,isA){
  if(!docs.length) return `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--muted);">No documents found.</div>`;
  return docs.map(d=>{const f=gF(d.fid);return`<div class="doc-card">
<div class="doc-card-top"><div class="file-icon ${ficn(d.ext)}">${ficnL(d.ext)}</div>
<div class="btn-group">${isA&&d.status==='Pending Review'?`<button class="btn-success btn-sm" onclick="approveDoc('${d.id}')" title="Approve">${I.check}</button><button class="btn-danger btn-sm" onclick="rejectDoc('${d.id}')" title="Reject">${I.x}</button>`:''}</div></div>
<div class="doc-name" title="${esc(d.name)}">${esc(d.name)}</div>
<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;"><span class="crit-pill-sm">${d.crit}</span><span class="doc-faculty">${f?.name||'—'}</span></div>
<div class="doc-date">${d.date}</div>${pill(d.status)}
<div class="doc-bottom"><span class="doc-size">${d.size}</span>${isA?`<button class="btn-icon del" onclick="deleteDoc('${d.id}')">${I.trash}</button>`:''}</div>
</div>`}).join('');
}

/* ── DOCUMENT SEARCH ────────────────────────────────────── */
function pgDocSearch(){
  return`<div class="page-section">
<div class="card">
  <div class="section-label" style="margin-bottom:8px;">${I.search} Cross-Document Search</div>
  <div style="font-size:13px;color:var(--muted);margin-bottom:16px;">Search any keyword across all uploaded documents. Text is extracted automatically when you upload files.</div>
  <div class="search-wrap" style="margin-bottom:16px;"><span class="search-icon">${I.srch}</span><input class="search-input" id="docsrch-inp" placeholder="Type a keyword to search… e.g. CO attainment, PO1, syllabus"/></div>
  <div id="docsrch-results"></div>
</div>
<div class="card" style="margin-top:16px;">
  <div class="section-label" style="margin-bottom:12px;">Indexed Documents (${D.documents.length})</div>
  ${D.documents.length?`<table class="data-table"><thead><tr><th>Document</th><th>Criterion</th><th>Type</th><th>Size</th><th>Text Indexed?</th></tr></thead><tbody>
  ${D.documents.map(d=>{const texts=loadTexts();const hasText=!!(texts[d.id]&&texts[d.id].length>10);return`<tr><td><div style="display:flex;align-items:center;gap:8px;"><div class="file-icon ${ficn(d.ext)}" style="width:24px;height:24px;font-size:8px;">${ficnL(d.ext)}</div>${esc(d.name)}</div></td><td><span class="crit-pill-sm">${d.crit}</span></td><td style="font-size:12px;">${d.type||'—'}</td><td style="font-size:12px;">${d.size}</td><td>${hasText?'<span class="text-green fw-600">✓ Indexed</span>':'<span class="text-muted">Not indexed</span>'}</td></tr>`;}).join('')}
  </tbody></table>`:`<div class="empty-state"><p>No documents uploaded yet.</p><span>Upload documents from the Document Vault to enable search.</span></div>`}
</div>
</div>`;
}

/* ── FACULTY ────────────────────────────────────────────── */
function pgFaculty(){
  return`<div class="page-section"><div class="card">
<div class="table-header-row">
  <div class="filters-bar"><span class="section-label">Faculty Members <span class="badge-count">${D.faculty.length}</span></span><div class="search-wrap" style="width:240px;"><span class="search-icon">${I.srch}</span><input class="search-input" id="fsrch" placeholder="Search name or email…"/></div></div>
  <button class="btn-primary" id="add-fac-btn">${I.plus} Add Faculty</button>
</div>
<div style="overflow-x:auto;"><table class="data-table"><thead><tr><th>Name</th><th>Email</th><th>Designation</th><th>Dept</th><th>Role</th><th>Criteria</th><th>PhD</th><th>Exp</th><th>Actions</th></tr></thead>
<tbody id="fac-tbody">${renderFacRows(D.faculty)}</tbody></table></div>
</div></div>`;
}

function renderFacRows(list){
  return list.map(f=>`<tr data-fid="${f.id}">
<td style="font-weight:600;">${esc(f.name)}</td>
<td style="font-size:12px;color:var(--muted);">${esc(f.email)}</td>
<td style="font-size:12px;">${esc(f.desg)}</td>
<td><span class="tag">${esc(f.dept||'—')}</span></td>
<td style="font-size:12px;">${esc(f.role)}</td>
<td>${f.crits?.length?f.crits.map(c=>`<span class="crit-pill-sm">${c}</span>`).join(' '):'<span class="text-muted">—</span>'}</td>
<td style="text-align:center;">${f.phd?'<span class="text-green fw-600">✓</span>':'<span class="text-muted">—</span>'}</td>
<td class="mono" style="font-size:12px;">${f.exp||0}y</td>
<td><div class="btn-group"><button class="btn-icon edit" onclick="editFac('${f.id}')">${I.edit}</button>${f.role!=='Super Admin'?`<button class="btn-icon del" onclick="delFac('${f.id}')">${I.trash}</button>`:''}</div></td>
</tr>`).join('');
}

/* ── EVENT BINDINGS ─────────────────────────────────────── */
function bindEvents(id,sub){
  if(id==='criteria'){
    if(sub&&sub.type==='skeleton'){
      document.getElementById('skel-back-btn')?.addEventListener('click',()=>nav('criteria'));
      document.getElementById('skel-back-btn2')?.addEventListener('click',()=>nav('criteria'));
      document.getElementById('skel-save-btn')?.addEventListener('click',()=>saveSkeleton(sub.code));
      // open first section
      document.querySelector('.skel-section')?.classList.add('open');
    } else {
      document.getElementById('activate-crit-btn')?.addEventListener('click',()=>showActivateModal());
    }
  }
  if(id==='vault'){
    const sg=document.getElementById('vsrch'),cv=document.getElementById('vcrit'),sv=document.getElementById('vstatus');
    const filter=()=>{let docs=D.documents;const q=(sg?.value||'').toLowerCase(),cr=cv?.value||'',st=sv?.value||'';if(q)docs=docs.filter(d=>d.name.toLowerCase().includes(q)||d.crit.toLowerCase().includes(q));if(cr)docs=docs.filter(d=>d.crit===cr);if(st)docs=docs.filter(d=>d.status===st);document.getElementById('doc-grid').innerHTML=renderDocs(docs,Auth.isAdmin());};
    sg?.addEventListener('input',filter);cv?.addEventListener('change',filter);sv?.addEventListener('change',filter);
    // File upload
    const fileInp=document.getElementById('ul-file');
    const zone=document.getElementById('ul-zone');
    fileInp?.addEventListener('change',e=>handleFileUpload(e.target.files));
    zone?.addEventListener('dragover',e=>{e.preventDefault();zone.style.borderColor='var(--accent)';});
    zone?.addEventListener('dragleave',()=>zone.style.borderColor='');
    zone?.addEventListener('drop',e=>{e.preventDefault();zone.style.borderColor='';handleFileUpload(e.dataTransfer.files);});
  }
  if(id==='docsearch'){
    document.getElementById('docsrch-inp')?.addEventListener('input',function(){searchDocs(this.value);});
  }
  if(id==='faculty'){
    document.getElementById('fsrch')?.addEventListener('input',function(){
      const q=this.value.toLowerCase();
      document.getElementById('fac-tbody').innerHTML=renderFacRows(q?D.faculty.filter(f=>f.name.toLowerCase().includes(q)||f.email.toLowerCase().includes(q)):D.faculty);
    });
    document.getElementById('add-fac-btn')?.addEventListener('click',()=>Mdl.show('Add Faculty Member',addFacForm()));
  }
}

/* ── SKELETON SAVE ──────────────────────────────────────── */
function saveSkeleton(code){
  if(!D.criteriaData) D.criteriaData={};
  if(!D.criteriaData[code]) D.criteriaData[code]={};
  document.querySelectorAll('.skel-field').forEach(el=>{
    const sec=el.dataset.sec, fid=el.dataset.fid;
    if(!D.criteriaData[code][sec]) D.criteriaData[code][sec]={};
    D.criteriaData[code][sec][fid]=el.value;
  });
  // update pct
  const inst=D.criteria.find(c=>c.code===code);
  if(inst){
    const skel=NBA_SKELETONS[code];
    let tot=0,filled=0;
    (skel.sections||[]).forEach(s=>{
      const fields=s.fields||[];
      const subFs=(s.subSections||[]).flatMap(ss=>ss.fields||[]);
      const allF=[...fields,...subFs];
      allF.forEach(f=>{tot++;if((D.criteriaData[code][s.code]||{})[f.id]?.toString().trim())filled++;});
      (s.subSections||[]).forEach(ss=>ss.fields?.forEach(f=>{if((D.criteriaData[code][ss.code]||{})[f.id]?.toString().trim())filled++;}));
    });
    inst.pct=tot?Math.round(filled/tot*100):0;
    if(inst.pct>0&&inst.status==='Not Started') inst.status='In Progress';
  }
  saveD();
  const flash=document.createElement('div');flash.className='save-flash';flash.textContent='✓ Saved successfully!';document.body.appendChild(flash);setTimeout(()=>flash.remove(),2000);
  anim();
}

/* ── FILE UPLOAD + EXTRACTION ───────────────────────────── */
async function handleFileUpload(files){
  if(!files||!files.length) return;
  const crit=document.getElementById('ul-crit')?.value||'';
  const type=document.getElementById('ul-type')?.value||'Other';
  const prog=document.getElementById('ul-progress');
  if(prog) prog.style.display='block';
  for(const file of files){
    const ext=file.name.split('.').pop().toLowerCase();
    const id=uid();
    const now=new Date();
    const dateStr=now.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
    const size=file.size>1048576?(file.size/1048576).toFixed(1)+' MB':(file.size/1024).toFixed(0)+' KB';
    const doc={id,name:file.name,ext,crit,type,fid:D.session?.user?.id||'admin01',date:dateStr,size,status:'Pending Review',uploadedAt:now.toISOString()};
    D.documents.push(doc);
    // extract text
    const text=await extractText(file);
    if(text){const texts=loadTexts();texts[id]=text;saveTexts(texts);}
  }
  if(prog) prog.style.display='none';
  // update incharge doc count
  const inst=D.criteria.find(c=>c.code===document.getElementById('ul-crit')?.value);
  if(inst){inst.dn=D.documents.filter(d=>d.crit===inst.code).length;}
  saveD();
  document.getElementById('doc-grid').innerHTML=renderDocs(D.documents,Auth.isAdmin());
  document.getElementById('recent-uploads-list').innerHTML=renderRecentUploads();
  // notify
  const flash=document.createElement('div');flash.className='save-flash';flash.textContent=`✓ ${files.length} file(s) uploaded!`;document.body.appendChild(flash);setTimeout(()=>flash.remove(),2500);
}

/* ── DOC SEARCH FUNCTION ────────────────────────────────── */
function searchDocs(q){
  const res=document.getElementById('docsrch-results');if(!res)return;
  if(!q||q.trim().length<2){res.innerHTML='<div class="text-muted" style="font-size:13px;">Type at least 2 characters to search…</div>';return;}
  const texts=loadTexts();const kw=q.toLowerCase();const matches=[];
  
  D.documents.forEach(d=>{
    const rawText = texts[d.id] || '';
    const t = rawText.toLowerCase();
    if(t.includes(kw)){
      let count = 0;
      let startIndex = 0;
      let idx = t.indexOf(kw, startIndex);
      const mArr = [];
      const MAX_MATCHES_PER_DOC = 500; // Increased limit to prevent hiding results
      while (idx !== -1 && count < MAX_MATCHES_PER_DOC) {
        const start = Math.max(0, idx - 60);
        const end = Math.min(t.length, idx + 80);
        let snippet = rawText.slice(start, end).replace(/\n/g, ' ');
        // Find nearest page
        let pageStr = '';
        if (d.ext === 'pdf') {
          const textBefore = rawText.slice(0, idx);
          const pIdx = textBefore.lastIndexOf('[Page:');
          if (pIdx !== -1) pageStr = 'Page ' + textBefore.slice(pIdx + 6).split(']')[0].trim();
          else pageStr = 'Page 1 (Or unpaginated)';
        } else if (d.ext === 'xlsx' || d.ext === 'xls') {
          const textBefore = rawText.slice(0, idx);
          const pIdx = textBefore.lastIndexOf('[Sheet:');
          if (pIdx !== -1) pageStr = 'Sheet ' + textBefore.slice(pIdx + 7).split(']')[0].trim();
        }
        if(!pageStr) pageStr = d.ext.toUpperCase() + ' Document';
        
        mArr.push({ snippet, pageStr });
        count++;
        startIndex = idx + kw.length;
        idx = t.indexOf(kw, startIndex);
      }
      const actualCount = (t.match(new RegExp(kw,'g'))||[]).length;
      matches.push({ doc:d, mArr, count: actualCount });
    }
  });

  if(!matches.length){res.innerHTML=`<div class="empty-state" style="padding:20px;"><p>No documents contain "<b>${esc(q)}</b>"</p><span>Try a different keyword or make sure documents have extractable text.</span></div>`;return;}
  
  let totalDocs = matches.length;
  let totalMatches = matches.reduce((sum, m) => sum + m.count, 0);

  res.innerHTML=`<div style="font-size:13px;color:var(--muted);margin-bottom:12px;">Found <b>${totalMatches}</b> result(s) in <b>${totalDocs}</b> document(s)</div>`+
  matches.map(m=>`
    <div class="search-result-card" style="margin-bottom:16px;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;border-bottom:1px solid var(--border);padding-bottom:10px;">
        <div class="file-icon ${ficn(m.doc.ext)}" style="width:28px;height:28px;font-size:9px;">${ficnL(m.doc.ext)}</div>
        <div style="flex:1;">
          <div style="font-weight:600;font-size:13px;">${esc(m.doc.name)}</div>
          <div style="font-size:11px;color:var(--muted);"><span class="crit-pill-sm">${m.doc.crit}</span> · ${m.count} match(es)</div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;max-height:600px;overflow-y:auto;padding-right:8px;">
        ${m.mArr.map(dm => `
          <div class="search-snippet" style="padding:10px;background:var(--bg);border-radius:6px;border:1px solid var(--border);">
            <div style="font-size:11px;color:var(--accent);margin-bottom:6px;font-weight:600;">${dm.pageStr}</div>
            <div style="line-height:1.5;">…${esc(dm.snippet).replace(new RegExp(esc(q),'gi'),`<mark>$&</mark>`)}…</div>
          </div>
        `).join('')}
        ${m.count > m.mArr.length ? `<div style="font-size:11px;color:var(--muted);text-align:center;margin-top:4px;">+ ${m.count - m.mArr.length} more matches in this document left hidden</div>` : ''}
      </div>
    </div>
  `).join('');
}

/* ── CRITERION MODALS ───────────────────────────────────── */
function showActivateModal(){
  const inactive=NBA_CRITERIA_LIST.filter(nc=>!D.criteria.find(c=>c.code===nc.code));
  if(!inactive.length){alert('All criteria are already active.');return;}
  Mdl.show('Activate Criterion',`
<div class="form-group"><label class="form-label">Select Criterion</label><select class="input-field" id="act-code">${inactive.map(nc=>`<option value="${nc.code}">${nc.code} — ${nc.name} (${nc.marks} marks)</option>`).join('')}</select></div>
<div class="form-group"><label class="form-label">Assign Faculty Incharge</label><select class="input-field" id="act-fac">${D.faculty.filter(f=>f.role!=='Super Admin').map(f=>`<option value="${f.id}">${f.name}</option>`).join('')||'<option>Add faculty first</option>'}</select></div>
<div class="form-group"><label class="form-label">Deadline</label><input class="input-field" type="date" id="act-dl"/></div>
<div class="form-actions"><button class="btn-outline-blue" onclick="Mdl.hide()">Cancel</button><button class="btn-primary" onclick="doActivateCrit()">Activate</button></div>`);
}
window.activateCritModal=function(code){
  const nc=NBA_CRITERIA_LIST.find(x=>x.code===code);if(!nc)return;
  Mdl.show(`Activate ${code} — ${nc.name}`,`
<div class="form-group"><label class="form-label">Assign Faculty Incharge</label><select class="input-field" id="act-fac">${D.faculty.filter(f=>f.role!=='Super Admin').map(f=>`<option value="${f.id}">${f.name}</option>`).join('')||'<option value="">Add faculty first</option>'}</select></div>
<div class="form-group"><label class="form-label">Deadline</label><input class="input-field" type="date" id="act-dl"/></div>
<div class="form-actions"><button class="btn-outline-blue" onclick="Mdl.hide()">Cancel</button><button class="btn-primary" onclick="doActivateCrit('${code}')">Activate</button></div>`);
};
window.doActivateCrit=function(code){
  const c=code||document.getElementById('act-code')?.value;
  const nc=NBA_CRITERIA_LIST.find(x=>x.code===c);if(!nc)return;
  if(D.criteria.find(x=>x.code===c)){alert('Already active.');Mdl.hide();return;}
  const fid=document.getElementById('act-fac')?.value||'';
  const dl=document.getElementById('act-dl')?.value||'';
  D.criteria.push({code:c,name:nc.name,marks:nc.marks,fid,deadline:dl,status:'Not Started',pct:0,dn:0,dt:0});
  const fac=gF(fid);if(fac){if(!fac.crits)fac.crits=[];if(!fac.crits.includes(c))fac.crits.push(c);}
  saveD();Mdl.hide();nav('criteria');
};
window.deactivateCrit=function(code){if(!confirm(`Deactivate ${code}? Filled data will be preserved.`))return;D.criteria=D.criteria.filter(c=>c.code!==code);D.faculty.forEach(f=>{if(f.crits)f.crits=f.crits.filter(c=>c!==code);});saveD();nav('criteria');};
window.editCritInst=function(code){const inst=D.criteria.find(c=>c.code===code);if(!inst)return;Mdl.show(`Edit ${code}`,`<div class="form-group"><label class="form-label">Assign Faculty</label><select class="input-field" id="ec-fac">${D.faculty.filter(f=>f.role!=='Super Admin').map(f=>`<option value="${f.id}"${f.id===inst.fid?' selected':''}>${f.name}</option>`).join('')}</select></div><div class="form-group"><label class="form-label">Status</label><select class="input-field" id="ec-status"><option${inst.status==='Not Started'?' selected':''}>Not Started</option><option${inst.status==='In Progress'?' selected':''}>In Progress</option><option${inst.status==='Complete'?' selected':''}>Complete</option><option${inst.status==='Submitted'?' selected':''}>Submitted</option></select></div><div class="form-group"><label class="form-label">Deadline</label><input class="input-field" type="date" id="ec-dl" value="${inst.deadline||''}"/></div><div class="form-actions"><button class="btn-outline-blue" onclick="Mdl.hide()">Cancel</button><button class="btn-primary" onclick="saveEditCritInst('${code}')">Save</button></div>`);};
window.saveEditCritInst=function(code){const inst=D.criteria.find(c=>c.code===code);if(!inst)return;inst.fid=document.getElementById('ec-fac').value;inst.status=document.getElementById('ec-status').value;inst.deadline=document.getElementById('ec-dl').value;saveD();Mdl.hide();nav('criteria');};
window.markCritComplete=function(code){const inst=D.criteria.find(c=>c.code===code);if(!inst)return;inst.status='Complete';saveD();nav('criteria',{type:'skeleton',code});};

/* ── DOC ACTIONS ────────────────────────────────────────── */
window.approveDoc=function(id){const d=D.documents.find(x=>x.id===id);if(d){d.status='Approved';saveD();document.getElementById('doc-grid').innerHTML=renderDocs(D.documents,true);}};
window.rejectDoc=function(id){const d=D.documents.find(x=>x.id===id);if(d){d.status='Rejected';saveD();document.getElementById('doc-grid').innerHTML=renderDocs(D.documents,true);}};
window.deleteDoc=function(id){if(!confirm('Delete this document?'))return;D.documents=D.documents.filter(x=>x.id!==id);const texts=loadTexts();delete texts[id];saveTexts(texts);saveD();document.getElementById('doc-grid').innerHTML=renderDocs(D.documents,true);document.getElementById('recent-uploads-list').innerHTML=renderRecentUploads();};

/* ── FACULTY CRUD ────────────────────────────────────────── */
function addFacForm(){const depts=D.depts;return`<div class="form-row"><div class="form-group"><label class="form-label">Full Name</label><input class="input-field" id="nf-name" placeholder="Dr. John Doe"/></div><div class="form-group"><label class="form-label">Email</label><input class="input-field" id="nf-email" type="email" placeholder="faculty@college.edu"/></div></div><div class="form-row"><div class="form-group"><label class="form-label">Password</label><input class="input-field" id="nf-pwd" type="password" placeholder="Login password"/></div><div class="form-group"><label class="form-label">Designation</label><select class="input-field" id="nf-desg"><option>Professor</option><option>Assoc. Professor</option><option>Asst. Professor</option><option>Lecturer</option></select></div></div><div class="form-row"><div class="form-group"><label class="form-label">Department</label><select class="input-field" id="nf-dept">${depts.map(d=>`<option value="${d.code}">${d.name}</option>`).join('')||'<option value="">No departments</option>'}</select></div><div class="form-group"><label class="form-label">Role</label><select class="input-field" id="nf-role"><option>Criterion Incharge</option><option>Department Head</option><option>NBA Coordinator</option><option>Faculty Member</option></select></div></div><div class="form-row"><div class="form-group"><label class="form-label">PhD</label><select class="input-field" id="nf-phd"><option value="false">No</option><option value="true">Yes</option></select></div><div class="form-group"><label class="form-label">Experience (years)</label><input class="input-field" id="nf-exp" type="number" placeholder="5"/></div></div><div class="form-actions"><button class="btn-outline-blue" onclick="Mdl.hide()">Cancel</button><button class="btn-primary" onclick="saveNewFac()">Add Faculty</button></div>`;}
window.saveNewFac=function(){const name=document.getElementById('nf-name').value.trim(),email=document.getElementById('nf-email').value.trim(),pwd=document.getElementById('nf-pwd').value;if(!name||!email||!pwd){alert('Name, email and password are required.');return;}if(D.faculty.find(f=>f.email.toLowerCase()===email.toLowerCase())){alert('Email already exists.');return;}D.faculty.push({id:uid(),name,email,pwd,desg:document.getElementById('nf-desg').value,dept:document.getElementById('nf-dept').value,role:document.getElementById('nf-role').value,crits:[],phd:document.getElementById('nf-phd').value==='true',exp:parseInt(document.getElementById('nf-exp').value)||0,pubs:0});saveD();Mdl.hide();nav('faculty');};
window.editFac=function(id){const f=gF(id);if(!f)return;Mdl.show(`Edit — ${f.name}`,`<div class="form-row"><div class="form-group"><label class="form-label">Full Name</label><input class="input-field" id="ef-name" value="${esc(f.name)}"/></div><div class="form-group"><label class="form-label">Email</label><input class="input-field" id="ef-email" value="${esc(f.email)}"/></div></div><div class="form-row"><div class="form-group"><label class="form-label">Password</label><input class="input-field" id="ef-pwd" type="password" placeholder="Leave blank to keep current"/></div><div class="form-group"><label class="form-label">Designation</label><input class="input-field" id="ef-desg" value="${esc(f.desg)}"/></div></div><div class="form-row"><div class="form-group"><label class="form-label">Department</label><select class="input-field" id="ef-dept">${D.depts.map(d=>`<option value="${d.code}"${f.dept===d.code?' selected':''}>${d.name}</option>`).join('')||`<option value="${f.dept}">${f.dept||'—'}</option>`}</select></div><div class="form-group"><label class="form-label">Role</label><select class="input-field" id="ef-role"><option${f.role==='Criterion Incharge'?' selected':''}>Criterion Incharge</option><option${f.role==='Department Head'?' selected':''}>Department Head</option><option${f.role==='NBA Coordinator'?' selected':''}>NBA Coordinator</option><option${f.role==='Faculty Member'?' selected':''}>Faculty Member</option></select></div></div><div class="form-row"><div class="form-group"><label class="form-label">PhD</label><select class="input-field" id="ef-phd"><option value="false"${!f.phd?' selected':''}>No</option><option value="true"${f.phd?' selected':''}>Yes</option></select></div><div class="form-group"><label class="form-label">Experience (years)</label><input class="input-field" id="ef-exp" type="number" value="${f.exp||0}"/></div></div><div class="form-actions"><button class="btn-outline-blue" onclick="Mdl.hide()">Cancel</button><button class="btn-primary" onclick="saveEditFac('${id}')">Save Changes</button></div>`);};
window.saveEditFac=function(id){const f=gF(id);if(!f)return;f.name=document.getElementById('ef-name').value;f.email=document.getElementById('ef-email').value;const pw=document.getElementById('ef-pwd').value;if(pw)f.pwd=pw;f.desg=document.getElementById('ef-desg').value;f.dept=document.getElementById('ef-dept').value;f.role=document.getElementById('ef-role').value;f.phd=document.getElementById('ef-phd').value==='true';f.exp=parseInt(document.getElementById('ef-exp').value)||0;saveD();Mdl.hide();nav('faculty');};
window.delFac=function(id){const f=gF(id);if(f&&confirm(`Remove ${f.name}?`)){D.faculty=D.faculty.filter(x=>x.id!==id);D.criteria.forEach(c=>{if(c.fid===id)c.fid='';});saveD();nav('faculty');}};
