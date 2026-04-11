'use strict';
/* ── CO-PO ───────────────────────────────────────────────── */
function pgCOPO(){
  if(!D.courses||!D.courses.length) return`<div class="page-section"><div class="empty-hero"><div class="empty-hero-icon">${I.tbl}</div><h2>No CO-PO Data Yet</h2><p>CO-PO mapping will appear here once courses are added via the criteria skeleton (C2 — CO-PO Mapping section).</p></div></div>`;
  const pos=['PO1','PO2','PO3','PO4','PO5','PO6','PO7','PO8','PO9','PO10','PO11','PO12'];
  const mc={3:'mc-3',2:'mc-2',1:'mc-1',0:'mc-0'};
  return`<div class="page-section"><div class="card"><div class="section-label" style="margin-bottom:4px;">CO-PO Correlation Matrix</div><div style="font-size:12px;color:var(--muted);margin-bottom:16px;">Scale: 3=High &nbsp;2=Medium &nbsp;1=Low &nbsp;0=No correlation</div>
<div class="matrix-scroll"><table class="matrix-table"><thead><tr><th class="row-head">Course</th>${pos.map(p=>`<th>${p}</th>`).join('')}</tr></thead><tbody>
${D.courses.map(c=>`<tr><td class="row-head"><div class="fw-600" style="font-size:12px;">${c.code}</div><div style="font-size:11px;color:var(--muted);max-width:160px;">${esc(c.name)}</div></td>${pos.map(p=>{const v=c.po?.[p]??0;return`<td><div class="matrix-cell ${mc[v]||'mc-0'}">${v||'—'}</div></td>`;}).join('')}</tr>`).join('')}
</tbody></table></div></div></div>`;
}

/* ── AI SCORE ────────────────────────────────────────────── */
function pgAI(){
  if(!D.criteria.length) return`<div class="page-section"><div class="empty-hero"><div class="empty-hero-icon">${I.ai}</div><h2>No Criteria Active</h2><p>Activate criteria first to see AI score analysis.</p></div></div>`;
  return`<div class="page-section"><div class="card" style="background:linear-gradient(135deg,#1e3a5f,#2563EB);color:#fff;border:none;"><div class="stat-label" style="color:#93C5FD;">AI Score Review</div><div class="stat-number">Coming Soon</div><div style="font-size:13px;color:#BFDBFE;margin-top:8px;">AI-powered criterion scoring will automatically evaluate your uploaded documents and filled criteria data to provide an estimated NBA score.</div><div class="ask-ai-bar" style="margin-top:16px;background:rgba(255,255,255,0.1);"><span class="ask-ai-icon">${I.ai}</span><input class="ask-ai-input" placeholder="Ask AI about your accreditation progress…" readonly style="background:transparent;color:#fff;"/><button class="btn-primary ask-ai-btn" onclick="alert('AI integration coming soon.')">Ask AI</button></div></div>
<div class="criteria-grid">${D.criteria.map(c=>{const cl=bClr(c.pct||0,c.status);return`<div class="crit-card"><div class="crit-card-top"><div style="display:flex;align-items:baseline;gap:6px;flex:1;min-width:0;"><span class="crit-code">${c.code}</span><span class="crit-name" style="font-size:12px;">${c.name||''}</span></div></div><div class="crit-bar-wrap"><div class="crit-pct-row"><span class="crit-pct" style="color:${cl};">${c.pct||0}%</span></div><div class="progress-bar-wrap"><div class="progress-bar" style="background:${cl};" data-target="${c.pct||0}"></div></div></div><div style="font-size:11px;color:var(--muted);margin-top:10px;">${c.status} · ${D.documents.filter(d=>d.crit===c.code).length} docs uploaded</div></div>`;}).join('')}
</div></div>`;
}

