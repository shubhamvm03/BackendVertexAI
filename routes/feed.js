const express = require('express');
const axios = require('axios');
const User = require('../models/user'); // Import the User model

const router = express.Router();

// ✅ Fetch Reddit posts from a specific subreddit
const fetchReddit = async () => {
  const res = await axios.get('https://www.reddit.com/r/technology.json');
  console.log("Reddit Response:", res.data); // Debugging the response structure
  return res.data.data.children.map(post => ({
    source: 'Reddit',
    title: post.data.title,
    url: `https://reddit.com${post.data.permalink}`,
  }));
};

// 🔒 Placeholder: LinkedIn feed (requires special auth, so keep it commented)
/*
const fetchLinkedIn = async () => {
  return [
    {
      source: 'LinkedIn',
      title: 'LinkedIn API access requires developer approval',
      url: '#',
    },
  ];
};
*/

// Endpoint to handle feed like and point update
router.post('/engage/:feedId', async (req, res) => {
  console.log(req.body);
  console.log(req.params);
  const { feedId } = req.params;
  const { userId } = req.body; // Assuming userId is passed in the request body

  try {
    const user = await User.findById(userId); // Fetch user based on userId

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Increment points by 1 for liking a feed
    if (user.role=='user'){
      user.points += 1;
      await user.save(); // Save the updated user
    }
   

    res.status(200).json({ points: user.points }); // Return the updated points
  } catch (err) {
    console.error('Error updating points:', err);
    res.status(500).send('Server error');
  }
});

// Aggregate feeds
router.get('/aggregate', async (req, res) => {
  try {
    const redditFeeds = await fetchReddit();
    // const linkedinFeeds = await fetchLinkedIn(); // Uncomment when LinkedIn API is available
    const allFeeds = [...redditFeeds /*, ...linkedinFeeds */];
    res.json(allFeeds); // Send all feeds as response
  } catch (error) {
    console.error('Error fetching feeds:', error.message);
    res.status(500).json({ error: 'Failed to fetch feeds' }); // Return error if something fails
  }
});

module.exports = router;
