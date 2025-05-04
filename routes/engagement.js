const express = require('express');
const router = express.Router();
const Feed = require('../routes/feed');
const UserPoints = require('../models/UserPoints');
const authenticate = require('../middleware/authenticate');

// POST /api/feed/engage/:feedId
router.post('/feed/engage/:feedId', authenticate, async (req, res) => {
  const { feedId } = req.params;
  const userId = req.user.id;

  try {
    const feed = await Feed.findById(feedId);
    if (!feed) return res.status(404).json({ message: 'Feed not found' });

    // Find or create user points document
    let userPoints = await UserPoints.findOne({ userId });

    if (!userPoints) {
      userPoints = new UserPoints({ userId, points: 0, engagementHistory: [] });
    }

    // Check if user already engaged with this feed
    const alreadyEngaged = userPoints.engagementHistory.some(
      (engagement) => engagement.feedId.toString() === feedId
    );

    if (alreadyEngaged) {
      return res.status(400).json({ message: 'You already liked this feed.' });
    }

    // Add engagement history and increment points
    userPoints.engagementHistory.push({
      feedId,
      pointsEarned: 1,
    });
    userPoints.points += 1;

    await userPoints.save();

    return res.status(200).json({ message: 'You earned 1 point for engaging!' });
  } catch (error) {
    console.error('Engagement error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
