// ============================================================
// AccreditIQ SAR Generator — Frontend Logic
// ============================================================
import { CRITERIA_DATA, TOTAL_MARKS } from "./criteria-data.js";

// ── State ─────────────────────────────────────────────────────
let activeCriterion = null;
let activeSubCriterion = null;
let scores = {}; // { "C1.1": 28, "C1.2": 20, ... }
let generatedContent = {}; // { "C1.1": "<html>...", ... }
let userData = {}; // { "C1.1": "user text...", ... }
let attachedFiles = {}; // { "C1.1": [{ name, content }], ... }

let auditFiles = {}; // { "C1.1": [{ name, content }], ... }

// ── DOM Elements ──────────────────────────────────────────────
const criteriaNav = document.getElementById("criteriaNav");
const welcomePanel = document.getElementById("welcomePanel");
const detailPanel = document.getElementById("detailPanel");
const expandedView = document.getElementById("expandedView");
const totalScoreEl = document.getElementById("totalScore");
const scorePercentEl = document.getElementById("scorePercent");
const scoreRingEl = document.getElementById("scoreRing");

// ── Mode Tabs Toggling ────────────────────────────────────────
const tabGenerate = document.getElementById("tabGenerate");
const tabAudit = document.getElementById("tabAudit");
const modeGeneratePanel = document.getElementById("modeGeneratePanel");
const modeAuditPanel = document.getElementById("modeAuditPanel");

tabGenerate.addEventListener("click", () => {
  tabGenerate.classList.add("active");
  tabGenerate.style.background = "var(--indigo-50)";
  tabGenerate.style.color = "var(--indigo-700)";
  
  tabAudit.classList.remove("active");
  tabAudit.style.background = "transparent";
  tabAudit.style.color = "var(--text-secondary)";
  
  modeGeneratePanel.classList.remove("hidden");
  modeAuditPanel.classList.add("hidden");
});

tabAudit.addEventListener("click", () => {
  tabAudit.classList.add("active");
  tabAudit.style.background = "var(--indigo-50)";
  tabAudit.style.color = "var(--indigo-700)";
  
  tabGenerate.classList.remove("active");
  tabGenerate.style.background = "transparent";
  tabGenerate.style.color = "var(--text-secondary)";
  
  modeAuditPanel.classList.remove("hidden");
  modeGeneratePanel.classList.add("hidden");
});

// ── Build Sidebar Navigation ──────────────────────────────────
function buildNav() {
  criteriaNav.innerHTML = CRITERIA_DATA.map((c) => `
    <div class="criterion-item">
      <button class="criterion-btn" data-id="${c.id}">
        <div class="criterion-num">${c.id.replace("C", "")}</div>
        <div class="criterion-name">${c.name}</div>
        <span class="criterion-marks-tag">${c.marks}</span>
        <span class="criterion-score" id="navScore-${c.id}"></span>
      </button>
    </div>
  `).join("");

  criteriaNav.querySelectorAll(".criterion-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      selectCriterion(id);
    });
  });
}

