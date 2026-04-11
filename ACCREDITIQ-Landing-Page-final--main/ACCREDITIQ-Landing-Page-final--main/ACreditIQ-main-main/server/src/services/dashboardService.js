/**
 * Dashboard Service — computes aggregated metrics from DB
 * Falls back to mock data when DB is unavailable (dev mode)
 */
const pool = require('../db/pool');

// ─── Overall readiness summary ────────────────────────────────────────────────
async function getDashboardSummary(cycleId) {
  try {
    const { rows } = await pool.query(`
      SELECT
        cr.criterion_id,
        cr.scored_marks,
        cr.completion_pct,
        cr.status,
        c.max_marks,
        c.title,
        COUNT(d.id) FILTER (WHERE d.validation_status = 'valid') AS evidence_count,
        COUNT(d.id) AS total_docs
      FROM criterion_responses cr
      JOIN criteria c ON c.id = cr.criterion_id
      LEFT JOIN documents d ON d.criterion_response_id = cr.id
      WHERE cr.sar_cycle_id = $1
      GROUP BY cr.criterion_id, cr.scored_marks, cr.completion_pct, cr.status, c.max_marks, c.title
      ORDER BY cr.criterion_id
    `, [cycleId]);

    const totalMarks = rows.reduce((s, r) => s + parseInt(r.max_marks), 0);
    const scoredMarks = rows.reduce((s, r) => s + parseInt(r.scored_marks), 0);
    const overallPct = totalMarks > 0 ? Math.round((scoredMarks / totalMarks) * 100) : 0;

    return {
      overall: overallPct,
      estimatedMarks: scoredMarks,
      totalMarks,
      criteria: rows,
    };
  } catch (err) {
    console.error('getDashboardSummary error:', err.message);
    return getMockSummary();
  }
}

// ─── Gaps ─────────────────────────────────────────────────────────────────────
async function getGaps(cycleId) {
  try {
    // In production: query a gaps table. For now return computed gaps.
    return getMockGaps();
  } catch (err) {
    return getMockGaps();
  }
}

// ─── Tasks ────────────────────────────────────────────────────────────────────
async function getTasks(cycleId, userId = null) {
  try {
    const params = [cycleId];
    let query = `
      SELECT t.*, u.name AS assignee_name, c.title AS criterion_title
      FROM tasks t
      LEFT JOIN users u ON u.id = t.assigned_to
      LEFT JOIN criteria c ON c.id = t.criterion_id
      WHERE t.sar_cycle_id = $1
    `;
    if (userId) { query += ' AND t.assigned_to = $2'; params.push(userId); }
    query += ' ORDER BY t.due_date ASC';

    const { rows } = await pool.query(query, params);
    return rows;
  } catch (err) {
    console.error('getTasks error:', err.message);
    return getMockTasks();
  }
}

// ─── Activity feed ────────────────────────────────────────────────────────────
async function getActivity(limit = 20, offset = 0) {
  try {
    const { rows } = await pool.query(`
      SELECT a.*, u.name AS actor_name, u.role AS actor_role
      FROM activities a
      LEFT JOIN users u ON u.id = a.actor_user_id
      ORDER BY a.created_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);
    return rows;
  } catch (err) {
    console.error('getActivity error:', err.message);
    return getMockActivity();
  }
}

// ─── AI readiness (simulated) ─────────────────────────────────────────────────
async function getAIReadiness(cycleId) {
  // Simulated AI scoring logic
  const summary = await getDashboardSummary(cycleId);
  const score = summary.overall;

  const riskLevel = score >= 80 ? 'Low' : score >= 60 ? 'Medium' : score >= 40 ? 'High' : 'Critical';

  const gaps = [
    score < 50 ? 'Overall readiness below 50% — critical intervention required' : null,
    'C9 not started — 0% completion',
    'C6 MoUs expired — 2 critical gaps',
    'C8 QA charter missing — 18 marks at risk',
  ].filter(Boolean);

  const suggestions = [
    'Initiate C9 evidence collection immediately',
    'Renew all industry MoUs within 7 days',
    'Escalate QA charter ratification to academic board',
    'Upload 6 pending faculty CVs for C3',
  ];

  return {
    score,
    riskLevel,
    strongestCriterion: 'C1 — Mission, Governance & Strategy (92%)',
    weakestCriterion: 'C9 — Ethical Standards & Compliance (0%)',
    gaps,
    suggestions,
  };
}

// ─── Mock fallbacks ───────────────────────────────────────────────────────────
function getMockSummary() {
  return {
    overall: 67,
    estimatedMarks: 588,
    totalMarks: 1000,
    criteria: [],
  };
}

function getMockGaps() {
  return [
    { id: 'g1', description: 'No documented research output policy', criterionId: 'C5', severity: 'Critical', marksImpact: 15, suggestedFix: 'Draft and ratify a research output policy', resolved: false },
    { id: 'g2', description: 'Industry advisory board minutes missing', criterionId: 'C6', severity: 'Critical', marksImpact: 12, suggestedFix: 'Retrieve minutes from email records', resolved: false },
    { id: 'g6', description: 'QA committee charter not ratified', criterionId: 'C8', severity: 'Critical', marksImpact: 18, suggestedFix: 'Schedule emergency board meeting', resolved: false },
  ];
}

function getMockTasks() {
  return [
    { id: 't1', title: 'Collect faculty CVs', assignee_name: 'Prof. James Okafor', due_date: new Date(Date.now() - 86400000 * 3), priority: 'High', status: 'Overdue', criterion_id: 'C3' },
    { id: 't2', title: 'Draft research output policy', assignee_name: 'Dr. Sarah Mitchell', due_date: new Date(Date.now() + 86400000 * 5), priority: 'High', status: 'In Progress', criterion_id: 'C5' },
  ];
}

function getMockActivity() {
  return [
    { id: 'ae1', actor_name: 'Dr. Sarah Mitchell', actor_role: 'NBA_Coordinator', action_type: 'EVIDENCE_UPLOADED', description: 'Uploaded governance charter v3.2 to C1', created_at: new Date(Date.now() - 60000 * 8) },
    { id: 'ae2', actor_name: 'Prof. James Okafor', actor_role: 'HOD', action_type: 'TASK_UPDATED', description: 'Updated task to In Progress', created_at: new Date(Date.now() - 60000 * 23) },
  ];
}

module.exports = { getDashboardSummary, getGaps, getTasks, getActivity, getAIReadiness };