/* ── REPORTS ─────────────────────────────────────────────── */
function pgReports(){
  return`<div class="page-section"><div class="row-2">
<div class="card"><div class="section-label" style="margin-bottom:16px;">Generate Report</div>
<div class="form-group"><label class="form-label">Report Type</label><select class="input-field" id="rep-type"><option>SAR Summary Report</option><option>Criterion-wise Progress</option><option>Faculty Contribution Report</option><option>Document Audit Report</option><option>CO-PO Attainment Report</option></select></div>
<div class="form-group"><label class="form-label">Academic Year</label><input class="input-field" value="${getCurrentAcademicYear()}" readonly/></div>
<div class="form-group"><label class="form-label">Program</label><select class="input-field">${D.programs.length?D.programs.map(p=>`<option>${esc(p.name)}</option>`).join(''):'<option>No programs added</option>'}</select></div>
<div class="form-group"><label class="form-label">Include Sections</label>${['Executive Summary','Criteria Progress','Faculty Data','Document Audit'].map(s=>`<label style="display:flex;align-items:center;gap:8px;margin-bottom:8px;font-size:13px;cursor:pointer;"><input type="checkbox" checked style="accent-color:var(--accent);width:14px;height:14px;"/> ${s}</label>`).join('')}</div>
<div class="form-actions" style="margin-top:0;border-top:none;"><button class="btn-dark" onclick="alert('PDF export coming soon.')">${I.dl} Export PDF</button><button class="btn-primary" id="gen-report-btn">${I.rep} Preview</button></div>
</div>
<div class="card"><div class="section-label" style="margin-bottom:16px;">Quick Summary</div>
${D.criteria.length?`<table class="data-table"><thead><tr><th>Code</th><th>Criterion</th><th>Max</th><th>Progress</th><th>Status</th></tr></thead><tbody>
${D.criteria.map(c=>{const cl=bClr(c.pct||0,c.status);return`<tr><td class="crit-code-td">${c.code}</td><td style="font-weight:500;font-size:12px;">${esc(c.name||'')}</td><td class="mono">${c.marks}</td><td>${tbar(c.pct||0,cl)}</td><td>${pill(c.status)}</td></tr>`;}).join('')}
</tbody></table>`:'<div class="empty-state"><p>No criteria active.</p></div>'}
</div></div>
<div class="card" id="report-preview" style="display:none;"><div class="section-label" style="margin-bottom:16px;">Preview — SAR Summary ${getCurrentAcademicYear()}</div>
<table class="data-table"><thead><tr><th>Criterion</th><th>Max</th><th>Progress</th><th>Status</th><th>Incharge</th></tr></thead><tbody>
${D.criteria.map(c=>{const f=gF(c.fid),cl=bClr(c.pct||0,c.status);return`<tr><td><span class="crit-code-td">${c.code}</span> ${esc(c.name||'')}</td><td class="mono">${c.marks}</td><td>${tbar(c.pct||0,cl)}</td><td>${pill(c.status)}</td><td style="font-size:12px;">${esc(f?.name||'—')}</td></tr>`;}).join('')}
</tbody></table></div></div>`;
}

