const serverless = require('serverless-http');
const path = require('path');

// Import the Express app exported by server.js
const { app, connectDB } = require(path.join(__dirname, '..', 'server'));

// Ensure DB connection is established (returns a promise)
connectDB().catch((err) => {
  console.error('Error connecting to DB in serverless wrapper:', err && err.message ? err.message : err);
});

module.exports = serverless(app);
const { app, connectDB } = require('../server');

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('DB connection error in serverless handler:', err);
    res.status(500).send('Database connection error');
    return;
  }

  return app(req, res);
};
