const express = require('express');
const router = express.Router();
const moment = require('moment');
const Customer = require('../models/Customers');
const Driver = require('../models/Drivers');
const Ride = require('../models/Rides');
const bcrypt = require('bcryptjs');

const {
  custAuth
} = require('../middleware/auth')

router.post('/customer', async (req, res) => {
  const user = req.body;
  try {
    const customer = await Customer.query().insertGraph(user);
    const token = await customer.generateAuthToken();
    customer.token = token;
    res.send({
      customer
    });
  } catch (e) {
    res.status(501).send(e);
  }
});

router.post('/customer/login', async (req, res) => {
  try {
    const {
      email,
      password_hash
    } = req.body;
    let customer = await Customer.query().where('email', email);
    if (!customer.length) {
      throw new Error('Unable to log in!');
    }
    customer = customer[0];
    const isMatch = await bcrypt.compare(password_hash, customer.password_hash);
    if (!isMatch) {
      throw new Error('Unable to login!');
    }
    const token = await customer.generateAuthToken();
    customer.token = token;
    res.send({
      customer
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post('/customer/logout', custAuth, async (req, res) => {
  try {
    const loggedOut = await Customer.query().findById(req.customer.id)
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

router.post('/customers/createRide', custAuth, async (req, res) => {
  const {
    source,
    destination
  } = req.body;
  try {
    let drivers = await Driver.query();
    drivers = drivers.filter(driver => driver.available);
    if (!drivers.length) {
      return res.send(400).send('Driver not available');
    }
    const selectedDriver = drivers[Math.floor(Math.random() * drivers.length)];
    const ride = {
      driver_id: selectedDriver.id.toString(),
      customer_id: req.customer.id.toString(),
      source: source,
      destination: destination
    };
    const insertedRide = await Ride.query().insertGraph(ride);
    console.log('insertedRide = ', insertedRide);
    await Driver.query()
      .patch({
        available: false
      })
      .where('id', selectedDriver.id);
    res.send(insertedRide);
  } catch (e) {
    res.status(501).send(e);
  }
});

router.post('/customer/rate', custAuth, async (req, res) => {
  const {
    customer_rating,
    ride_id
  } = req.body;
  try {
    const rated = await Ride.query().findById(ride_id).patch({
      customer_rating
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
    res.sendStatus(501);
  }
});

module.exports = router;