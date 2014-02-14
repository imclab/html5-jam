"use strict";
var User = require('./').User;
var Jam = require('./').Jam;

module.exports = function(sequelize, DataTypes) {
    var Video = sequelize.define('Video', 
    {
        description: DataTypes.STRING,
        instrument: DataTypes.INTEGER,
        active: DataTypes.BOOLEAN,
        volume: DataTypes.INTEGER
    },
    {
        tableName: 'videos'
    });

    User.hasMany(Video);

    Jam.hasMany(Video);

    Video.sync();
    
    return Video;
};
