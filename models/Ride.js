const mongoose = require('mongoose');

const {Schema} = mongoose;
const {ObjectId} = Schema;

const Ride = new Schema({
  createdAt: {
    type: Date,
  },
  cost: {
    type: Number,
  },
  userId: {
    type: ObjectId,
  },
  bikeId: {
    type: ObjectId,
  },
  finishedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Ride', Ride);
