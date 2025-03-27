const mongoose = require('mongoose');

const collectionPointSchema = new mongoose.Schema({
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true },
  },
  type: { type: String, enum: ['regular', 'alternate'], required: true },
  scheduleTime: { type: Date, required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  vanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Van' },
  status: { type: String, default: 'pending' },
});

module.exports = mongoose.model('CollectionPoint', collectionPointSchema);
