const express = require('express');
const app = express();

// Load environment variables from .env file (if using dotenv)
require('dotenv').config();

const database = require('./config/dataBase');
const PORT = process.env.PORT || 4000;

// Connect to the database
database.connect();

// Middleware to parse JSON (if needed)
app.use(express.json());

// Default route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: "Your server is running",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
