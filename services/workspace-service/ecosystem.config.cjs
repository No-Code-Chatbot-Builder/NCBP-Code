// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

process.env.PORT = 80;

if (!process.env.PORT) {
  console.error('⚠️  Missing PORT in .env');
  process.exit();
}

module.exports = {
  apps: [{
    name: "workspace-service",
    port: process.env.PORT,
    script: "./dist/server.js",
    watch: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
  }]
};