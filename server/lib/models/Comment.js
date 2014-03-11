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
    User.hasMany(Comment, {foreignKey: 'userId'});
    Comment.belongsTo(User, {foreignKey: 'userId'});

    Comment.sync();
    
    return Comment;
};
