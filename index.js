require('dotenv').config(); // дозволяє читати .env
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); // парсить JSON

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
});

// Головний маршрут для прийому форми
app.post('/api/form', async (req, res) => {
  const { discord_id, name, role, feedback } = req.body;

  try {
    const existing = await pool.query('SELECT * FROM users WHERE discord_id = $1', [discord_id]);

    if (existing.rows.length > 0) {
      // Якщо користувач існує — оновлюємо лише змінені поля
      const updates = [];
      if (name !== existing.rows[0].name) updates.push(['name', name]);
      if (role !== existing.rows[0].role) updates.push(['role', role]);
      if (feedback !== existing.rows[0].feedback) updates.push(['feedback', feedback]);

      for (const [field, value] of updates) {
        await pool.query(`UPDATE users SET ${field} = $1, updated_at = now() WHERE discord_id = $2`, [value, discord_id]);
      }

      return res.send('Оновлено');
    }

    // Якщо користувач новий — створюємо
    await pool.query(
      'INSERT INTO users (discord_id, name, role, feedback) VALUES ($1, $2, $3, $4)',
      [discord_id, name, role, feedback]
    );
    res.send('Створено');
  } catch (err) {
    console.error(err);
    res.status(500).send('Помилка сервера');
  }
});

app.listen(port, () => {
  console.log(`Сервер працює на http://localhost:${port}`);
});
// тільки тимчасово, для створення таблиці
pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      discord_id TEXT PRIMARY KEY,
      name TEXT,
      role TEXT,
      feedback TEXT,
      updated_at TIMESTAMP DEFAULT now()
    );
  `, (err, res) => {
    if (err) console.error('❌ SQL помилка:', err);
    else console.log('✅ Таблиця створена або вже існує');
  });
  