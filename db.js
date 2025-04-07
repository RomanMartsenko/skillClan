// db.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:eBcpSaXauSTWsKdviXhJAAtXYoVjqZwe@trolley.proxy.rlwy.net:50681/railway',
});

module.exports = pool;