// ── Select Criterion → Show Sub-criteria Grid ─────────────────
function selectCriterion(id) {
  activeCriterion = CRITERIA_DATA.find((c) => c.id === id);
  activeSubCriterion = null;
  if (!activeCriterion) return;

  // Update sidebar active state
  criteriaNav.querySelectorAll(".criterion-btn").forEach((b) => b.classList.remove("active"));
  criteriaNav.querySelector(`[data-id="${id}"]`)?.classList.add("active");

  // Show detail panel, hide others
  welcomePanel.classList.add("hidden");
  expandedView.classList.add("hidden");
  detailPanel.classList.remove("hidden");

  // Populate header
  document.getElementById("detailBreadcrumb").textContent = `PART B > ${id}`;
  document.getElementById("detailTitle").textContent = `${id}: ${activeCriterion.name}`;
  document.getElementById("detailMarks").textContent = `${activeCriterion.marks} Marks`;

  // Build sub-criteria cards
  const grid = document.getElementById("subcriteriaGrid");
  grid.innerHTML = activeCriterion.subCriteria.map((sc) => {
    const hasContent = !!generatedContent[sc.id];
    const score = scores[sc.id];
    return `
      <div class="subcriterion-card ${hasContent ? "has-content" : ""}" data-sc-id="${sc.id}">
        <div class="sc-header">
          <span class="sc-id">${sc.id}</span>
          <span class="sc-marks">${sc.marks} marks</span>
        </div>
        <div class="sc-name">${sc.name}</div>
        <div class="sc-docs">📄 ${sc.documents.length} documents required</div>
        <div class="sc-status ${hasContent ? "done" : "empty"}">
          ${hasContent
            ? `✅ Generated${score !== undefined ? ` • Score: ${score}/${sc.marks}` : ""}`
            : "○ Not started"
          }
        </div>
      </div>
    `;
  }).join("");

  grid.querySelectorAll(".subcriterion-card").forEach((card) => {
    card.addEventListener("click", () => {
      expandSubCriterion(card.dataset.scId);
    });
  });
}

// ── Expand a Sub-criterion → Show Full Details ────────────────
function expandSubCriterion(scId) {
  const sc = activeCriterion.subCriteria.find((s) => s.id === scId);
  if (!sc) return;
  activeSubCriterion = sc;

  detailPanel.classList.add("hidden");
  expandedView.classList.remove("hidden");

  // Header
  document.getElementById("expandedTitle").textContent = `${sc.id}: ${sc.name}`;
  document.getElementById("expandedMarks").textContent = `${sc.marks} Marks`;

  // Documents Checklist
  const docList = document.getElementById("docList");
  const docsSection = document.getElementById("docsSection");
  if (sc.documents.length > 0) {
    docsSection.style.display = "";
    updateDocChecklist(sc.id); // initial render
  } else {
    docsSection.style.display = "none";
  }

  // Tables
  const tableList = document.getElementById("tableList");
  const tablesSection = document.getElementById("tablesSection");
  if (sc.tables && sc.tables.length > 0) {
    tablesSection.style.display = "";
    tableList.innerHTML = sc.tables.map((t) => `<li>${t}</li>`).join("");
  } else {
    tablesSection.style.display = "none";
  }

  // Formula
  const formulaSection = document.getElementById("formulaSection");
  const formulaBox = document.getElementById("formulaBox");
  if (sc.formula) {
    formulaSection.style.display = "";
    formulaBox.textContent = sc.formula;
  } else {
    formulaSection.style.display = "none";
  }

  // Image placeholders
  const imagesSection = document.getElementById("imagesSection");
  const imageGrid = document.getElementById("imageGrid");
  if (sc.imagePlaceholders && sc.imagePlaceholders.length > 0) {
    imagesSection.style.display = "";
    imageGrid.innerHTML = sc.imagePlaceholders.map((p) => `
      <div class="image-placeholder">
        <div class="image-placeholder-icon">🖼️</div>
        <div class="image-placeholder-text">${p}</div>
      </div>
    `).join("");
  } else {
    imagesSection.style.display = "none";
  }

  // Restore user data
  document.getElementById("userDataInput").value = userData[sc.id] || "";

  // Restore attached files display
  renderSectionFiles(sc.id, "generate");
  renderSectionFiles(sc.id, "audit");

  // Restore generated output
  const outputSection = document.getElementById("outputSection");
  const outputContent = document.getElementById("outputContent");
  if (generatedContent[sc.id]) {
    outputSection.style.display = "";
    outputContent.innerHTML = generatedContent[sc.id];
  } else {
    outputSection.style.display = "none";
  }

  // Restore score
  const scoreSection = document.getElementById("scoreSection");
  const scoreOutput = document.getElementById("scoreOutput");
  if (scores[sc.id] !== undefined) {
    scoreSection.style.display = "";
    document.getElementById("downloadAuditBtn").classList.remove("hidden");
  } else {
    scoreSection.style.display = "none";
    document.getElementById("downloadAuditBtn").classList.add("hidden");
  }
}

