export default {
  server: {
    port: process.env.PORT || 3000,  // Налаштування порту для вашого сервера
  },
  database: {
    host: process.env.PGHOST,
    port: process.env.PGPORT || 5432,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
  }
};
