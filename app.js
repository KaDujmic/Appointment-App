const express = require('express');
const morgan = require('morgan');
const cookie_parser = require('cookie-parser');

const user_routes = require('./routes/user_routes');
const appointment_routes = require('./routes/appointment_routes');
const role_routes = require('./routes/role_routes');

const app = express();

app.use(morgan('dev'));

app.use(express.json());
app.use(cookie_parser());

app.use('/users', user_routes);
app.use('/appointments', appointment_routes);
app.use('/roles', role_routes);

module.exports = app;
