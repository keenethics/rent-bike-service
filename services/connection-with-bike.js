const axios = require('axios');
const Bicycle = require('../models/Bicycle')
const {bikeStatuses, httpStatuses} = require('../constants');

const request = async ({
                         bikeIp,
                         data
                       }) => {

  const resp = await axios.post(bikeIp, data);

  if(!resp.ok) {
    await Bicycle.findOneAndUpdate({_id: bikeIp}, {
      status: bikeStatuses.broken
      });
    return resp;
  }

  await Bicycle.findOneAndUpdate({_id: bikeIp}, data,
    {
      runValidators: true,
      upsert: true
    });
  return resp;
}