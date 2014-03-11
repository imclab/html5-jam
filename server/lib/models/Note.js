"use strict";
var User = require('./').User;
var Video = require('./').Video;

module.exports = function(sequelize, DataTypes) {
    var Note = sequelize.define('Note', 
    {
        value: DataTypes.INTEGER
    },
    {
        tableName: 'notes'
    });

    User.hasMany(Note, {foreignKey: 'userId'});
    Note.belongsTo(User, {foreignKey: 'userId'});
    
    Video.hasMany(Note);

    Note.sync();
    
    return Note;
};
