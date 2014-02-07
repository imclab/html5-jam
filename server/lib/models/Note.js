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

    Note.hasOne(User);
    User.hasMany(Note);

    Video.hasMany(Note);
    Note.hasOne(Video);

    Note.sync();
    
    return Note;
};
