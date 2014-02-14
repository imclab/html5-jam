"use strict";
var User = require('./').User;

module.exports = function(sequelize, DataTypes) {
    var Jam = sequelize.define('Jam', 
    {
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        privacy: { type: DataTypes.BOOLEAN, defaultValue: false }
    },
    {
        tableName: 'jams'
    });

    User.hasMany(Jam);

    Jam.sync();
    
    return Jam;
};
