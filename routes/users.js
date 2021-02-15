const express = require('express');
const router = express.Router();

const User = require('../models/User')

const jwt = require('jsonwebtoken');

const {JWT_SECRET} = require('../config')

const auth = require('../middlewares/auth')


router.post('/join', async(req, res) => {
  try {
    const user = await User.create({})
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.send(token)
  } catch (e) {
    res.sent(e)
  }
})

router.post('/funds', auth, async (req, res) => {
  try {
    const {funds} = req.body;
    const user = await User.findById(req.userId);
    const fundsLeft = user.funds + funds
    user.funds = fundsLeft;
    await user.save()
    res.send({fundsLeft})
  } catch (e) {
    res.status(500).send(e);
  }

})

module.exports = router;
