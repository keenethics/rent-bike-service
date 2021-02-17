const mongoose = require('mongoose');

const {Schema} = mongoose;
const {ObjectId} = Schema;

const User = new Schema({
  funds: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', User);
