const express = require('express');

const router = express.Router();

const Bicycle = require('../models/Bicycle')

const axios = require('axios');

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
    const resp = await Bicycle.findOneAndUpdate({_id: id}, body, {upsert: true});

    res.send(resp)
  } catch (e) {
    res.sent(e)
  }
})

// turn light on all bicycles
router.get('/turn-light', (req, res) => {
  try {
    res.send('All the bicycles is here')
  } catch (e) {
    res.sent(e)
  }
})

module.exports = router;
