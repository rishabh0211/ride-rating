const jwt = require('jsonwebtoken');
const Customers = require('../models/Customers');
const Drivers = require('../models/Drivers');

const custAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const customer = await Customers.query().findOne({
      token: token,
      id: decoded.id
    });
    if (!customer) {
      throw new Error();
    }
    req.customer = customer;
    next();
  } catch (e) {
    res.status(401).send({
      error: 'Unauthorized!'
    });
  }
};

const drivAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const driver = await Drivers.query().findOne({
      token,
      id: decoded.id
    });
    if (!driver) {
      throw new Error();
    }
    req.driver = driver;
    next();
  } catch (e) {
    res.status(401).send({
      error: 'Unauthorized!'
    });
  }
};

module.exports = {
  custAuth, drivAuth
};