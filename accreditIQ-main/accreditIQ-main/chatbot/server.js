import "dotenv/config";
import express from "express";
import cors from "cors";
import { Mistral } from "@mistralai/mistralai";
import { createClient } from "@supabase/supabase-js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import multer from "multer";
import fs from "fs";
import path from "path";
import mammoth from "mammoth";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ── Init Express ──────────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.static(join(__dirname, "public")));

// ── File Upload Setup (multer) ────────────────────────────────
const uploadsDir = join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // increased to 50MB
  fileFilter: (req, file, cb) => cb(null, true),
});

// ── Init Mistral Client ──────────────────────────────────────
const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

// ── Init Supabase Client ──────────────────────────────────────
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// ============================================================
// ── RAG: In-Memory Knowledge Base from .md Files ──────────────
// ============================================================
// ============================================================
// Supabase Vector Search (RAG)
// ============================================================

async function searchKnowledge(query, topN = 5) {
  try {
    // 1. Get embedding for the query
    const embeddingsResponse = await mistral.embeddings.create({
      model: "mistral-embed",
      inputs: [query]
    });
    
    const queryEmbedding = embeddingsResponse.data[0].embedding;

    // 2. Query Supabase for matching chunks
    const { data, error } = await supabase.rpc("match_chunks", {
      query_embedding: queryEmbedding,
      match_threshold: 0.65,
      match_count: topN
    });

    if (error) {
      console.error("Supabase RPC error:", error);
      return [];
    }

    if (!data || data.length === 0) return [];

    return data.map((chunk) => ({
      source: chunk.source_name,
      chunkText: chunk.chunk_text,
      score: chunk.similarity * 100
    }));
  } catch (error) {
    console.error("Error in vector search:", error);
    return [];
  }
}

// ── System Prompt ─────────────────────────────────────────────
const SYSTEM_PROMPT = `You are AccreditIQ — an expert NBA accreditation consultant AI assistant with deep knowledge of GAPC V4.0 for Tier II UG Engineering programs.

CRITICAL INSTRUCTION: You have access to the actual NBA GAPC V4.0 documents, SAR format templates, checklists, and reference reports loaded as your knowledge base. When answering ANY question:
1. ALWAYS refer to the knowledge base context provided below the user's question.
2. Cite the exact source document name when referencing information.
3. JUSTIFY your answers rigorously. Do NOT make vague, generalized statements. Provide step-by-step reasoning grounded ONLY in the specific texts provided.
4. Use specific sub-criteria codes (e.g., C1.1, C4.2) and reference specific table numbers (e.g., Table No. 1.2.1.1) when discussing SAR format.
5. Provide precise marks/weightage from the official criteria structure.

Your responsibilities:
- Answer questions about NBA accreditation, GAPC V4.0 criteria, and SAR preparation with highly specific, source-backed information.
- Analyze uploaded institutional data against GAPC V4.0 requirements to identify exact gaps.
- Use formal academic language and precise NBA terminology.
- Never hallucinate data. If the knowledge base or uploads don't cover something, explicitly state that it is unknown based on available data.
- Format responses in clean markdown with headings, bullet points, bold text, and blockquotes for direct excerpts.

When knowledge base context is provided, ALWAYS ground your answer in that context and cite [Source: filename].`;

// ── Read File Content ─────────────────────────────────────────
async function readUploadedFile(filePath, mimetype, originalname) {
  try {
    if (
      mimetype.startsWith("text/") ||
      mimetype === "application/json" ||
      originalname.endsWith(".md") ||
      originalname.endsWith(".txt") ||
      originalname.endsWith(".csv") ||
      originalname.endsWith(".json")
    ) {
      return fs.readFileSync(filePath, "utf-8");
    }

    if (mimetype === "application/pdf" || originalname.endsWith(".pdf")) {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    }

    if (
      mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      originalname.endsWith(".docx")
    ) {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value || "[Empty Word Document]";
    }

    const stats = fs.statSync(filePath);
    return `[Binary file uploaded: ${originalname}, type: ${mimetype}, size: ${(stats.size / 1024).toFixed(1)} KB. Format not text-extractable.]`;
  } catch (err) {
    return `[Error reading file: ${err.message}]`;
  }
}

