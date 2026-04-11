'use strict';
const https = require('https');
const path  = require('path');
const fs    = require('fs');
const os    = require('os');

// ── Credentials — read from .env (dotenv loaded in index.js) ─
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || 'DSxy0LbakLsXDPPuEf6cS8JZJXk2eQ8F';
const SUPABASE_URL    = process.env.SUPABASE_URL    || 'https://gogcmcfcjzlwexzjiisn.supabase.co';
const SUPABASE_ANON   = process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvZ2NtY2Zjanpsd2V4emppaXNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NjM3NDksImV4cCI6MjA5MTIzOTc0OX0.oI2BQaGm01KINbID6vXqwjp1iefIW7lvO9zbpO_o2BY';

const SYSTEM_PROMPT = `You are a strict, expert National Board of Accreditation (NBA) Auditor and SAR Narrative Architect for GAPC V4.0 (Tier-II Undergraduate Engineering Programs).

Institution: TSSM'S BSCOER (Established 2010)
Principal: Dr. G.A. Hinge
NBA Coordinator: Hasarmuni Sir
Departments under accreditation: Electrical Engineering (HOD: Kanade Sir), Electronics & Telecommunication Engineering (HOD: Shinde Sir)

CRITERIA STRUCTURE (Total: 1000 marks):
Program Level Criteria:
  C1: Outcome-Based Curriculum (120 marks)
  C2: Outcome-Based Teaching Learning (120 marks)
  C3: Outcome-Based Assessment (120 marks)
  C4: Students' Performance (120 marks)
  C5: Faculty Information (100 marks)
  C6: Faculty Contributions (120 marks)
  C7: Facilities and Technical Support (100 marks)
  C8: Continuous Improvement (80 marks)
Institution Level Criteria:
  C9: Student Support and Governance (120 marks)

STRICT EXECUTION DIRECTIVES:
1. STRUCTURAL REPLICATION: Strictly follow the exact formatting, phrasing, table header configurations, and hierarchical layout from the official NBA SAR format (2-SAR-UG-EG-T2-6-2-2026_Format).
2. VERBATIM INSTRUCTIONS (THE BLUE TEXT): Every sub-criterion header must be followed by the official NBA instructional guidelines in parentheses, formatted in isolated markdown italics (e.g., *(Provide details of courses in terms of teaching and learning scheme...)*).
3. MANDATORY TABLES: Draw exact markdown tables with the official NBA column headers. NEVER alter official column names. Mark missing data cells with **[__INSERT DATA__]**.
4. IMAGE PLACEHOLDERS: Print exact placeholder tags like **[INSERT IMAGE: Description]** on a new line where graphics are needed.
5. ACADEMIC TONE: Maintain a highly professional, objective tone suitable for a global accreditation board. DO NOT use emojis in SAR narratives.
6. NO CONVERSATIONAL FILLER: DO NOT use phrases like "Here is your report," "I took reference from the file," or "According to the provided data." Output ONLY the pure SAR markup seamlessly.
7. GAP ANALYSIS: At the end, append a "Gap Analysis" block analyzing what the institution is missing to achieve the full designated marks.
8. TABLE NUMBERING: Use official NBA table numbering (e.g., Table No. 1.2.1.1, Table No. A6, Table No. A8.1).
9. SCORING FORMULAS: When a sub-criterion has a defined scoring formula, calculate and show the score with working.
10. SUB-ITEMS: Track all sub-items with their individual marks allocation.

When answering general questions (not SAR generation), use clean markdown with headings, bullet points, and bold text. Reference specific sub-criteria codes (e.g., C1.1, C4.2) and table numbers. Never hallucinate data. Be specific and accurate.
When analyzing uploaded documents, extract relevant data and map it precisely to GAPC V4.0 requirements.`;

