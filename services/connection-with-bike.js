const axios = require('axios');
const Bicycle = require('../models/Bicycle');
const { bikeStatuses } = require('../constants');

const getBikeStatus = async ({
  bikeId,
}) => {
  const bike = await Bicycle.findById(bikeId);
  const resp = await axios.get(`http://${bike.ip}`);

  if (resp.status !== 200) {
    await Bicycle.findByIdAndUpdate(bikeId, {
      status: bikeStatuses.broken,
    });
    throw Error('No connection to the bike');
  }

  return resp.data;
};

const setBikeStatus = async ({
  bikeId,
  bikeIp,
  data,
}) => {
  const resp = await axios.post(`http://${bikeIp}`, data);

  if (resp.status !== 200) {
    await Bicycle.findByIdAndUpdate(bikeId, {
      status: bikeStatuses.broken,
    });
    throw Error('No connection to the bike');
  }

  await Bicycle.findByIdAndUpdate(bikeId, data,
    {
      runValidators: true,
      upsert: true,
    });
  return resp;
};

module.exports = { setBikeStatus, getBikeStatus };
