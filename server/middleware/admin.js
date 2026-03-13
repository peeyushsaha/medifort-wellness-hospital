/**
 * Admin role check middleware. Must be used AFTER auth middleware.
 */
function admin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }
  next();
}

module.exports = { admin };
