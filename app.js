const express = require('express');
const morgan = require('morgan');

const user_routes = require('./routes/user_routes');

const app = express();

app.use(morgan('dev'));

app.use(express.json());

app.use('/users', user_routes);

module.exports = app;
