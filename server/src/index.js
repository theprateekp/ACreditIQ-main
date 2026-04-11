require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Uploads dir ───────────────────────────────────────────────
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const upload = multer({
  dest: uploadsDir,
  limits: { fileSize: 50 * 1024 * 1024 },
});

// ── Middleware ────────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));

// ── Routes ────────────────────────────────────────────────────
app.use('/dashboard', require('./routes/dashboard'));

const { chatHandler, uploadHandler, healthHandler } = require('./routes/ai');
const { exportPdfHandler } = require('./routes/pdf');
app.post('/api/chat',   chatHandler);
app.post('/api/upload', upload.array('files', 10), uploadHandler);
app.get('/api/health',  healthHandler);
app.post('/api/export-pdf', express.json({ limit: '50mb' }), exportPdfHandler);

// ── Health check ──────────────────────────────────────────────
app.get('/health', (req, res) => res.json({
  status: 'ok',
  service: 'AccreditIQ API',
  version: '1.0.0',
  mistral: !!process.env.MISTRAL_API_KEY,
  supabase: !!process.env.SUPABASE_URL,
}));

// ── 404 ───────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ success: false, error: 'Route not found' }));

// ── Error handler ─────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 AccreditIQ API running at http://localhost:${PORT}`);
  console.log(`   Mistral AI:  ${process.env.MISTRAL_API_KEY ? '✅ Configured' : '❌ Missing MISTRAL_API_KEY'}`);
  console.log(`   Supabase:    ${process.env.SUPABASE_URL    ? '✅ Configured' : '❌ Missing SUPABASE_URL'}`);
  console.log(`   AI Chat:     POST http://localhost:${PORT}/api/chat`);
  console.log(`   File Upload: POST http://localhost:${PORT}/api/upload`);
  console.log(`   Health:      GET  http://localhost:${PORT}/api/health\n`);
});
