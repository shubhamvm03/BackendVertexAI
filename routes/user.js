const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).send('Access denied');

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send('Invalid token');
    req.user = user;
    next();
  });
};

// Get user's points
router.get('/points', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).send('User not found');
    res.json({ points: user.points });
  } catch (err) {
    res.status(500).send('Error fetching points');
  }
});

// Update points when a user likes a feed
router.post('/like', verifyToken, async (req, res) => {
  const { feedId } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).send('User not found');

    user.points += 1; // Increment points
    await user.save();
    res.json({ points: user.points });
  } catch (err) {
    res.status(500).send('Error updating points');
  }
});

module.exports = router;
