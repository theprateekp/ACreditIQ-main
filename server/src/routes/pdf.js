'use strict';
const path       = require('path');
const fs         = require('fs');
const handlebars = require('handlebars');
const puppeteer  = require('puppeteer');

// ── Compile template once ────────────────────────────────────
const tplPath = path.join(__dirname, '../templates/sar-report.hbs');
const tplSrc  = fs.readFileSync(tplPath, 'utf-8');
const template = handlebars.compile(tplSrc);

// ── Read logo and convert to base64 ─────────────────────────
let logoBase64 = '';
try {
  const logoPath = path.join(__dirname, '../../../public/logo.jpeg');
  if (fs.existsSync(logoPath)) {
    logoBase64 = fs.readFileSync(logoPath).toString('base64');
  }
} catch {}

// ── Simple markdown → HTML for generated content ────────────
function mdToHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/\[__INSERT DATA__\]/g, '<span class="placeholder-field">[__INSERT DATA__]</span>')
    .replace(/\[__DATA__\]/g, '<span class="placeholder-field">[__INSERT DATA__]</span>')
    // Convert markdown tables to HTML tables
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}

// ── POST /api/export-pdf ─────────────────────────────────────
async function exportPdfHandler(req, res) {
  try {
    const {
      generated   = {},   // { "C1.1": "markdown...", ... }
      scores      = {},   // { "C1.1": 35, ... }
      userData    = {},   // { "C1.1": "raw text", ... }
      criteria    = [],   // [{ id, name, marks, subCriteria: [...] }]
    } = req.body;

    // Build criteria content for template
    const criteriaContent = (criteria || []).map((c, idx) => ({
      criterionId: c.id,
      criterionNum: c.id.replace('C', ''),
      criterionName: c.name,
      marks: c.marks,
      subCriteria: (c.subCriteria || []).map(sc => ({
        id: sc.id.replace('C', ''),
        name: sc.name,
        marks: sc.marks,
        content: mdToHtml(generated[sc.id] || userData[sc.id] || ''),
        score: scores[sc.id],
      })),
    }));

    const data = {
      institutionName: "TSSM'S BSCOER",
      institutionAddress: 'Narhe, Pune, Maharashtra',
      programName: 'BE (Electrical Engineering)',
      academicYear: '2025-26',
      principal: 'Dr. G.A. Hinge',
      nbaCoordinator: 'Hasarmuni Sir',
      hodElectrical: 'Kanade Sir',
      hodENTC: 'Shinde Sir',
      establishmentYear: '2010',
      affiliatingUniversity: 'Savitribai Phule Pune University (SPPU)',
      submissionDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
      logoBase64,
      criteriaContent,
      programs: [],
    };

    const html = template(data);

    // Launch Puppeteer and generate PDF
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '15mm', bottom: '20mm', left: '15mm', right: '15mm' },
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: '<div style="width:100%;text-align:center;font-size:9px;color:#888;"><span class="pageNumber"></span></div>',
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="SAR_Report_TSSM_BSCOER.pdf"');
    res.setHeader('Content-Length', pdfBuffer.length);
    res.end(pdfBuffer);
  } catch (err) {
    console.error('PDF export error:', err);
    res.status(500).json({ error: 'PDF generation failed: ' + err.message });
  }
}

module.exports = { exportPdfHandler };
