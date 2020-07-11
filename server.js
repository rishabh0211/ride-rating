const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const knex = require('knex');
const { Model } = require('objection');

const customersRouter = require('./src/routers/customers');
const driversRouter = require('./src/routers/drivers');

const port = process.env.PORT || 3000;

const db = knex({
  client: 'pg',
  connection: process.env.POSTGRES_URI
});

Model.knex(db);

const app = express();
app.use(bodyParser.json());
app.use(morgan('combined'));

app.use(customersRouter);
app.use(driversRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});