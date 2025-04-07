const express = require('express');
const path = require('path');
const pool = require('./db');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Health-check
app.get('/', (req, res) => {
  res.send('API is alive');
});

// Збереження форми
app.post('/submit', async (req, res) => {
  const {
    name,
    birth_date,
    phone,
    email,
    start_date,
    offer_date,
    mentor,
    status
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

// Отримати всі записи
app.get('/form', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM form ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('DB fetch error:', err);
    res.status(500).json({ error: 'Помилка при отриманні даних' });
  }
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});