/* ── SETTINGS ────────────────────────────────────────────── */
function pgSettings(){
  return`<div class="page-section"><div class="card">
<div class="tab-nav">
  <button class="tab-btn active" data-tab="college">College Info</button>
  <button class="tab-btn" data-tab="depts">Departments</button>
  <button class="tab-btn" data-tab="programs">Programs</button>
  <button class="tab-btn" data-tab="notif">Notifications</button>
  <button class="tab-btn" data-tab="perms">Role Permissions</button>
</div>

<div class="tab-pane active" id="tab-college">
<div class="settings-grid">
<div>${[['Institution Full Name','full'],['Short Name / Acronym','name'],['Address','address'],['Phone','phone'],['Email','email'],['Website','website']].map(([k,fk])=>`<div class="form-group"><label class="form-label">${k}</label><input class="input-field col-field" id="col_${fk}" value="${esc(D.college[fk]||'')}" placeholder="${k}"/></div>`).join('')}</div>
<div>${[['Established Year','established'],['University Affiliation','affiliation'],['NAAC Grade','naac'],['NBA Status','nba'],['Principal/HOD','principal']].map(([k,fk])=>`<div class="form-group"><label class="form-label">${k}</label><input class="input-field col-field" id="col_${fk}" value="${esc(D.college[fk]||'')}" placeholder="${k}"/></div>`).join('')}</div>
</div>
<div class="form-actions"><button class="btn-primary" onclick="saveCollegeInfo()">Save College Info</button></div>
</div>

<div class="tab-pane" id="tab-depts">
<div class="table-header-row"><span></span><button class="btn-primary" onclick="addDeptModal()">${I.plus} Add Department</button></div>
${D.depts.length?`<table class="data-table"><thead><tr><th>Department Name</th><th>Code</th><th>HOD</th><th>Intake</th><th>Actions</th></tr></thead><tbody>
${D.depts.map(d=>`<tr><td style="font-weight:500;">${esc(d.name)}</td><td><span class="tag">${esc(d.code)}</span></td><td style="font-size:12px;">${esc(d.hod||'—')}</td><td class="mono">${d.intake||'—'}</td><td><div class="btn-group"><button class="btn-icon edit" onclick="editDeptModal('${d.id}')">${I.edit}</button><button class="btn-icon del" onclick="deleteDept('${d.id}')">${I.trash}</button></div></td></tr>`).join('')}
</tbody></table>`:`<div class="empty-state" style="padding:40px;"><p>No departments added yet.</p><span>Click "Add Department" to create one.</span></div>`}
</div>

<div class="tab-pane" id="tab-programs">
<div class="table-header-row"><span></span><button class="btn-primary" onclick="addProgramModal()">${I.plus} Add Program</button></div>
${D.programs.length?`<table class="data-table"><thead><tr><th>Program Name</th><th>Department</th><th>Intake</th><th>NBA Status</th><th>Actions</th></tr></thead><tbody>
${D.programs.map(p=>`<tr><td style="font-weight:500;">${esc(p.name)}</td><td><span class="tag">${esc(p.dept||'—')}</span></td><td class="mono">${p.intake||'—'}</td><td>${pill(p.nba==='Applied'?'In Progress':'Not Started')}</td><td><div class="btn-group"><button class="btn-icon edit" onclick="editProgModal('${p.id}')">${I.edit}</button><button class="btn-icon del" onclick="deleteProg('${p.id}')">${I.trash}</button></div></td></tr>`).join('')}
</tbody></table>`:`<div class="empty-state" style="padding:40px;"><p>No programs added yet.</p><span>Click "Add Program" to create one.</span></div>`}
</div>

<div class="tab-pane" id="tab-notif">
<div style="max-width:540px;">
${[{k:'email',l:'Email Alerts',d:'Receive email for all platform activity'},{k:'deadline',l:'Deadline Reminders',d:'Get notified before deadlines'},{k:'docUpload',l:'Document Notifications',d:'Alert when documents are uploaded or reviewed'},{k:'ai',l:'AI Analysis Updates',d:'Notify when AI re-scores criteria'}].map(n=>`<div class="toggle-row"><div class="toggle-info"><div class="toggle-label">${n.l}</div><div class="toggle-desc">${n.d}</div></div><label class="toggle-switch"><input type="checkbox" data-pref="${n.k}"${D.notifPrefs?.[n.k]?' checked':''}/><span class="toggle-slider"></span></label></div>`).join('')}
</div>
<div class="form-actions" style="padding-top:16px;"><button class="btn-primary" onclick="saveNotifPrefs()">Save Preferences</button></div>
</div>

<div class="tab-pane" id="tab-perms">
<table class="data-table"><thead><tr><th>Role</th><th>Dashboard</th><th>Upload Docs</th><th>Fill Criteria</th><th>Approve Docs</th><th>Manage Faculty</th><th>Settings</th></tr></thead><tbody>
${[{r:'Faculty Member',p:[1,1,1,0,0,0]},{r:'Criterion Incharge',p:[1,1,1,0,0,0]},{r:'Department Head',p:[1,1,1,0,1,0]},{r:'NBA Coordinator',p:[1,1,1,1,1,0]},{r:'Super Admin',p:[1,1,1,1,1,1]}].map(x=>`<tr><td style="font-weight:600;">${x.r}</td>${x.p.map(v=>`<td style="text-align:center;">${v?'<span class="text-green fw-600">✓</span>':'<span class="text-muted">—</span>'}</td>`).join('')}</tr>`).join('')}
</tbody></table>
</div>

</div></div>`;
}

