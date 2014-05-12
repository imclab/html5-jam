"use strict";
var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', 
    {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        picture_url: DataTypes.STRING,
        facebook_id: DataTypes.STRING,
        facebook_token: DataTypes.STRING
    },
    {
    	tableName: 'users'
    });

    User.sync();

    return User;
};
