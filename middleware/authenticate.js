const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from header

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT token
    const user = await User.findById(decoded.userId); // Fetch user from database
    if (!user) return res.status(404).json({ message: 'User not found' });

    req.user = user; // Attach user to request
    next(); // Proceed to the next middleware/route
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
