const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config');

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
    next();
  } catch (error) {
    res
      .status(401)
      .json({ status: 'Unauthorized request' });
  }
};
