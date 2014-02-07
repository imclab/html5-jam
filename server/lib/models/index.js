"use strict";
var db = require('../initDB');

// load models
var models = [
    'User', 'Jam', 'Video', 'Like', 'Comment', 'Note'
];
models.forEach(function (model) {
    module.exports[model] = db.import(__dirname + '/' + model);
});
