require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');
const { seedDatabase } = require('./utils/seedData');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Connect to database (with fallback to local document database)
    await connectDB();

    // Seed realistic VM Eduvera curriculum & accounts if empty
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`  VM EDUVERA ONLINE ACADEMY - BACKEND SERVER RUNNING`);
      console.log(`  PORT        : ${PORT}`);
      console.log(`  API BASE    : http://localhost:${PORT}/api`);
      console.log(`  HEALTH CHECK: http://localhost:${PORT}/api/health`);
      console.log(`  CLIENT ORIGIN: ${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}`);
      console.log(`=======================================================`);
    });
  } catch (err) {
    console.error('Fatal error starting server:', err);
    process.exit(1);
  }
}

startServer();
