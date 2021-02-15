const axios = require('axios');
const Bicycle = require('../models/Bicycle');
const {bikeStatuses, httpStatuses} = require('../constants');

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
    return resp;
  }

  await Bicycle.findByIdAndUpdate(bikeId, data,
    {
      runValidators: true,
      upsert: true,
    });
  return resp;
};

module.exports = setBikeStatus;
