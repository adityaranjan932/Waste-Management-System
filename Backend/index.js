const express = require('express');
const app = express();

// Load environment variables from .env file (if using dotenv)
require('dotenv').config();

const database = require('./config/dataBase');
const PORT = process.env.PORT || 4000;

console.log("Starting server...");

// Connect to the database
database.connect();

// Middleware to parse JSON (if needed)
app.use(express.json());
console.log("Middleware initialized");

const customerRoutes = require('./routes/customerRoutes');
console.log("Routes loaded");

// Default route
app.get('/', (req, res) => {
  console.log("Default route accessed");
  res.json({
    success: true,
    message: "Your server is running",
  });
});

app.use('/api/customers', customerRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
