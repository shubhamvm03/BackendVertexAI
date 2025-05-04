const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const feedRoutes = require('./routes/feed');
const engagementRoutes = require('./routes/engagement');
const userRoutes = require('./routes/user'); // ✅ Import this
const adminRoutes = require('./routes/admin');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api', engagementRoutes);
app.use('/api/user', userRoutes); // ✅ Mount this
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
