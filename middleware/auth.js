const jwt = require('jsonwebtoken');
const { getAuthConfig } = require('../config');
const Admin = require('../models/Admin');

module.exports = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const { jwtSecret } = getAuthConfig();
    const decoded = jwt.verify(token, jwtSecret);
    const admin = await Admin.findOne({ username: Admin.normalizeUsername(decoded.username) });

    if (!admin) {
      return res.status(401).json({ message: 'Admin account no longer exists' });
    }

    const issuedAtMs = decoded.iat ? decoded.iat * 1000 : 0;
    const passwordChangedAtMs = admin.passwordChangedAt ? admin.passwordChangedAt.getTime() : 0;

    if (passwordChangedAtMs > issuedAtMs) {
      return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }

    req.admin = decoded;
    req.adminRecord = admin;
    next();
  } catch {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
