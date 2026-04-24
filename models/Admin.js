const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 12;

function normalizeUsername(username) {
  return String(username || '').trim().toLowerCase();
}

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now
  },
  lastLoginAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

AdminSchema.statics.normalizeUsername = normalizeUsername;

AdminSchema.methods.setPassword = async function setPassword(password) {
  this.passwordHash = await bcrypt.hash(String(password || ''), SALT_ROUNDS);
  this.passwordChangedAt = new Date();
};

AdminSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(String(password || ''), this.passwordHash);
};

module.exports = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
