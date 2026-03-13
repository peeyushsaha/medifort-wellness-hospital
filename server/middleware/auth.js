const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * JWT authentication middleware.
 * Attaches req.user = { id, email, role } on success.
 */
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please provide a valid token.' });
  }

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

/**
 * Optional auth — sets req.user if token present, but doesn't reject if missing.
 */
function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    try {
      const token = header.split(' ')[1];
      req.user = jwt.verify(token, config.JWT_SECRET);
    } catch (e) {
      // ignore invalid token
    }
  }
  next();
}

module.exports = { auth, optionalAuth };