// ── File Attachments logic ───────────────────────────────
const sectionAttachBtn = document.getElementById("sectionAttachBtn");
const sectionFileInput = document.getElementById("sectionFileInput");
const auditAttachBtn = document.getElementById("auditAttachBtn");
const auditFileInput = document.getElementById("auditFileInput");

sectionAttachBtn.addEventListener("click", () => sectionFileInput.click());
auditAttachBtn.addEventListener("click", () => auditFileInput.click());

async function handleFileUpload(inputElement, mode) {
  if (!activeSubCriterion) return;
  const files = Array.from(inputElement.files);
  if (files.length === 0) return;

  const formData = new FormData();
  files.forEach((f) => formData.append("files", f));
  formData.append("scId", activeSubCriterion.id);

  try {
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.success) {
      if (mode === "generate") {
        if (!attachedFiles[activeSubCriterion.id]) attachedFiles[activeSubCriterion.id] = [];
        attachedFiles[activeSubCriterion.id].push(...data.files);
      } else {
        if (!auditFiles[activeSubCriterion.id]) auditFiles[activeSubCriterion.id] = [];
        auditFiles[activeSubCriterion.id].push(...data.files);
      }
      renderSectionFiles(activeSubCriterion.id, mode);

      // Animation for status update
      const cards = document.querySelectorAll(".subcriterion-card");
      cards.forEach(card => {
        if(card.dataset.scId === activeSubCriterion.id) {
          card.classList.add("upload-success-anim");
          setTimeout(() => card.classList.remove("upload-success-anim"), 1000);
        }
      });
    }
  } catch (err) {
    console.error("Upload error:", err);
  }
  inputElement.value = "";
}

sectionFileInput.addEventListener("change", () => handleFileUpload(sectionFileInput, "generate"));
auditFileInput.addEventListener("change", () => handleFileUpload(auditFileInput, "audit"));

function renderSectionFiles(scId, mode) {
  const container = document.getElementById(mode === "generate" ? "sectionAttachedFiles" : "auditAttachedFiles");
  const filesList = mode === "generate" ? attachedFiles[scId] : auditFiles[scId];
  const files = filesList || [];
  container.innerHTML = files.map((f) => `<span class="attached-file">📎 ${f.name}</span>`).join("");
  if (mode === "generate" && activeSubCriterion && scId === activeSubCriterion.id) {
    updateDocChecklist(scId);
  }
}

// ── Document Checklist Logic ───────────────────────────────────
function updateDocChecklist(scId) {
  const sc = activeCriterion.subCriteria.find((s) => s.id === scId);
  if (!sc || sc.documents.length === 0) return;
  const filesList = attachedFiles[scId] || [];
  const uploadedNames = filesList.map(f => f.name.toLowerCase());
  
  const docList = document.getElementById("docList");
  docList.innerHTML = sc.documents.map((d) => {
    // Simple heuristic: if any uploaded file matches a generic token from the requirement
    const tokens = d.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(' ').filter(w => w.length > 3);
    const isMatched = uploadedNames.some(uname => tokens.some(t => uname.includes(t))) || (filesList.length > 0 && d.toLowerCase().includes("report"));
    return `<li class="${isMatched ? 'checked-anim' : ''}" style="${isMatched ? 'text-decoration: line-through; color: #10B981;' : ''}">
      ${isMatched ? '✅' : '○'} ${d}
    </li>`;
  }).join("");
}

// ── Save User Data on Input ───────────────────────────────────
document.getElementById("userDataInput").addEventListener("input", (e) => {
  if (activeSubCriterion) {
    userData[activeSubCriterion.id] = e.target.value;
  }
});

