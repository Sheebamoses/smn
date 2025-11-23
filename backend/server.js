// Polyfill for Node.js 16 compatibility
if (typeof globalThis.ReadableStream === 'undefined') {
  const polyfill = require('web-streams-polyfill');
  globalThis.ReadableStream = polyfill.ReadableStream;
  globalThis.WritableStream = polyfill.WritableStream;
  globalThis.TransformStream = polyfill.TransformStream;
}

// Polyfill fetch, Headers, and FormData for Node.js 16
if (typeof globalThis.fetch === 'undefined' || typeof globalThis.Headers === 'undefined') {
  const fetch = require('node-fetch');
  globalThis.fetch = fetch;
  globalThis.Headers = fetch.Headers;
}

if (typeof globalThis.FormData === 'undefined') {
  const FormData = require('form-data');
  globalThis.FormData = FormData;
}

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import routes
const enrichRoutes = require('./routes/enrich');
const dbService = require('./services/database');
const vectorDbService = require('./services/vectorDb');

// Routes
app.use('/api/enrich', enrichRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = await dbService.checkConnection();
    const vectorDbStatus = await vectorDbService.checkConnection();
    
    res.json({
      status: 'ok',
      database: dbStatus ? 'connected' : 'disconnected',
      vectorDb: vectorDbStatus ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Initialize database connections
async function initialize() {
  try {
    await dbService.initialize();
    await vectorDbService.initialize();
    console.log('Database connections initialized');
  } catch (error) {
    console.error('Failed to initialize database connections:', error);
  }
}

// Start server
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await initialize();
});

module.exports = app;

