const mongoose = require('mongoose');

const {Schema} = mongoose;
const {ObjectId} = Schema;

const Bicycle = new Schema({
  light: {
    type: String,
    enum: ['on', 'off'],
  },
  location: String,
  ip: String,
  status: {
    type: String,
    enum: ['busy', 'free', 'broken'],
  },
  locked: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Bicycle', Bicycle);
