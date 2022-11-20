const express = require('express');
const morgan = require('morgan');

const user_routes = require('./routes/user_routes');
const appointment_routes = require('./routes/appointment_routes');

const app = express();

app.use(morgan('dev'));

app.use(express.json());

app.use('/users', user_routes);
app.use('/appointments', appointment_routes);

module.exports = app;
