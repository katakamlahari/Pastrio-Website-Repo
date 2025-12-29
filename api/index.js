const serverless = require('serverless-http');
const { app, connectDB } = require('../server');

const handler = serverless(app);

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('DB connection error in serverless handler:', err);
    res.statusCode = 500;
    res.end('Database connection error');
    return;
  }

  return handler(req, res);
};
