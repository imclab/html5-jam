"use strict";
var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', 
    {
        name: DataTypes.STRING,
        picture_url: DataTypes.STRING,
        facebook_id: DataTypes.STRING,
        facebook_token: DataTypes.STRING,
    },
    {
    	tableName: 'users'
    });

    User.sync();

    User.login = function (profile, accessToken, callback) {
        // find or create AngelPal account
        User.findOrCreate({ facebook_id: profile.id }, 
            { 
                name: profile.displayName, 
                picture_url: profile.id,
                facebook_id: profile.id,
                facebook_token: accessToken
            })
            .success(function (user, created) {
                return callback(false, user);
            })
            .error(function (error) {
                return callback(error, false);
            });
    };


    return User;
};