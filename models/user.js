const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  points: { type: Number, default: 0 }, // Initialize points to 0
  role: { type: String, default: 'user' } // Add role with default value 'user'
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = User;
