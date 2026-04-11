const express = require('express');
const router = express.Router();
const svc = require('../services/dashboardService');

// GET /dashboard/summary
router.get('/summary', async (req, res) => {
  try {
    const cycleId = req.query.cycleId || 'mock';
    const data = await svc.getDashboardSummary(cycleId);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /dashboard/gaps
router.get('/gaps', async (req, res) => {
  try {
    const cycleId = req.query.cycleId || 'mock';
    const data = await svc.getGaps(cycleId);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /dashboard/tasks
router.get('/tasks', async (req, res) => {
  try {
    const { cycleId, userId } = req.query;
    const data = await svc.getTasks(cycleId || 'mock', userId);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /dashboard/activity
router.get('/activity', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || '20');
    const offset = parseInt(req.query.offset || '0');
    const data = await svc.getActivity(limit, offset);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /dashboard/ai-readiness
router.get('/ai-readiness', async (req, res) => {
  try {
    const cycleId = req.query.cycleId || 'mock';
    const data = await svc.getAIReadiness(cycleId);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
