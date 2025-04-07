const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /submit
router.post('/submit', async (req, res) => {
  const {
    name, birth_date, phone, email,
    start_date, offer_date, mentor, status
  } = req.body;

  try {
    await pool.query(
      `INSERT INTO form
       (name, birth_date, phone, email, start_date, offer_date, mentor, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [name, birth_date, phone, email, start_date, offer_date, mentor, status]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('DB insert error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /form
router.get('/form', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM form ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('DB fetch error:', err);
    res.status(500).json({ error: 'Помилка при отриманні даних' });
  }
});

module.exports = router;