function bindSettingsTabs(){
  document.querySelectorAll('.tab-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p=>p.classList.remove('active'));
      btn.classList.add('active');
      const t=document.getElementById('tab-'+btn.dataset.tab);
      if(t)t.classList.add('active');
    });
  });
}

window.saveCollegeInfo=function(){
  ['full','name','address','phone','email','website','established','affiliation','naac','nba','principal'].forEach(k=>{const el=document.getElementById('col_'+k);if(el)D.college[k]=el.value;});
  saveD();
  // Update login page college name
  const lc=document.querySelector('.login-college');if(lc&&D.college.name)lc.textContent=D.college.full||D.college.name;
  const flash=document.createElement('div');flash.className='save-flash';flash.textContent='✓ College info saved!';document.body.appendChild(flash);setTimeout(()=>flash.remove(),2000);
};
window.saveNotifPrefs=function(){document.querySelectorAll('[data-pref]').forEach(cb=>{if(!D.notifPrefs)D.notifPrefs={};D.notifPrefs[cb.dataset.pref]=cb.checked;});saveD();alert('Preferences saved!');};

/* Dept CRUD */
window.addDeptModal=function(){Mdl.show('Add Department',`<div class="form-group"><label class="form-label">Department Name</label><input class="input-field" id="nd-name" placeholder="e.g. Electrical Engineering"/></div><div class="form-row"><div class="form-group"><label class="form-label">Code</label><input class="input-field" id="nd-code" placeholder="EE"/></div><div class="form-group"><label class="form-label">HOD Name</label><input class="input-field" id="nd-hod" placeholder="Dr. Name"/></div></div><div class="form-group"><label class="form-label">Student Intake</label><input class="input-field" id="nd-intake" type="number" placeholder="60"/></div><div class="form-actions"><button class="btn-outline-blue" onclick="Mdl.hide()">Cancel</button><button class="btn-primary" onclick="saveNewDept()">Add Department</button></div>`);};
window.saveNewDept=function(){const name=document.getElementById('nd-name').value.trim(),code=document.getElementById('nd-code').value.trim();if(!name||!code){alert('Name and code required.');return;}D.depts.push({id:uid(),name,code,hod:document.getElementById('nd-hod').value,intake:parseInt(document.getElementById('nd-intake').value)||60});saveD();Mdl.hide();nav('settings');};
window.editDeptModal=function(id){const d=D.depts.find(x=>x.id===id);if(!d)return;Mdl.show('Edit Department',`<div class="form-group"><label class="form-label">Department Name</label><input class="input-field" id="ed-name" value="${esc(d.name)}"/></div><div class="form-row"><div class="form-group"><label class="form-label">Code</label><input class="input-field" id="ed-code" value="${esc(d.code)}"/></div><div class="form-group"><label class="form-label">HOD</label><input class="input-field" id="ed-hod" value="${esc(d.hod||'')}"/></div></div><div class="form-group"><label class="form-label">Intake</label><input class="input-field" id="ed-intake" type="number" value="${d.intake||60}"/></div><div class="form-actions"><button class="btn-outline-blue" onclick="Mdl.hide()">Cancel</button><button class="btn-primary" onclick="saveEditDept('${id}')">Save</button></div>`);};
window.saveEditDept=function(id){const d=D.depts.find(x=>x.id===id);if(!d)return;d.name=document.getElementById('ed-name').value;d.code=document.getElementById('ed-code').value;d.hod=document.getElementById('ed-hod').value;d.intake=parseInt(document.getElementById('ed-intake').value)||60;saveD();Mdl.hide();nav('settings');};
window.deleteDept=function(id){if(confirm('Remove this department?')){D.depts=D.depts.filter(d=>d.id!==id);saveD();nav('settings');}};

