const config = {
  database: {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
  },
  server: {
    port: process.env.PORT || 3000,
  }
};

export default config;