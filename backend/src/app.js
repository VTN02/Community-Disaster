const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (cURL, mobile, server-to-server)
      if (!origin) return callback(null, true);
      
      const cleanOrigin = origin.replace(/\/+$/, '');
      const configuredClient = (process.env.CLIENT_URL || '').replace(/\/+$/, '');
      
      if (
        !process.env.CLIENT_URL ||
        process.env.CLIENT_URL === '*' ||
        cleanOrigin === configuredClient ||
        cleanOrigin.endsWith('.vercel.app') ||
        cleanOrigin.includes('localhost')
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Fallback allow to guarantee no CORS blocks
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: '🇱🇰 Disaster Management LK API is running.' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/emergency-contacts', emergencyRoutes);
app.use('/api/chat', chatRoutes);

// Serve frontend static assets in production if built
const path = require('path');
const fs = require('fs');
const frontendDist = path.join(__dirname, '../../frontend/dist');

if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => {
    if (req.originalUrl.startsWith('/api')) {
      return res.status(404).json({ success: false, message: 'API route not found.' });
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  // 404 handler when frontend is deployed separately
  app.use('*', (req, res) => {
    res.status(404).json({ success: false, message: 'Route not found.' });
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong. Please try again.',
  });
});

module.exports = app;
