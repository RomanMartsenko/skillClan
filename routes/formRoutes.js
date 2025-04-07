const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /submit
router.post('/submit', async (req, res) => {
  const {
    role,
    email,
    name,
    birth_date,
    phone,
    start_date,
    offer_date,
    mentor,
    status
  } = req.body;

  try {
    if (role === 'mentor') {
      // Для менторів: лише роль + email
      await pool.query(
        `INSERT INTO form (role, email)
         VALUES ($1, $2)`,
        [role, email]
      );
    } else {
      // Для студентів: повні дані
      await pool.query(
        `INSERT INTO form 
         (role, name, birth_date, phone, email, start_date, offer_date, mentor, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [role, name, birth_date, phone, email, start_date, offer_date, mentor, status]
      );
    }

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