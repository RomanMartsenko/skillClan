const config = {
  databaseUrl: process.env.DATABASE_URL,
  server: {
    port: process.env.PORT || 3000,
  }
};

export default config;