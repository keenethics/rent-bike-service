const express = require('express');

const router = express.Router();

const Bicycle = require('../models/Bicycle')
const User = require('../models/User')
const Ride = require('../models/Ride')

const axios = require('axios');

const auth = require('../middlewares/auth');

const {bikeStatuses, httpStatuses} = require('../constants')
const {RIDE_FEE_PER_HOUR} = require('../config')

//get bicycles list (bicycle id, status, other params ... )
router.get('/', async (req, res) => {
  try {
    const bicycles = await Bicycle.find({})
    res.send(bicycles)
  } catch (e) {
    res.sent(e)
  }
});

router.get('/turn-light', async (req, res) => {
  try {
    const bicycles = await Bicycle.find({
      status: {
        $ne: 'broken'
      }
    });


    res.send(bicycles)
  } catch (e) {
    res.sent(e)
  }
});

router.get('/:id', (req, res) => {
  try {
    res.send(req.params.id)
  } catch (e) {
    res.sent(e)
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const {body} = req;
    const resp = await Bicycle.findOneAndUpdate({_id: id}, body,
      {
        runValidators: true,
        upsert: true
      });

    res.send(resp)
  } catch (e) {
    res.sent(e)
  }
});


router.post('/:id/rent', auth, async (req, res) => {
  try {
    const {userId, params} = req;
    const {id: bikeId} = params;
    const {body} = req;
    const RIDE_FEE = 5;
    const bike = await Bicycle.findOne({_id: bikeId});

    if (bike.status !== bikeStatuses.free) {
      res
        .status(httpStatuses.locked)
        .send('This bike is not ready for a rent');
      return;
    }

    const user = await User.findOne({_id: userId});

    if (parseInt(user.funds) < RIDE_FEE) {
      res
        .status(httpStatuses.locked)
        .send('Please add funds to your account');
      return;
    }

    const notFinishedRides = await Ride.count({
      userId,
      finishedAt: null
    })

    if (notFinishedRides > 0) {
      res
        .status(httpStatuses.badRequest)
        .send('Please finish your previous ride...');
      return;
    }

    const ride = await Ride.create({
      userId,
      bikeId,
    })

    res.send(ride)
  } catch (e) {
    res.sent(e)
  }
});

router.post('/:id/rent-end', auth, async (req, res) => {
  const {userId, params} = req;
  const {id: bikeId} = params;

  const ride = await Ride.findOne({
    userId,
    bikeId,
    finishedAt: null
  })

  if(!ride) {
    res
      .status(httpStatuses.badRequest)
      .send('No rides to finish');
    return;
  }

  const rideTime = Math.ceil((new Date() - ride.createdAt) / 1000 * 60 * 60);
  // const costsToDischarge = rideTime / RIDE_FEE_PER_HOUR;
  //FIXME: this logic
  const costsToDischarge = RIDE_FEE_PER_HOUR;

  const user = await User.findById(userId);

  if (user.funds < costsToDischarge) {
    res
      .status(httpStatuses.ok)
      .send('You have rode more than had money. We will contact you soon');
  }

  const fundsLeft = user.funds - costsToDischarge
  user.funds = fundsLeft;
  await user.save()

  ride.finishedAt = new Date();
  ride.cost = costsToDischarge;
  await ride.save()
  res.send({feePerRide: costsToDischarge, fundsLeft})


});


// turn light on all bicycles
router.get('/turn-light', (req, res) => {
  try {
    res.send('All the bicycles is here')
  } catch (e) {
    res.sent(e)
  }
})

module.exports = router;
