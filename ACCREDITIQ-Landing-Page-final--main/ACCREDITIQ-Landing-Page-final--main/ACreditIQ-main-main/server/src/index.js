require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

// Routes
app.use('/dashboard', require('./routes/dashboard'));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'AccreditIQ API', version: '1.0.0' }));

// 404
app.use((req, res) => res.status(404).json({ success: false, error: 'Route not found' }));

// Error handler
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`AccreditIQ API running on http://localhost:${PORT}`);
});
