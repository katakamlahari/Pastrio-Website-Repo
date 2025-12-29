exports.requireAuth = (req, res, next) => {
  if (req.session && req.session.userId) return next();
  // For API calls return 401, for normal requests redirect to login
  if (req.xhr || req.headers.accept && req.headers.accept.indexOf('application/json') !== -1) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }
  res.redirect('/login');
};

exports.attachUser = (req, res, next) => {
  res.locals.currentUser = null;
  if (req.session && req.session.userId) {
    res.locals.currentUser = { id: req.session.userId };
  }
  next();
};
