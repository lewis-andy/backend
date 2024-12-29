const express = require('express');
const path = require('path');
const cors = require('cors'); // Import cors middleware
const userRoutes = require('./routes/user');

const app = express();
require('dotenv').config();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:4200', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Allow credentials if needed
  optionsSuccessStatus: 200, // Ensure older browsers understand the response
};

app.use(cors(corsOptions)); // Enable CORS middleware

// Middleware to parse JSON
app.use(express.json());

// Preflight request handler for all routes
app.options('*', cors(corsOptions));

// Serve uploaded media files statically
app.use('/media', express.static(path.join(__dirname, 'media')));

// Example routes
app.use('/api/auth', userRoutes);

// Middleware to set headers explicitly
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

// Export the configured app
module.exports = app;
