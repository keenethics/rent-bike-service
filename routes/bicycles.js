const express = require('express');

const router = express.Router();

const Bicycle = require('../models/Bicycle');
const User = require('../models/User');
const Ride = require('../models/Ride');

const auth = require('../middlewares/auth');

const { bikeStatuses, httpStatuses } = require('../constants');
const { RIDE_FEE_PER_HOUR } = require('../config');

const { setBikeStatus, getBikeStatus } = require('../services/connection-with-bike');

router.get('/', async (req, res) => {
  try {
    const bicycles = await Bicycle.find({});
    res.send(bicycles);
  } catch (e) {
    res.sent(e);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const status = await getBikeStatus({ bikeId: req.params.id });
    res.send(status);
  } catch (e) {
    res.send(e);
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const resp = await Bicycle.findOneAndUpdate({ _id: id }, body,
      {
        runValidators: true,
        upsert: true,
      });

    res.send(resp);
  } catch (e) {
    res.sent(e);
  }
});

router.post('/:id/rent', auth, async (req, res) => {
  try {
    const { userId, params } = req;
    const { id: bikeId } = params;
    const user = await User.findOne({ _id: userId });

    if (parseInt(user.funds) < RIDE_FEE_PER_HOUR) {
      res
        .status(httpStatuses.locked)
        .send('Please add funds to your account');
      return;
    }

    const bike = await Bicycle.findOne({ _id: bikeId });

    if (bike.status !== bikeStatuses.free) {
      res
        .status(httpStatuses.locked)
        .send('This bike is not ready for a rent');
      return;
    }

    const notFinishedRides = await Ride.countDocuments({
      userId,
      finishedAt: null,
    });

    if (notFinishedRides > 0) {
      res
        .status(httpStatuses.badRequest)
        .send('Please finish your previous ride...');
      return;
    }

    await setBikeStatus({
      bikeId,
      bikeIp: bike.ip,
      data: {
        status: bikeStatuses.busy,
        locked: false,
      },
    });

    const ride = await Ride.create({
      userId,
      bikeId,
    });

    res.send(ride);
  } catch (e) {
    res.send(e);
  }
});

router.post('/:id/broken', async (req, res) => {
  const { params } = req;
  const { id: bikeId } = params;

  const bike = await Bicycle.findById(bikeId);

  await setBikeStatus({
    bikeId,
    bikeIp: bike.ip,
    data: {
      status: bikeStatuses.broken,
    },
  });
  res.send('Thanks for notifying about broken bicycle!');
});

router.post('/:id/rent-end', auth, async (req, res) => {
  const { userId, params } = req;
  const { id: bikeId } = params;

  const bike = await Bicycle.findOne({ _id: bikeId });

  if (bike.status !== bikeStatuses.busy) {
    res
      .status(httpStatuses.badRequest)
      .send('This bike is not in use');
    return;
  }

  await setBikeStatus({
    bikeId,
    bikeIp: bike.ip,
    data: {
      status: bikeStatuses.free,
      locked: true,
    },
  });

  const ride = await Ride.findOne({
    userId,
    bikeId,
    finishedAt: null,
  });

  if (!ride) {
    res
      .status(httpStatuses.badRequest)
      .send('No rides to finish');
    return;
  }

  const rideTime = Math.ceil((new Date() - ride.createdAt) / 1000 * 60 * 60);
  // const costsToDischarge = rideTime / RIDE_FEE_PER_HOUR;
  // FIXME: this logic
  const costsToDischarge = RIDE_FEE_PER_HOUR;

  const user = await User.findById(userId);

  if (user.funds < costsToDischarge) {
    res
      .status(httpStatuses.ok)
      .send('You have rode more than had money. We will contact you soon');
  }

  const fundsLeft = user.funds - costsToDischarge;
  user.funds = fundsLeft;
  await user.save();

  ride.finishedAt = new Date();
  ride.cost = costsToDischarge;
  await ride.save();
  res.send({ feePerRide: costsToDischarge, fundsLeft });
});

router.post('/turn-light', async (req, res) => {
  try {
    const bicycles = await Bicycle.find({
      status: {
        $ne: 'broken',
      },
    });

    const turnedLightOnBikes = [];
    const noConnectionToBikes = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const bike of bicycles) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await setBikeStatus({
          bikeId: bike.id,
          bikeIp: bike.ip,
          data: {
            light: 'on',
          },
        });
        turnedLightOnBikes.push(bike.id);
      } catch (e) {
        noConnectionToBikes.push(bike.id);
      }
    }

    res.send({
      turnedLightOnBikes,
      noConnectionToBikes,
    });
  } catch (e) {
    res.sent(e);
  }
});

module.exports = router;
