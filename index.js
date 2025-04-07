// index.js
const express = require('express');
const pool = require('./db');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.post('/submit', async (req, res) => {
  const { id, name } = req.body;

  try {
    await pool.query(
      'INSERT INTO form (id, name) VALUES ($1, $2)',
      [id, name]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});