/* Program CRUD */
window.addProgramModal=function(){Mdl.show('Add Program',`<div class="form-group"><label class="form-label">Program Name</label><input class="input-field" id="np-name" placeholder="e.g. B.E. Electrical Engineering"/></div><div class="form-row"><div class="form-group"><label class="form-label">Department</label><select class="input-field" id="np-dept">${D.depts.map(d=>`<option value="${d.code}">${d.name}</option>`).join('')||'<option>Add departments first</option>'}</select></div><div class="form-group"><label class="form-label">Intake</label><input class="input-field" id="np-intake" type="number" placeholder="60"/></div></div><div class="form-group"><label class="form-label">NBA Application Status</label><select class="input-field" id="np-nba"><option value="Applied">Applied</option><option value="Not Applied">Not Applied</option></select></div><div class="form-actions"><button class="btn-outline-blue" onclick="Mdl.hide()">Cancel</button><button class="btn-primary" onclick="saveNewProg()">Add Program</button></div>`);};
window.saveNewProg=function(){const name=document.getElementById('np-name').value.trim();if(!name){alert('Program name required.');return;}D.programs.push({id:uid(),name,dept:document.getElementById('np-dept').value,intake:parseInt(document.getElementById('np-intake').value)||60,nba:document.getElementById('np-nba').value});saveD();Mdl.hide();nav('settings');};
window.editProgModal=function(id){const p=D.programs.find(x=>x.id===id);if(!p)return;Mdl.show('Edit Program',`<div class="form-group"><label class="form-label">Program Name</label><input class="input-field" id="ep-name" value="${esc(p.name)}"/></div><div class="form-row"><div class="form-group"><label class="form-label">Department</label><select class="input-field" id="ep-dept">${D.depts.map(d=>`<option value="${d.code}"${p.dept===d.code?' selected':''}>${d.name}</option>`).join('')}</select></div><div class="form-group"><label class="form-label">Intake</label><input class="input-field" id="ep-intake" type="number" value="${p.intake||60}"/></div></div><div class="form-group"><label class="form-label">NBA Status</label><select class="input-field" id="ep-nba"><option value="Applied"${p.nba==='Applied'?' selected':''}>Applied</option><option value="Not Applied"${p.nba!=='Applied'?' selected':''}>Not Applied</option></select></div><div class="form-actions"><button class="btn-outline-blue" onclick="Mdl.hide()">Cancel</button><button class="btn-primary" onclick="saveEditProg('${id}')">Save</button></div>`);};
window.saveEditProg=function(id){const p=D.programs.find(x=>x.id===id);if(!p)return;p.name=document.getElementById('ep-name').value;p.dept=document.getElementById('ep-dept').value;p.intake=parseInt(document.getElementById('ep-intake').value)||60;p.nba=document.getElementById('ep-nba').value;saveD();Mdl.hide();nav('settings');};
window.deleteProg=function(id){if(confirm('Remove this program?')){D.programs=D.programs.filter(p=>p.id!==id);saveD();nav('settings');}};

