const express = require('express');
const router = new express.Router();
const bcrypt = require('bcryptjs');
const Driver = require('../models/Drivers');
const Ride = require('../models/Rides');
const {
  drivAuth
} = require('../middleware/auth');

router.post('/driver/register', async (req, res) => {
  const driver = req.body;
  try {
    const addedDriver = await Driver.query().insertGraph(driver);
    const token = await addedDriver.generateAuthToken();
    addedDriver.token = token;
    res.send({
      driver: addedDriver
    });
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post('/driver/login', async (req, res) => {
  try {
    const {
      email,
      password_hash
    } = req.body;
    let driver = await Driver.query().where('email', email);
    if (!driver.length) {
      throw new Error('Unable to log in!');
    }
    driver = driver[0];
    const isMatch = await bcrypt.compare(password_hash, driver.password_hash);
    if (!isMatch) {
      throw new Error('Unable to login!');
    }
    const token = await driver.generateAuthToken();
    driver.token = token;
    res.send({
      driver
    });
  } catch (err) {

  }
});

router.post('/driver/logout', drivAuth, async (req, res) => {
  try {
    const loggedOut = await Driver.query().findById(req.driver.id)
      .patch({
        token: ''
      });
    if (!loggedOut) {
      return res.status(404).send();
    }
    res.send({
      loggedOut: true
    });
  } catch (err) {
    res.status(400).send(e);
  }
});

router.post('/driver/rate', drivAuth, async (req, res) => {
  const {
    driver_rating,
    ride_id
  } = req.body;
  try {
    const rated = await Ride.query().findById(ride_id).patch({
      driver_rating
    });
    if (!rated) {
      return res.status(404).send({
        err: true,
        errMessage: 'Ride does not exist'
      });
    }
    res.send({
      rated: true
    });
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;