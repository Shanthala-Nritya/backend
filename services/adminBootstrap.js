const Admin = require('../models/Admin');
const { getAdminBootstrapConfig } = require('../config');

async function syncAdminFromEnv() {
  const { adminUsername, adminPassword } = getAdminBootstrapConfig();

  if (!adminUsername || !adminPassword) {
    return { bootstrapped: false, reason: 'env credentials not provided' };
  }

  const normalizedUsername = Admin.normalizeUsername(adminUsername);
  let admin = await Admin.findOne({ username: normalizedUsername });
  let changed = false;

  if (!admin) {
    admin = new Admin({ username: normalizedUsername, passwordHash: 'pending' });
    changed = true;
  }

  const passwordMatches = admin.passwordHash !== 'pending'
    ? await admin.comparePassword(adminPassword)
    : false;

  if (!passwordMatches) {
    await admin.setPassword(adminPassword);
    changed = true;
  }

  if (changed) {
    await admin.save();
  }

  return {
    bootstrapped: true,
    changed,
    username: normalizedUsername
  };
}

async function hasAnyAdmin() {
  return Boolean(await Admin.exists({}));
}

module.exports = {
  syncAdminFromEnv,
  hasAnyAdmin
};
