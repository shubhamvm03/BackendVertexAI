// routes/admin.js or wherever appropriate
const express = require('express');
const router = express.Router();
const User = require('../models/user'); // adjust path to your User model

// Route to get user stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const mostActiveUsers = await User.find().sort({ points: -1 }).limit(5); // top 5 users by points

    res.json({
      totalUsers,
      mostActiveUsers
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
