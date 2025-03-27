// backend/routes/vanRoutes.js
const express = require('express');
const { updateVanLocation, getVanRoute, getVanProgress } = require('../controllers/vanController');
const router = express.Router();

router.post('/location', updateVanLocation);
router.get('/route/:vanId', getVanRoute);
router.get('/progress/:collectionPointId', getVanProgress);

module.exports = router;