/* ── FACULTY DASHBOARD ───────────────────────────────────── */
function pgFacDash(){
  const u=D.session?.user, mycrits=D.criteria.filter(c=>c.fid===u?.id), mydocs=D.documents.filter(d=>d.fid===u?.id);
  return`<div class="page-section">
<div class="faculty-stat-bar">
  <div class="fac-stat"><div class="section-label">My Assignments</div></div>
  <div class="fac-divider"></div>
  <div class="fac-stat"><div class="fac-stat-val">${mycrits.length}</div><div class="fac-stat-label">Criteria Assigned</div></div>
  <div class="fac-divider"></div>
  <div class="fac-stat"><div class="fac-stat-val text-red">${mydocs.filter(d=>d.status==='Pending Review').length}</div><div class="fac-stat-label">Docs Pending Review</div></div>
  <div class="fac-divider"></div>
  <div class="fac-stat"><div class="fac-stat-val">${mydocs.length}</div><div class="fac-stat-label">Files Uploaded</div></div>
</div>
<div class="ask-ai-bar"><span class="ask-ai-icon">${I.ai}</span><input class="ask-ai-input" placeholder="Ask AI — Get help with your criteria, NBA guidelines, document requirements…" readonly/><button class="ask-ai-btn btn-primary" onclick="nav('aiasst')">Ask AI</button></div>
<div><div class="section-label" style="margin-bottom:12px;">My Assigned Criteria</div>
${mycrits.length?`<div class="criteria-grid">${mycrits.map(c=>{const cl=bClr(c.pct||0,c.status);return`<div class="crit-card" style="cursor:pointer;" onclick="nav('mycrits',{type:'skeleton',code:'${c.code}'})">
<div class="crit-card-top"><div style="display:flex;align-items:baseline;gap:6px;flex:1;min-width:0;"><span class="crit-code">${c.code}</span><span class="crit-name">${esc(c.name||'')}</span></div><span class="crit-marks">${c.marks} marks</span></div>
<div class="crit-bar-wrap"><div class="crit-pct-row"><span class="crit-pct" style="color:${cl};">${c.pct||0}%</span></div><div class="progress-bar-wrap"><div class="progress-bar" style="background:${cl};" data-target="${c.pct||0}"></div></div></div>
<div class="crit-bottom"><span class="crit-incharge">Due: ${c.deadline||'—'}</span>${pill(c.status)}</div></div>`;}).join('')}</div>`
:`<div class="empty-state"><p>No criteria assigned yet.</p><span>Contact your NBA Coordinator to get criteria assigned.</span></div>`}
</div>
<div class="card"><div class="section-label" style="margin-bottom:14px;">My Recent Documents</div>
${mydocs.length?`<div style="overflow-x:auto;"><table class="data-table"><thead><tr><th>File Name</th><th>Criterion</th><th>Date</th><th>Size</th><th>Status</th></tr></thead><tbody>
${mydocs.slice(-8).reverse().map(d=>`<tr><td><div style="display:flex;align-items:center;gap:8px;"><div class="file-icon ${ficn(d.ext)}" style="width:24px;height:24px;font-size:8px;">${ficnL(d.ext)}</div>${esc(d.name)}</div></td><td><span class="crit-pill-sm">${d.crit}</span></td><td>${d.date}</td><td>${d.size}</td><td>${pill(d.status)}</td></tr>`).join('')}
</tbody></table></div>`:`<div class="empty-state"><p>No documents uploaded yet.</p></div>`}
</div></div>`;
}

/* ── MY CRITERIA (FACULTY) ───────────────────────────────── */
function pgMyCrits(sub){
  if(sub&&sub.type==='skeleton') return pgCritSkeleton(sub.code);
  const u=D.session?.user, mycrits=D.criteria.filter(c=>c.fid===u?.id);
  return`<div class="page-section">
<div class="ask-ai-bar"><span class="ask-ai-icon">${I.ai}</span><input class="ask-ai-input" id="ask-ai-inp" placeholder="Ask AI — Type your question about any criterion, document checklist, or NBA guidelines…" readonly/><button class="btn-primary ask-ai-btn" onclick="alert('AI Assistant coming soon.')">Ask AI</button></div>
${mycrits.length?`<div class="criteria-grid">${mycrits.map(c=>{const cl=bClr(c.pct||0,c.status);const skel=NBA_SKELETONS[c.code];const data=(D.criteriaData||{})[c.code]||{};let tot=0,filled=0;(skel?.sections||[]).forEach(s=>{(s.fields||[]).forEach(f=>{tot++;if(Object.values(data).some(sec=>sec[f.id]?.toString().trim()))filled++;});(s.subSections||[]).forEach(ss=>(ss.fields||[]).forEach(f=>{tot++;if((data[ss.code]||{})[f.id]?.toString().trim())filled++;}));});return`<div class="crit-card" style="cursor:pointer;" onclick="nav('mycrits',{type:'skeleton',code:'${c.code}'})">
<div class="crit-card-top"><div style="display:flex;align-items:baseline;gap:6px;flex:1;min-width:0;"><span class="crit-code">${c.code}</span><span class="crit-name">${esc(c.name||'')}</span></div><span class="crit-marks">${c.marks} marks</span></div>
<div class="crit-bar-wrap"><div class="crit-pct-row"><span class="crit-pct" style="color:${cl};">${c.pct||0}%</span></div><div class="progress-bar-wrap"><div class="progress-bar" style="background:${cl};" data-target="${c.pct||0}"></div></div></div>
<div class="crit-bottom"><span class="crit-incharge">Due: ${c.deadline||'—'} · ${filled}/${tot} fields filled</span>${pill(c.status)}</div>
<button class="btn-primary" style="margin-top:10px;width:100%;font-size:12px;" onclick="event.stopPropagation();nav('mycrits',{type:'skeleton',code:'${c.code}'})">View Criterion Structure →</button>
</div>`;}).join('')}</div>`:`<div class="empty-state" style="margin-top:40px;"><p>No criteria assigned.</p><span>Contact your NBA Coordinator.</span></div>`}
</div>`;
}

