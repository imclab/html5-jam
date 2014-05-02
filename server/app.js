'use strict';

var express = require('express');
var passport = require('passport');
var config = require('./config');
var errors = require('./lib/errors');
var logger = require('./lib/logger');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// enable CORS
var enableCORS = function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', config.client.baseUrl + config.client.port);
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Set-Cookie');
    next();
};

// setup database
var db = require('./lib/db');

// setup models
require('./lib/models').init(db);

// setup express server
var app = express();
app.use(cookieParser());
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb'}));
app.use(enableCORS);
app.use(passport.initialize());

// setup routes
require('./lib/routes').init(app);

// error handling middleware
app.use(errors.dispatch);



// setup security
require('./lib/security').init();

// start server
app.listen(config.server.port);
logger.info('Server started on port: ' + config.server.port);
