const mongoose = require('mongoose');

const {Schema} = mongoose;
const {ObjectId} = Schema;

const User = new Schema({
  funds: {
    type: Number,
    default: 0,
  },
  // light: {
  //   type: String,
  //   enum: ['on', 'off']
  // },
  // location: String,
  // ip: String,
  // status: {
  //   type: String,
  //   enum: ['busy', 'free', 'broken']
  // }
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', User);