/* ── UPLOAD (FACULTY) ────────────────────────────────────── */
function pgUpload(){
  const u=D.session?.user, mydocs=D.documents.filter(d=>d.fid===u?.id);
  const mycrits=D.criteria.filter(c=>c.fid===u?.id);
  const critOpts=mycrits.length?mycrits.map(c=>`<option value="${c.code}">${c.code} — ${esc(c.name||'')}</option>`).join(''):'<option>No criteria assigned</option>';
  return`<div class="page-section"><div class="card">
<div class="section-label" style="margin-bottom:16px;">Upload Documents</div>
<div class="upload-two-col">
<div>
  <div class="form-group"><label class="form-label">Criterion</label><select class="input-field" id="ul-crit">${critOpts}</select></div>
  <div class="form-group"><label class="form-label">Document Type</label><select class="input-field" id="ul-type"><option>Course File</option><option>CO Attainment Sheet</option><option>PO Mapping Matrix</option><option>Faculty Resume</option><option>Lab Invoice</option><option>Assessment Rubric</option><option>Student Feedback</option><option>Other</option></select></div>
  <div class="upload-zone" id="ul-zone">
    <div class="upload-icon" style="margin-bottom:12px;">${I.up}</div>
    <div class="upload-title">Drag and drop or click to browse</div>
    <div class="upload-sub">PDF, DOCX, XLSX, TXT supported · Text will be extracted for search</div>
    <input type="file" id="ul-file" accept=".pdf,.docx,.xlsx,.xls,.doc,.txt" style="display:none;" multiple/>
    <button class="btn-outline-blue" onclick="document.getElementById('ul-file').click()">${I.up} Browse Files</button>
  </div>
  <div id="ul-progress" style="display:none;margin-top:12px;" class="card"><div style="font-size:13px;color:var(--muted);">⏳ Extracting text… please wait</div></div>
</div>
<div>
  <div class="upload-files-label">My Uploaded Documents</div>
  ${mydocs.length?mydocs.slice(-8).reverse().map(d=>`<div class="file-item"><div class="file-icon ${ficn(d.ext)}">${ficnL(d.ext)}</div><div class="file-body"><div class="file-name">${esc(d.name)}</div><div class="file-meta"><span class="crit-pill-sm">${d.crit}</span> <span class="file-date">${d.date}</span></div></div>${pill(d.status)}</div>`).join(''):`<div class="empty-state" style="padding:30px;"><p>No documents yet.</p></div>`}
</div></div></div></div>`;
}

/* ── AI ASSISTANT ────────────────────────────────────────── */
function pgAIAsst(){
  return`<div class="page-section"><div class="card" style="padding:0;overflow:hidden;">
<div style="padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;"><div style="width:32px;height:32px;border-radius:50%;background:#EFF6FF;display:flex;align-items:center;justify-content:center;">${I.ai}</div><div><div style="font-size:13px;font-weight:600;">AccreditIQ AI Assistant</div><div style="font-size:11px;color:var(--muted);">Coming soon — Will help with criteria guidance, document requirements & NBA guidelines</div></div></div>
<div style="padding:40px;text-align:center;">
  <div style="width:80px;height:80px;border-radius:50%;background:#EFF6FF;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">${I.ai}</div>
  <h3 style="margin-bottom:12px;">AI Assistant Coming Soon</h3>
  <p style="color:var(--muted);font-size:14px;max-width:400px;margin:0 auto 20px;">The AI assistant will be able to answer questions about NBA criteria, guide you through the accreditation process, and analyze your uploaded documents.</p>
  <div class="ask-ai-bar"><span class="ask-ai-icon">${I.ai}</span><input class="ask-ai-input" placeholder="Ask AI — Coming soon…" readonly/><button class="btn-primary ask-ai-btn" disabled>Ask AI</button></div>
</div></div></div>`;
}

