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
