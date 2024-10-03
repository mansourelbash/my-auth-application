const mongoose = require('mongoose');

// Define available roles
const roles = ['admin', 'editor', 'viewer', 'user']; // Added 'user' as a default role

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: roles,
    default: 'user',
    required: true
  },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
