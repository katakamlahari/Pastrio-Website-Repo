const mongoose = require('mongoose');

const pasteSchema = new mongoose.Schema(
  {
    // Unique short hash for the URL (e.g., "a1b2c3")
    hash: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    
    // Paste content
    content: {
      type: String,
      required: true,
    },
    
    // Optional expiration time (when paste should be deleted)
    expiresAt: {
      type: Date,
      default: null,
    },
    
    // Maximum number of views before auto-deletion
    maxViews: {
      type: Number,
      default: null, // null means unlimited
    },
    
    // Current view count
    views: {
      type: Number,
      default: 0,
    },
    
    // Whether the paste is expired/deleted
    isExpired: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// Automatically delete expired pastes (TTL index)
pasteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, sparse: true });

// Method to check if paste is expired
pasteSchema.methods.isAccessible = function () {
  // Check if time-based expiration
  if (this.expiresAt && new Date() > this.expiresAt) {
    return false;
  }
  
  // Check if view-based expiration
  if (this.maxViews !== null && this.views >= this.maxViews) {
    return false;
  }
  
  return !this.isExpired;
};

// Method to increment view count
pasteSchema.methods.incrementView = function () {
  this.views += 1;
  return this.save();
};

const Paste = mongoose.model('Paste', pasteSchema);

module.exports = Paste;
