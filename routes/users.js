const express = require('express');
const router = express.Router();

const User = require('../models/User')

router.post('/join', async(req, res) => {
  try {
    const user = await User.create({})
    res.send(user)
  } catch (e) {
    res.sent(e)
  }
})

router.post('/funds', (req, res) => {



})

module.exports = router;
