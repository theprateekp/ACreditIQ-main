import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import { Mistral } from "@mistralai/mistralai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY; 
const mistralApiKey = process.env.MISTRAL_API_KEY;

if (!supabaseUrl || !supabaseKey || !mistralApiKey) {
  console.error("Missing SUPABASE_URL, SUPABASE_ANON_KEY, or MISTRAL_API_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const mistral = new Mistral({ apiKey: mistralApiKey });

// Simple text chunker
function chunkText(text, maxChars = 2000) {
  const chunks = [];
  let currentChunk = "";
  const paragraphs = text.split("\n\n");

  for (const p of paragraphs) {
    if (currentChunk.length + p.length > maxChars && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = "";
    }
    currentChunk += p + "\n\n";
  }
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  return chunks;
}

async function ingestFiles() {
  console.log("Starting RAG ingestion to Supabase...");
  
  try {
    const files = fs.readdirSync(projectRoot).filter((f) => f.endsWith(".md"));
    console.log(`Found ${files.length} markdown files to process.`);

    for (const file of files) {
      console.log(`Processing ${file}...`);
      const filePath = path.join(projectRoot, file);
      const content = fs.readFileSync(filePath, "utf-8");
      
      const chunks = chunkText(content);
      console.log(`  Split into ${chunks.length} chunks. Generating embeddings...`);

      for (let i = 0; i < chunks.length; i++) {
        const chunkStr = chunks[i];
        
        // Generate embedding
        const embeddingsResponse = await mistral.embeddings.create({
          model: "mistral-embed",
          inputs: [chunkStr]
        });
        
        const embedding = embeddingsResponse.data[0].embedding;

        // Insert into Supabase
        const { error } = await supabase
          .from("knowledge_chunks")
          .insert({
            source_type: "gapc_v4",
            source_name: file,
            chunk_text: chunkStr,
            embedding: embedding,
            metadata: { chunk_index: i }
          });

        if (error) {
          console.error(`  Error inserting chunk ${i}:`, error.message);
        }
      }
      console.log(`  ✅ Successfully ingested ${file}`);
    }
    
    console.log("🎉 RAG Ingestion complete!");
  } catch (err) {
    console.error("Error during ingestion:", err);
  }
}

ingestFiles();
