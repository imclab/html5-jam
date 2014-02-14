"use strict";
var User = require('./').User;

module.exports = function(sequelize, DataTypes) {
    var Friend = sequelize.define('Friend', 
    {
        friendId: DataTypes.INTEGER
    },
    {
        tableName: 'friends'
    });

    User.hasMany(Friend);
    
    Friend.sync();
    
    return Friend;
};
