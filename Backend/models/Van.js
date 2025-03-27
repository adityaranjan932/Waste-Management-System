const mongoose = require('mongoose');

const vanSchema = new mongoose.Schema({
  name: String,
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  status: { type: String, default: 'active' },
});

vanSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('Van', vanSchema);