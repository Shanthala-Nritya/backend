const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  filename: { type: String, default: '' },
  altText: { type: String, trim: true, default: '' },
  url: { type: String, required: true },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Add index for efficient sorting
PhotoSchema.index({ createdAt: -1 });
PhotoSchema.index({ category: 1, createdAt: -1 });

module.exports = mongoose.model('Photo', PhotoSchema);
