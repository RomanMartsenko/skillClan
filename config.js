import 'dotenv/config'; // дозволяє читати .env

export default {
  server: {
    port: process.env.PORT || 3000
  },
  database: {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD
  }
};
