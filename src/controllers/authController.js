const User = require('../models/User');

exports.showRegister = (req, res) => {
  res.render('register', { title: 'Register' });
};

exports.showLogin = (req, res) => {
  res.render('login', { title: 'Login' });
};

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).render('register', { title: 'Register', error: 'Username and password are required' });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).render('register', { title: 'Register', error: 'Username already taken' });
    }

    const user = await User.createUser(username, password);

    req.session.userId = user._id;
    res.redirect('/');
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).render('error', { title: 'Server Error', message: 'Unable to register', statusCode: 500 });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).render('login', { title: 'Login', error: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).render('login', { title: 'Login', error: 'Invalid credentials' });
    }

    const ok = await user.verifyPassword(password);
    if (!ok) {
      return res.status(400).render('login', { title: 'Login', error: 'Invalid credentials' });
    }

    req.session.userId = user._id;
    res.redirect('/');
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).render('error', { title: 'Server Error', message: 'Unable to login', statusCode: 500 });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('sid');
    res.redirect('/');
  });
};