// ── Generate SAR Narrative ────────────────────────────────────
document.getElementById("generateBtn").addEventListener("click", async () => {
  if (!activeSubCriterion) return;
  const sc = activeSubCriterion;
  const userInput = userData[sc.id] || "";
  const files = attachedFiles[sc.id] || [];

  const btn = document.getElementById("generateBtn");
  btn.disabled = true;
  btn.textContent = "⏳ Generating...";

  const outputSection = document.getElementById("outputSection");
  const outputContent = document.getElementById("outputContent");
  outputSection.style.display = "";
  outputContent.innerHTML = '<div style="color: var(--text-muted);">Generating SAR narrative...</div>';

  // Build the prompt with sub-criteria context
  const prompt = buildGeneratePrompt(sc, userInput, files);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: prompt,
        history: [],
        fileContents: files,
      }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop();

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.text) {
              fullText += data.text;
              outputContent.innerHTML = renderMarkdown(fullText);
            }
          } catch {}
        }
      }
    }

    generatedContent[sc.id] = outputContent.innerHTML;
    updateScores();
  } catch (err) {
    outputContent.innerHTML = `<p style="color: var(--red-500);">⚠️ Failed to generate: ${err.message}</p>`;
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg> Generate SAR Narrative with AI`;
  }
});

// ── Score Content ─────────────────────────────────────────────
document.getElementById("scoreBtn").addEventListener("click", async () => {
  if (!activeSubCriterion) return;
  const sc = activeSubCriterion;
  const files = auditFiles[sc.id] || [];
  const generated = generatedContent[sc.id] || "";
  
  if (files.length === 0 && !generated && !userData[sc.id]) {
    alert("Please generate content or upload an existing draft before scoring.");
    return;
  }

  const btn = document.getElementById("scoreBtn");
  btn.disabled = true;
  btn.textContent = "⏳ Scoring...";

  const scoreSection = document.getElementById("scoreSection");
  const scoreOutput = document.getElementById("scoreOutput");
  scoreSection.style.display = "";
  scoreOutput.innerHTML = "Analyzing your content against NBA requirements...";

  let prompt = `You are an NBA GAPC V4.0 Lead Evaluator. Calculate the AI Readiness Score for the following SAR draft for sub-criterion ${sc.id}: "${sc.name}" (Maximum marks: ${sc.marks}).

Evaluate against these strict requirements:
- Required documents: ${sc.documents.join("; ")}
${sc.formula ? `- Scoring formula: ${sc.formula}` : ""}
${sc.tables && sc.tables.length > 0 ? `- Required tables: ${sc.tables.join("; ")}` : ""}

`;

  if (generated) {
    prompt += `Generated Content to evaluate:\n${generated}\n\n`;
  } else if (userData[sc.id]) {
    prompt += `User Text Input:\n${userData[sc.id]}\n\n`;
  }

  prompt += `Provide:
1. **Estimated AI Readiness Score: X/${sc.marks}** (be incredibly rigorous, strict, and justifiably accurate)
2. **Strengths** (2-3 specific points that are well covered with exact evidence from the text)
3. **Missing Items & Gaps** (specific documents or raw numerical data still needed)
4. **Actionable Recommendations** (3-5 explicit steps to improve the score to maximum)

Do NOT make vague generalized statements. Provide step-by-step reasoning based ONLY on the evidence in the draft. Output exactly in Markdown.`;

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: prompt, history: [] }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop();

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.text) {
              fullText += data.text;
              scoreOutput.innerHTML = renderMarkdown(fullText);
            }
          } catch {}
        }
      }
    }

    // Try to extract score from text
    const scoreMatch = fullText.match(/Estimated\s*Score[:\s]*(\d+)\s*[\/]/i);
    if (scoreMatch) {
      scores[sc.id] = parseInt(scoreMatch[1]);
      updateScores();
    }
  } catch (err) {
    scoreOutput.innerHTML = `<p style="color: var(--red-500);">⚠️ Scoring failed: ${err.message}</p>`;
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Score My Content`;
  }
});