/* ── EVENT BINDINGS (pages2) ─────────────────────────────── */
function bindEvents(id, sub){
  if(id==='vault'){
    const sg=document.getElementById('vsrch'),cv=document.getElementById('vcrit'),sv=document.getElementById('vstatus');
    const filter=()=>{let docs=D.documents;const q=(sg?.value||'').toLowerCase(),cr=cv?.value||'',st=sv?.value||'';if(q)docs=docs.filter(d=>d.name.toLowerCase().includes(q)||d.crit.toLowerCase().includes(q));if(cr)docs=docs.filter(d=>d.crit===cr);if(st)docs=docs.filter(d=>d.status===st);document.getElementById('doc-grid').innerHTML=renderDocs(docs,Auth.isAdmin());};
    sg?.addEventListener('input',filter);cv?.addEventListener('change',filter);sv?.addEventListener('change',filter);
    const fileInp=document.getElementById('ul-file'),zone=document.getElementById('ul-zone');
    fileInp?.addEventListener('change',e=>handleFileUpload(e.target.files));
    zone?.addEventListener('dragover',e=>{e.preventDefault();zone.style.borderColor='var(--accent)';});
    zone?.addEventListener('dragleave',()=>zone.style.borderColor='');
    zone?.addEventListener('drop',e=>{e.preventDefault();zone.style.borderColor='';handleFileUpload(e.dataTransfer.files);});
  }
  if(id==='upload'){
    const fileInp=document.getElementById('ul-file'),zone=document.getElementById('ul-zone');
    fileInp?.addEventListener('change',e=>handleFileUpload(e.target.files));
    zone?.addEventListener('dragover',e=>{e.preventDefault();zone.style.borderColor='var(--accent)';});
    zone?.addEventListener('dragleave',()=>zone.style.borderColor='');
    zone?.addEventListener('drop',e=>{e.preventDefault();zone.style.borderColor='';handleFileUpload(e.dataTransfer.files);});
  }
  if(id==='docsearch'){
    document.getElementById('docsrch-inp')?.addEventListener('input',function(){searchDocs(this.value);});
  }
  if(id==='criteria'){
    if(sub&&sub.type==='skeleton'){
      document.getElementById('skel-back-btn')?.addEventListener('click',()=>nav('criteria'));
      document.getElementById('skel-back-btn2')?.addEventListener('click',()=>nav('criteria'));
      document.getElementById('skel-save-btn')?.addEventListener('click',()=>saveSkeleton(sub.code));
      document.querySelector('.skel-section')?.classList.add('open');
    } else {
      document.getElementById('activate-crit-btn')?.addEventListener('click',()=>showActivateModal());
    }
  }
  if(id==='mycrits'){
    if(sub&&sub.type==='skeleton'){
      document.getElementById('skel-back-btn')?.addEventListener('click',()=>nav('mycrits'));
      document.getElementById('skel-back-btn2')?.addEventListener('click',()=>nav('mycrits'));
      document.getElementById('skel-save-btn')?.addEventListener('click',()=>saveSkeleton(sub.code));
      document.querySelector('.skel-section')?.classList.add('open');
    }
  }
  if(id==='faculty'){
    document.getElementById('fsrch')?.addEventListener('input',function(){const q=this.value.toLowerCase();document.getElementById('fac-tbody').innerHTML=renderFacRows(q?D.faculty.filter(f=>f.name.toLowerCase().includes(q)||f.email.toLowerCase().includes(q)):D.faculty);});
    document.getElementById('add-fac-btn')?.addEventListener('click',()=>Mdl.show('Add Faculty Member',addFacForm()));
  }
  if(id==='settings') bindSettingsTabs();
  if(id==='reports') document.getElementById('gen-report-btn')?.addEventListener('click',()=>{const p=document.getElementById('report-preview');if(p){p.style.display='block';anim();}});
}
