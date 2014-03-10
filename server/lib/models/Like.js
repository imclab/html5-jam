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
    User.hasMany(Like, {foreignKey: 'userId'});
    Like.belongsTo(User, {foreignKey: 'userId'});

    Like.sync();
    
    return Like;
};
