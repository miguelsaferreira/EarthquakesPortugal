const mongoose = require('mongoose');

const earthquakeSchema = new mongoose.Schema({
  date: Date,
  lat: Number,
  lon: Number,
  prof: Number,
  mag: Number,
  local: String,
  degree: String,
});

const Earthquake = mongoose.model('Earthquake', earthquakeSchema);
module.exports = Earthquake;