// ── Build Generation Prompt ───────────────────────────────────
function buildGeneratePrompt(sc, userInput, files) {
  let prompt = `Generate a complete, NBA GAPC V4.0 compliant SAR narrative for:

**Sub-Criterion ${sc.id}: ${sc.name}**
Maximum Marks: ${sc.marks}

GAPC V4.0 Requirements for this section:
- Required documents: ${sc.documents.join("; ")}`;

  if (sc.tables && sc.tables.length > 0) {
    prompt += `\n- Required tables: ${sc.tables.join("; ")}`;
  }
  if (sc.formula) {
    prompt += `\n- Scoring formula: ${sc.formula}`;
  }
  if (sc.subItems && sc.subItems.length > 0) {
    prompt += `\n- Sub-items to cover:\n${sc.subItems.map((si) => `  • ${si.id}: ${si.name} (${si.marks} marks)`).join("\n")}`;
  }
  if (sc.imagePlaceholders && sc.imagePlaceholders.length > 0) {
    prompt += `\n- Images that should be referenced: ${sc.imagePlaceholders.join("; ")}`;
  }

  prompt += `\n\nUser's institutional data:\n${userInput || "[No data provided yet — generate a template with placeholder fields marked as [__INSERT DATA__]]"}`;

  prompt += `\n\nIMPORTANT INSTRUCTIONS:
1. Generate formal SAR narrative text with proper sub-criterion headings (e.g., "${sc.id}")
2. Include ALL required tables as markdown tables with sample structure — mark empty cells as [__DATA__]
3. For each image placeholder, include a line: **[INSERT IMAGE: description]**
4. Calculate scores using the provided formulas if data is available
5. Include a gap analysis section at the end
6. Use formal academic language appropriate for NBA audit
7. Structure output to match GAPC V4.0 SAR format exactly
8. Be comprehensive — cover EVERY requirement listed above`;

  return prompt;
}

// ── Update Total Scores ───────────────────────────────────────
function updateScores() {
  let total = 0;
  for (const key in scores) {
    total += scores[key] || 0;
  }

  totalScoreEl.textContent = total;
  const percent = Math.round((total / TOTAL_MARKS) * 100);
  scorePercentEl.textContent = `${percent}%`;

  // Update ring
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (percent / 100) * circumference;
  scoreRingEl.style.strokeDashoffset = offset;

  // Update nav scores
  for (const criterion of CRITERIA_DATA) {
    let criterionTotal = 0;
    let hasAnyScore = false;
    for (const sc of criterion.subCriteria) {
      if (scores[sc.id] !== undefined) {
        criterionTotal += scores[sc.id];
        hasAnyScore = true;
      }
    }
    const navScore = document.getElementById(`navScore-${criterion.id}`);
    if (navScore && hasAnyScore) {
      navScore.style.display = "inline";
      navScore.textContent = `${criterionTotal}/${criterion.marks}`;
    }
  }
}

// ── Back to Grid ──────────────────────────────────────────────
document.getElementById("backToGrid").addEventListener("click", () => {
  if (activeCriterion) selectCriterion(activeCriterion.id);
});

