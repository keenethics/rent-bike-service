const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


const Bicycle = new Schema({
  light: {
    type: String,
    enum: ['on', 'off']
  },
  location: String,
  ip: String,
  status: {
    type: String,
    enum: ['busy', 'free', 'broken']
  }
}, {
  timestamps: true,
})

module.exports = mongoose.model('Bicycle', Bicycle)