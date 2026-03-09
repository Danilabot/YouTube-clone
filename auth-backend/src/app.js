const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const likeRoutes = require('./routes/likeRoutes')
const dislikeRoutes = require('./routes/dislikeRoutes')
const subscriptionRoutes = require('./routes/Subscriptions')
const commentLikeRoutes = require('./routes/commentLikeRoutes')
const savedVideoRoutes = require('./routes/savedVideoRoutes')

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', likeRoutes)
app.use('/api/videos', dislikeRoutes)
app.use('/api/subscriptions', subscriptionRoutes)
app.use('/api/comments', commentLikeRoutes)
app.use('/api/saved', savedVideoRoutes)
// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date(),
    database: 'SQLite'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;