// ── Copy Output ───────────────────────────────────────────────
document.getElementById("copyOutputBtn").addEventListener("click", () => {
  const content = document.getElementById("outputContent").innerText;
  navigator.clipboard.writeText(content);
  const btn = document.getElementById("copyOutputBtn");
  btn.innerHTML = "✅";
  setTimeout(() => {
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`;
  }, 2000);
});

// ── Cover Config Logic ──────────────────────────────────────────
let coverLogoDataUrl = null;
const coverLogoInput = document.getElementById("coverLogoInput");
const coverLogoPreview = document.getElementById("coverLogoPreview");

coverLogoPreview.addEventListener("click", () => coverLogoInput.click());

coverLogoInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    coverLogoDataUrl = event.target.result;
    coverLogoPreview.innerHTML = `<img src="${coverLogoDataUrl}" style="max-width: 100%; max-height: 100%; object-fit: contain;" />`;
  };
  reader.readAsDataURL(file);
});

// ── Export PDF ─────────────────────────────────────────────────
document.getElementById("exportPdfBtn").addEventListener("click", () => {
  // Check if html2pdf is available
  if (typeof html2pdf === "undefined") {
    alert("PDF library is loading. Please try again in a few seconds.");
    return;
  }

  const btn = document.getElementById("exportPdfBtn");
  btn.disabled = true;
  btn.textContent = "⏳ Generating PDF...";

  // Build a temporary container for the PDF
  const pdfContainer = document.createElement("div");
  // Set explicit width to prevent html2canvas unconstrained layout glitches
  pdfContainer.style.width = "800px";
  pdfContainer.style.margin = "0 auto";
  pdfContainer.style.padding = "40px";
  pdfContainer.style.fontFamily = "'Times New Roman', Times, serif"; // Academic style
  pdfContainer.style.color = "#000";
  pdfContainer.style.textAlign = "justify";
  pdfContainer.style.lineHeight = "1.5";
  pdfContainer.style.boxSizing = "border-box";
  
  pdfContainer.innerHTML = `
    <style>
      * { box-sizing: border-box; }
      pre, code { white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word; max-width: 100%; border-radius: 4px; }
      pre { background: #f4f4f4; padding: 10px; }
      table { border-collapse: collapse; width: 100%; max-width: 800px; margin-bottom: 24px; page-break-inside: auto; font-size: 13px; table-layout: auto; word-wrap: break-word; }
      tr { page-break-inside: avoid; page-break-after: auto; }
      th, td { border: 1px solid #000; padding: 8px; text-align: left; vertical-align: top; word-break: break-word; }
      th { background-color: #f8f9fa; font-weight: bold; }
      h1, h2, h3, h4, h5, h6 { page-break-after: avoid; }
      .image-placeholder-pdf { height: 250px; border: 1.5px dashed #aaa; width: 100%; max-width: 600px; margin: 30px auto; display: flex; align-items: center; justify-content: center; color: #999; font-family: sans-serif; font-size: 14px; page-break-inside: avoid; }
      .fig-caption { text-align: center; font-size: 14px; font-style: italic; margin-bottom: 30px; color: #000; page-break-inside: avoid; }
    </style>
  `;

  // 1. Cover Page
  const instName = document.getElementById("coverInstitutionName")?.value || "Your Institution";
  const repTitle = document.getElementById("coverReportTitle")?.value || "Self-Assessment Report (SAR) - GAPC V4.0";
  
  const coverPage = document.createElement("div");
  // Explicitly assign 800px width matching windowWidth options
  coverPage.style.width = "800px";
  coverPage.style.height = "297mm"; // A4 height approx
  coverPage.style.display = "flex";
  coverPage.style.flexDirection = "column";
  coverPage.style.alignItems = "center";
  coverPage.style.justifyContent = "center";
  coverPage.style.textAlign = "center";
  coverPage.style.pageBreakAfter = "always";
  coverPage.style.position = "relative";

  if (coverLogoDataUrl) {
    coverPage.innerHTML += `<img src="${coverLogoDataUrl}" style="max-width: 300px; max-height: 250px; margin-bottom: 40px;" />`;
  }
  
  coverPage.innerHTML += `
    <h1 style="font-size: 36px; font-weight: 800; color: #000; margin-bottom: 16px;">${repTitle}</h1>
    <h2 style="font-size: 24px; font-weight: 600; color: #333; margin-bottom: 40px;">${instName}</h2>
    <div style="font-size: 16px; color: #666; margin-top: 60px;">Generated via AccreditIQ AI</div>
    <div style="font-size: 14px; color: #999;">${new Date().toLocaleDateString()}</div>
    <div style="position: absolute; bottom: 40px; font-size: 14px; font-weight: bold; color: #4F46E5;">Made in AccreditIQ</div>
  `;
  pdfContainer.appendChild(coverPage);

  // 2. Iterate through criteria and generated content
  let hasContent = false;
  
  for (const criterion of CRITERIA_DATA) {
    let criterionAdded = false;
    
    for (const sc of criterion.subCriteria) {
      if (generatedContent[sc.id]) {
        hasContent = true;
        
        // Add criterion header if first time
        if (!criterionAdded) {
          const critHeader = document.createElement("div");
          critHeader.innerHTML = `<h1 style="font-size: 28px; color: #000; border-bottom: 2px solid #000; padding-bottom: 10px; margin-top: 40px; margin-bottom: 20px;">${criterion.id}: ${criterion.name}</h1>`;
          pdfContainer.appendChild(critHeader);
          criterionAdded = true;
        }

        const section = document.createElement("div");
        section.style.marginBottom = "40px";
        
        // Add Score summary box
        let scoreHtml = "";
        if (scores[sc.id] !== undefined) {
          scoreHtml = `<div style="float: right; font-weight: bold; font-family: sans-serif; background: #EEF2FF; color: #4F46E5; padding: 6px 12px; border-radius: 6px; font-size: 14px; margin-left: 15px; margin-bottom: 10px;">Score: ${scores[sc.id]}/${sc.marks}</div>`;
        }
        
        section.innerHTML = `
          ${scoreHtml}
          ` + generatedContent[sc.id];

        // Format Image Placeholders properly
        let imageCounter = 0;
        const subCriterionImages = (attachedFiles[sc.id] || []).filter(f => f.type.startsWith('image/'));
        
        section.innerHTML = section.innerHTML.replace(/\[INSERT IMAGE: (.*?)\]/gi, (match, description) => {
          if (imageCounter < subCriterionImages.length && subCriterionImages[imageCounter].url) {
            const imgUrl = subCriterionImages[imageCounter].url;
            imageCounter++;
            return `<div style="text-align: center; margin: 30px 0;"><img src="${imgUrl}" style="max-width: 100%; max-height: 400px; border: 1px solid #ddd; padding: 5px; border-radius: 4px;" crossorigin="anonymous"/></div><div class="fig-caption">Fig: ${description}</div>`;
          } else {
            return `<div class="image-placeholder-pdf">[Paste Image Here]</div><div class="fig-caption">Fig: ${description}</div>`;
          }
        });

        pdfContainer.appendChild(section);
      }
    }
  }

  if (!hasContent) {
    alert("No content to export. Form a narrative for at least one sub-criterion first.");
    btn.disabled = false;
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Export PDF Report`;
    return;
  }

  // Add a final footer to the whole document
  const finalFooter = document.createElement("div");
  finalFooter.style.marginTop = "60px";
  finalFooter.style.textAlign = "center";
  finalFooter.style.borderTop = "1px solid #ccc";
  finalFooter.style.paddingTop = "20px";
  finalFooter.innerHTML = `<span style="font-weight: bold; font-family: sans-serif; color: #4F46E5; font-size: 14px;">Made in AccreditIQ</span>`;
  pdfContainer.appendChild(finalFooter);

  const opt = {
    margin:       [15, 15, 15, 15],
    filename:     'AccreditIQ_SAR_Report.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    pagebreak:    { mode: ['css', 'legacy'] },
    html2canvas:  { scale: 2, useCORS: true, letterRendering: true, backgroundColor: "#ffffff" },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true }
  };

  html2pdf().set(opt).from(pdfContainer).save().then(() => {
    btn.disabled = false;
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Export PDF Report`;
  }).catch(err => {
    console.error(err);
    alert("Error generating PDF.");
    btn.disabled = false;
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Export PDF Report`;
  });
});

// ── Export Audit PDF ──────────────────────────────────────────
document.getElementById("downloadAuditBtn").addEventListener("click", () => {
  if (typeof html2pdf === "undefined") {
    alert("PDF library is loading. Please try again in a few seconds.");
    return;
  }

  if (!activeSubCriterion) return;
  const scoreOutput = document.getElementById("scoreOutput");
  if (!scoreOutput.innerHTML || scoreOutput.innerHTML.includes("Analyzing")) {
    alert("No audit report ready to download.");
    return;
  }

  const btn = document.getElementById("downloadAuditBtn");
  btn.disabled = true;
  btn.innerHTML = "⏳ Generating Audit PDF...";

  const pdfContainer = document.createElement("div");
  pdfContainer.style.padding = "40px";
  pdfContainer.style.fontFamily = "'Inter', sans-serif";
  pdfContainer.style.color = "#0f172a";

  const instName = document.getElementById("coverInstitutionName")?.value || "Your Institution";
  const repTitle = document.getElementById("coverReportTitle")?.value || "SAR Audit Report";
  
  const coverPage = document.createElement("div");
  coverPage.style.height = "297mm"; 
  coverPage.style.display = "flex";
  coverPage.style.flexDirection = "column";
  coverPage.style.alignItems = "center";
  coverPage.style.justifyContent = "center";
  coverPage.style.textAlign = "center";
  coverPage.style.pageBreakAfter = "always";

  if (coverLogoDataUrl) {
    coverPage.innerHTML += `<img src="${coverLogoDataUrl}" style="max-width: 300px; max-height: 250px; margin-bottom: 40px;" />`;
  }
  
  coverPage.innerHTML += `
    <h1 style="font-size: 36px; font-weight: 800; color: #10B981; margin-bottom: 16px;">${repTitle}</h1>
    <h1 style="font-size: 24px; font-weight: 600; color: #4F46E5; margin-bottom: 16px;">NBA GAPC V4.0 AI Readiness Report</h1>
    <h2 style="font-size: 20px; font-weight: 500; color: #333; margin-bottom: 40px;">Criterion Evaluated: Option ${activeSubCriterion.id}</h2>
    <h3 style="font-size: 18px; font-weight: 400; color: #555; margin-bottom: 40px;">${instName}</h3>
    <div style="font-size: 16px; color: #666; margin-top: 60px;">Audited via AccreditIQ AI</div>
    <div style="font-size: 14px; color: #999;">${new Date().toLocaleDateString()}</div>
  `;
  pdfContainer.appendChild(coverPage);

  const reportBody = document.createElement("div");
  reportBody.innerHTML = `<h2 style="color: #4F46E5; border-bottom: 2px solid #ccc; padding-bottom: 10px; margin-bottom: 20px;">AI Readiness Findings for ${activeSubCriterion.id}</h2>`;
  reportBody.innerHTML += scoreOutput.innerHTML;
  pdfContainer.appendChild(reportBody);

  const opt = {
    margin:       [20, 15, 20, 15],
    filename:     `Audit_Report_${activeSubCriterion.id}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(pdfContainer).save().then(() => {
    btn.disabled = false;
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download Readiness Report PDF`;
  }).catch(err => {
    console.error(err);
    alert("Error generating Readiness PDF.");
    btn.disabled = false;
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download Readiness Report PDF`;
  });
});

// ── Markdown Renderer ─────────────────────────────────────────
function renderMarkdown(text) {
  if (!text) return "";
  
  // Mistral sometimes wraps the ENTIRE response in a ```markdown ... ``` block.
  // Strip that out so marked.js processes the contents properly rather than as raw code.
  let cleanText = text.trim();
  if (cleanText.startsWith('```')) {
    const lines = cleanText.split('\\n');
    if (lines.length > 0 && lines[0].startsWith('```')) {
      lines.shift(); // Remove first line
      if (lines.length > 0 && lines[lines.length - 1] === '```') {
        lines.pop(); // Remove last line if it's the closing markdown block
      }
      cleanText = lines.join('\\n');
    }
  }

  if (typeof marked !== "undefined") {
    return marked.parse(cleanText);
  }
  return "<p>" + cleanText.replace(/\\n/g, "<br>") + "</p>";
}

// ── Init ──────────────────────────────────────────────────────
buildNav();
