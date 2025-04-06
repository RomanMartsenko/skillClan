import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import config from './config.js';

const { Pool } = pg;

const app = express();
const port = config.server.port;

// __dirname в ES модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Підключення до PostgreSQL через DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

app.post('/api/form', async (req, res) => {
  const { discord_id, name, role, feedback } = req.body;

  try {
    const existing = await pool.query('SELECT * FROM users WHERE discord_id = $1', [discord_id]);

    if (existing.rows.length > 0) {
      const updates = [];
      if (name !== existing.rows[0].name) updates.push(['name', name]);
      if (role !== existing.rows[0].role) updates.push(['role', role]);
      if (feedback !== existing.rows[0].feedback) updates.push(['feedback', feedback]);

      for (const [field, value] of updates) {
        await pool.query(`UPDATE users SET ${field} = $1, updated_at = now() WHERE discord_id = $2`, [value, discord_id]);
      }

      return res.send('Оновлено');
    }

    await pool.query(
      'INSERT INTO users (discord_id, name, role, feedback) VALUES ($1, $2, $3, $4)',
      [discord_id, name, role, feedback]
    );
    res.send('Створено');
  } catch (err) {
    console.error('❌ SQL помилка:', err);
    res.status(500).send('Помилка сервера');
  }
});

// Таблиця
pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    discord_id TEXT PRIMARY KEY,
    name TEXT,
    role TEXT,
    feedback TEXT,
    updated_at TIMESTAMP DEFAULT now()
  );
`, (err) => {
  if (err) console.error('❌ SQL помилка при створенні таблиці:', err);
  else console.log('✅ Таблиця створена або вже існує');
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер працює на http://localhost:${port}`);
});