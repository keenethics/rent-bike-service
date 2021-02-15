const {JWT_SECRET} = require('../config')
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  const { token } = req.body;

  req.isAuthenticated = false;

  if (!token) {
    next();

    return;
  }

  try {
    const { id } = await jwt.verify(token, JWT_SECRET);

    req.userId = id;
    req.isAuthenticated = true;

    next();
  } catch (error) {
    res
      .status(401)
      .json({ status: 'Unauthorized request' });
  }
};