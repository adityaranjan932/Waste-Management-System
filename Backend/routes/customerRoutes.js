const express = require('express');
const { requestAlternateCollection } = require('../controllers/customerController');
const authMiddleware = require('../middleware/auth'); // Assuming you have auth middleware
const router = express.Router();

router.post('/request', authMiddleware, requestAlternateCollection);

module.exports = router;