// ── Helper: HTTPS POST ────────────────────────────────────────
function httpsPost(hostname, path, headers, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = https.request(
      { hostname, path, method: 'POST', headers: { ...headers, 'Content-Length': Buffer.byteLength(data) } },
      (res) => {
        let raw = '';
        res.on('data', c => raw += c);
        res.on('end', () => {
          try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
          catch { resolve({ status: res.statusCode, body: raw }); }
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// ── Helper: HTTPS POST streaming ─────────────────────────────
function httpsPostStream(hostname, pathStr, headers, body, onChunk, onEnd) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = https.request(
      { hostname, path: pathStr, method: 'POST', headers: { ...headers, 'Content-Length': Buffer.byteLength(data) } },
      (res) => {
        let buf = '';
        res.on('data', chunk => {
          buf += chunk.toString();
          const lines = buf.split('\n');
          buf = lines.pop();
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const raw = line.slice(6).trim();
              if (raw === '[DONE]') continue;
              try {
                const d = JSON.parse(raw);
                const text = d.choices?.[0]?.delta?.content;
                if (text) onChunk(text);
              } catch {}
            }
          }
        });
        res.on('end', () => { onEnd(); resolve(); });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// ── Vector search via Supabase RPC ───────────────────────────
async function searchKnowledge(query) {
  try {
    const embRes = await httpsPost(
      'api.mistral.ai',
      '/v1/embeddings',
      { 'Content-Type': 'application/json', 'Authorization': `Bearer ${MISTRAL_API_KEY}` },
      { model: 'mistral-embed', inputs: [query] }
    );
    const embedding = embRes.body?.data?.[0]?.embedding;
    if (!embedding) return [];

    const sbRes = await httpsPost(
      'gogcmcfcjzlwexzjiisn.supabase.co',
      '/rest/v1/rpc/match_chunks',
      {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON,
        'Authorization': `Bearer ${SUPABASE_ANON}`,
      },
      { query_embedding: embedding, match_threshold: 0.60, match_count: 5 }
    );
    if (!Array.isArray(sbRes.body)) return [];
    return sbRes.body.map(c => ({ source: c.source_name, chunkText: c.chunk_text, score: (c.similarity || 0) * 100 }));
  } catch (e) {
    console.error('RAG search error:', e.message);
    return [];
  }
}

// ── POST /api/chat ────────────────────────────────────────────
async function chatHandler(req, res) {
  const { message, history = [], fileContents = [] } = req.body;
  if (!message && !fileContents.length) {
    return res.status(400).json({ error: 'Message required' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders();

  try {
    // RAG context
    let ragContext = '';
    if (message) {
      const chunks = await searchKnowledge(message);
      if (chunks.length) {
        ragContext = '\n\n---\n📚 **KNOWLEDGE BASE CONTEXT (GAPC V4.0 Reference):**\n' +
          chunks.map((c, i) => `\n[Source ${i+1}: ${c.source}] (relevance: ${c.score.toFixed(1)}%)\n${c.chunkText}`).join('\n\n---\n');
      }
    }

    // File context
    let fileContext = '';
    if (fileContents.length) {
      fileContext = '\n\n---\n📎 **UPLOADED INSTITUTIONAL DOCUMENTS:**\n' +
        fileContents.map(f => `**File: ${f.name}** (${f.type})\n\`\`\`\n${f.content}\n\`\`\``).join('\n\n');
    }

    const userContent = (message || 'Analyze the uploaded files against NBA GAPC V4.0 requirements.') + fileContext + ragContext;

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-10).map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: userContent },
    ];

    await httpsPostStream(
      'api.mistral.ai',
      '/v1/chat/completions',
      {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`,
        'Accept': 'text/event-stream',
      },
      { model: 'mistral-small-latest', messages, max_tokens: 8000, temperature: 0.3, stream: true },
      (text) => { res.write(`data: ${JSON.stringify({ text })}\n\n`); },
      () => { res.write(`data: ${JSON.stringify({ done: true })}\n\n`); res.end(); }
    );
  } catch (err) {
    console.error('Chat error:', err.message);
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
}

// ── POST /api/upload ──────────────────────────────────────────
async function uploadHandler(req, res) {
  try {
    if (!req.files || !req.files.length) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    const results = req.files.map(file => {
      let content = '';
      try { content = fs.readFileSync(file.path, 'utf-8').substring(0, 50000); } catch {}
      return { name: file.originalname, type: file.mimetype, size: file.size, content };
    });
    res.json({ success: true, files: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ── GET /api/health ───────────────────────────────────────────
function healthHandler(req, res) {
  res.json({
    server: true,
    mistral: !!MISTRAL_API_KEY,
    supabase: !!SUPABASE_URL,
    knowledgeBase: 'Supabase pgvector RAG',
    version: '1.0.0',
  });
}

module.exports = { chatHandler, uploadHandler, healthHandler };
