require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const pasteRoutes = require('./src/routes/pasteRoutes');
const { errorHandler } = require('./src/middleware/errorHandler');
const pasteController = require('./src/controllers/pasteController');
const authRoutes = require('./src/routes/authRoutes');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { attachUser } = require('./src/middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pastebin-clone';

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sessions (stored in MongoDB)
app.use(
  session({
    name: 'sid',
    secret: process.env.SESSION_SECRET || 'change_this_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
    // NOTE: In production, configure a persistent session store such as connect-mongo or Redis.
  })
);

// Attach current user info to templates
app.use(attachUser);

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Connect to MongoDB (exported so serverless wrappers can initialize before handling)
let _mongoConnectionPromise = null;
function connectDB() {
  if (mongoose.connection.readyState === 1) return Promise.resolve();
  if (_mongoConnectionPromise) return _mongoConnectionPromise;
  _mongoConnectionPromise = mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log('✅ MongoDB connected successfully');
    })
    .catch((error) => {
      console.error('❌ MongoDB connection error:', error.message);
      throw error;
    });
  return _mongoConnectionPromise;
}

// Routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Pastrio - Share Snippets Securely' });
});

// Auth routes (register, login, logout)
app.use('/', authRoutes);

// View a paste by hash
app.get('/:hash', pasteController.getPaste);

app.use('/api/paste', pasteRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server when running directly (not when required by serverless wrappers)
if (require.main === module) {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`\n🚀 Server is running at http://localhost:${PORT}`);
        console.log(`📝 Create paste at http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Failed to start server due to DB error:', err.message || err);
    });
}

module.exports = { app, connectDB };
