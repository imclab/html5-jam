"use strict";
var User = require('./').User;

module.exports = function(sequelize, DataTypes) {
    var Jam = sequelize.define('Jam', 
    {
        name: DataTypes.STRING,
        privacy: { type: DataTypes.BOOLEAN, defaultValue: false },
        star: DataTypes.INTEGER
    },
    {
        tableName: 'jams'
    });

    User.hasMany(Jam, {foreignKey: 'userId'});
    Jam.belongsTo(User, {foreignKey: 'userId'});

    Jam.sync();
    
    return Jam;
};
