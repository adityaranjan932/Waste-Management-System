const CollectionPoint = require('../models/CollectionPoint');
const Van = require('../models/Van');
const axios = require('axios');

const requestAlternateCollection = async (req, res) => {
  console.log("Processing requestAlternateCollection...");
  const { latitude, longitude, requestedTime } = req.body;
  const customerId = req.user.id; // Assuming auth middleware sets req.user

  try {
    console.log("Finding nearest van...");
    const nearestVan = await Van.findOne({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [longitude, latitude] },
        },
      },
    });
    console.log("Nearest van found:", nearestVan);

    console.log("Creating collection point...");
    const collectionPoint = new CollectionPoint({
      location: { coordinates: [longitude, latitude] },
      type: 'alternate',
      scheduleTime: new Date(requestedTime),
      customerId,
      vanId: nearestVan._id,
    });
    await collectionPoint.save();
    console.log("Collection point created:", collectionPoint);

    console.log("Fetching waypoints for the van...");
    const waypoints = await CollectionPoint.find({ vanId: nearestVan._id }).sort('scheduleTime');
    console.log("Waypoints fetched:", waypoints);

    console.log("Fetching route from map API...");
    const response = await axios.get('https://api.olamaps.com/directions', {
      params: {
        origin: `${nearestVan.location.coordinates[1]},${nearestVan.location.coordinates[0]}`,
        destination: `${latitude},${longitude}`,
        waypoints: waypoints.map(w => `${w.location.coordinates[1]},${w.location.coordinates[0]}`).join('|'),
        api_key: process.env.OLA_MAPS_API_KEY,
      },
    });
    console.log("Route fetched from map API:", response.data);

    req.io.emit('routeUpdate', { vanId: nearestVan._id, route: response.data });
    res.status(201).json({ message: 'Request submitted', collectionPoint });
  } catch (error) {
    console.error("Error in requestAlternateCollection:", error.message);
    res.status(500).json({ message: 'Error processing request', error });
  }
};

module.exports = { requestAlternateCollection };