// ── Chat Endpoint (Streaming via SSE) ─────────────────────────
app.post("/api/chat", async (req, res) => {
  const { message, history = [], fileContents = [] } = req.body;

  if (!message && fileContents.length === 0) {
    return res.status(400).json({ error: "Message or file is required" });
  }

  // Set SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  try {
    // 1. Search local knowledge base for relevant context
    let ragContext = "";
    let sourceMeta = [];
    if (message) {
      const relevantChunks = await searchKnowledge(message, 5);
      if (relevantChunks && relevantChunks.length > 0) {
        sourceMeta = relevantChunks.map((c) => c.source);
        ragContext =
          "\n\n---\n📚 **KNOWLEDGE BASE CONTEXT (from loaded reference documents):**\n" +
          relevantChunks
            .map(
              (c, i) =>
                `\n[Source ${i + 1}: ${c.source}] (relevance: ${c.score.toFixed(1)})\n${c.chunkText}`
            )
            .join("\n\n---\n");
      }
    }

    // 2. Build file context from user uploads
    let fileContext = "";
    if (fileContents.length > 0) {
      fileContext =
        "\n\n---\n📎 **USER UPLOADED FILE(S):**\n" +
        fileContents
          .map(
            (f) =>
              `**File: ${f.name}** (${f.type})\n\`\`\`\n${f.content}\n\`\`\``
          )
          .join("\n\n");
    }

    // 3. Build messages for Mistral
    const userContent =
      (message || "Analyze the uploaded file(s) against NBA GAPC V4.0 requirements.") +
      fileContext +
      ragContext;

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      })),
      { role: "user", content: userContent },
    ];

    // 4. Stream response from Mistral
    const stream = await mistral.chat.stream({
      model: "mistral-small-latest",
      messages: messages,
      maxTokens: 4000,
      temperature: 0.3,
    });

    let fullOutput = "";

    for await (const event of stream) {
      const content = event.data?.choices?.[0]?.delta?.content;
      if (content) {
        fullOutput += content;
        res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
      }
    }

    if (sourceMeta.length > 0) {
      const dedupedSources = [...new Set(sourceMeta)];
      res.write(`data: ${JSON.stringify({ sources: dedupedSources })}\n\n`);
    }

    // Store in Supabase
    try {
      if (message) {
        await supabase.from('chat_history').insert([
          { role: 'user', content: message, model_used: 'mistral-small-latest' },
          { role: 'assistant', content: fullOutput, model_used: 'mistral-small-latest' }
        ]);
      }
    } catch(err) {
      console.error("Failed to save history", err);
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    console.error("Chat error:", err);
    res.write(
      `data: ${JSON.stringify({ error: err.message || "AI request failed" })}\n\n`
    );
    res.end();
  }
});

// ── File Upload Endpoint ──────────────────────────────────────
app.post("/api/upload", upload.array("files", 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const scId = req.body.scId || "General";

    const results = await Promise.all(req.files.map(async (file) => {
      // 1. Read locally to extract text content for AI Context
      const content = await readUploadedFile(file.path, file.mimetype, file.originalname);
      
      // 2. Upload to Supabase Storage
      const fileBuffer = fs.readFileSync(file.path);
      const storagePath = `${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('criteria_uploads')
        .upload(storagePath, fileBuffer, {
          contentType: file.mimetype,
          upsert: false
        });
        
      let publicUrl = null;
      if (!uploadError && uploadData) {
        const { data: publicData } = supabase.storage.from('criteria_uploads').getPublicUrl(storagePath);
        publicUrl = publicData.publicUrl;
        
        // 3. Insert metadata to file_uploads table
        await supabase.from('file_uploads').insert([{
          file_name: file.originalname,
          file_size: file.size,
          content_type: file.mimetype,
          bucket_id: 'criteria_uploads',
          file_path: storagePath,
          associated_criterion: scId
        }]);
      } else {
        console.error("Supabase Storage Error:", uploadError);
      }

      return {
        name: file.originalname,
        type: file.mimetype,
        size: file.size,
        content: content.substring(0, 50000), // AI context
        url: publicUrl // Database permanent URL
      };
    }));

    res.json({ success: true, files: results });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ── Knowledge Base Info ───────────────────────────────────────
app.get("/api/knowledge", async (req, res) => {
  try {
    const { count, error } = await supabase
      .from("knowledge_chunks")
      .select("*", { count: "exact", head: true });
    
    if (error) throw error;
    res.json({ totalChunks: count, sources: { "supabase_rag": count } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Health Check ──────────────────────────────────────────────
app.get("/api/health", async (req, res) => {
  try {
    const { count } = await supabase
      .from("knowledge_chunks")
      .select("*", { count: "exact", head: true });

    res.json({
      server: true,
      mistral: !!process.env.MISTRAL_API_KEY,
      supabase: !!process.env.SUPABASE_URL,
      knowledgeBase: {
        loaded: count > 0,
        totalChunks: count,
      },
    });
  } catch(err) {
    res.json({ error: err.message });
  }
});

// ── Serve Frontend ────────────────────────────────────────────
app.get("/generator", (req, res) => {
  res.sendFile(join(__dirname, "public", "generator.html"));
});

app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "public", "index.html"));
});

// ── Start Server ──────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 AccreditIQ Chatbot running at http://localhost:${PORT}`);
  console.log(`   Mistral API:     ${process.env.MISTRAL_API_KEY ? "✅ Configured" : "❌ Missing"}`);
  console.log(`   Supabase:        ${process.env.SUPABASE_URL ? "✅ Configured" : "❌ Missing"}`);
  console.log(`   Knowledge Base:  ✅ Using Supabase vector store\n`);
});
