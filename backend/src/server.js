require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/database');
const { ensureUploadDir } = require('./services/uploadService');

const PORT = process.env.PORT || 4000;

let server;

const startServer = async () => {
  await connectDB();
  ensureUploadDir();

  server = app.listen(PORT, () => {
    console.log(`\u{1F680} Bluefage Events API server running on port ${PORT}`);
    console.log(`\u{1F4C1} Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`\u{1F517} API: http://localhost:${PORT}/api`);
    console.log(`\u{1F50D} Health: http://localhost:${PORT}/api/health`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

const shutdown = async (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  if (server) server.close();
  const { prisma } = require('./config/database');
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
