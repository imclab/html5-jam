"use strict";
var Sequelize = require('sequelize');
var logger = require('winston');
var config = require('../config');

// init Sequelize db connection
var sequelize = new Sequelize(config.db.name, config.db.user, config.db.password, {
    dialect: config.db.dialect,
    port: config.db.port,
    logging: config.db.enableLogging
});

sequelize.authenticate()
.complete(function (err) {
    if (!!err) {
      logger.error('Unable to connect to the database:', err);
    } else {
      logger.info('Connection to the database has been established successfully');
    }
});

module.exports = sequelize;
