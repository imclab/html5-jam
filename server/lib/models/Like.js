"use strict";
var User = require('./').User;
var Jam = require('./').Jam;

module.exports = function(sequelize, DataTypes) {
    var Like = sequelize.define('Like', 
    {
    },
    {
        tableName: 'likes'
    });

    Jam.hasMany(Like);
    Like.hasOne(Jam);

    User.hasMany(Like);
    Like.hasOne(User);

    Like.sync();
    
    return Like;
};
