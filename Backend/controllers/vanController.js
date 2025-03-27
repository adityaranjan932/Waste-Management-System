const Van = require('../models/Van');

const updateVanLocation = async (req, res) => {
  const { vanId, latitude, longitude } = req.body;
  try {
    const van = await Van.findByIdAndUpdate(
      vanId,
      { location: { type: 'Point', coordinates: [longitude, latitude] } },
      { new: true }
    );
    req.io.emit('locationUpdate', van); // Broadcast to dashboard via WebSocket
    res.status(200).json({ message: 'Location updated', van });
  } catch (error) {
    res.status(500).json({ message: 'Error updating location', error });
  }
};

const axios = require('axios');

const getVanRoute = async (req, res) => {
  const { vanId } = req.params;
  try {
    const van = await Van.findById(vanId);
    const collectionPoints = await CollectionPoint.find({ type: 'regular' });
    const waypoints = collectionPoints.map(point => ({
      lat: point.location.coordinates[1],
      lng: point.location.coordinates[0],
    }));

    const response = await axios.get('https://api.olamaps.com/directions', {
      params: {
        origin: `${van.location.coordinates[1]},${van.location.coordinates[0]}`,
        destination: waypoints[waypoints.length - 1],
        waypoints: waypoints.slice(0, -1).map(w => `${w.lat},${w.lng}`).join('|'),
        api_key: process.env.OLA_MAPS_API_KEY,
      },
    });

    res.status(200).json({ route: response.data });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating route', error });
  }
};

const getVanProgress = async (req, res) => {
  const { collectionPointId } = req.params;
  try {
    const collectionPoint = await CollectionPoint.findById(collectionPointId).populate('vanId');
    const van = collectionPoint.vanId;

    const response = await axios.get('https://api.olamaps.com/directions', {
      params: {
        origin: `${van.location.coordinates[1]},${van.location.coordinates[0]}`,
        destination: `${collectionPoint.location.coordinates[1]},${collectionPoint.location.coordinates[0]}`,
        api_key: process.env.OLA_MAPS_API_KEY,
      },
    });

    res.status(200).json({
      vanLocation: van.location.coordinates,
      eta: response.data.routes[0].duration, // Duration in seconds
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching progress', error });
  }
};

module.exports = { updateVanLocation, getVanRoute, getVanProgress };