"use strict";
var User = require('./').User;
var Jam = require('./').Jam;

module.exports = function(sequelize, DataTypes) {
    var Comment = sequelize.define('Comment', 
    {
        content: DataTypes.STRING
    },
    {
        tableName: 'comments'
    });

    Jam.hasMany(Comment);
    Comment.hasOne(Jam);

    User.hasMany(Comment);
    Comment.hasOne(User);

    Comment.sync();
    
    return Comment;
};
