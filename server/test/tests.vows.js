"use strict";
var assert = require('assert');
var APIeasy = require('api-easy');
var suite = APIeasy.describe('api');
var config = require('../config');
var utils = require('../lib/utils');

// start server
config.db.enableLogging = false;
var app = require('../app');

// global Settings
suite.use('localhost', config.server.port);
var encryptedToken = utils.encrypt('123456789');


/**
*   Sample route
*/
suite.get('/')
    .expect(200)
    .export(module);

suite.get('/bobby')
    .expect(404)
    .export(module);


/**
*   Authentification
*/
suite.get('/me')
    .expect(401)
    .export(module);
suite.setHeader('Authorization', utils.encrypt('654321'))
    .get('/me')
    .expect(401)
    .export(module);
suite.setHeader('Authorization', encryptedToken)
    .get('/me')
    .expect(200)
    .expect('should respond with user\'s profile', function (err, res, body) {
        var profile = JSON.parse(body);
        assert.equal(profile.name, 'Bobby Grostest');
        assert.equal(profile.facebook_token, null);
     })
    .export(module);


/**
*   Jams
*/
suite.setHeader('Authorization', encryptedToken)
    .post('/jams')
    .expect(400)
    .export(module);
// suite.discuss('Creating jam...')
//     .setHeader('Authorization', encryptedToken)
//     .post('/jams', {data : { name: "john"}})
//     .expect(200)
//     .export(module);
suite.discuss('Updating jam...')
    .before('setBody', function (outgoing) {
        outgoing.body = '{ name: "jam de la mort 2", description: "woohoo braaa" }';
        return outgoing;
    })
    .setHeader('Authorization', encryptedToken)
    .put('/jams/100')
    .expect(200)
    .export(module);
suite.discuss('Get jam details...')
    .setHeader('Authorization', encryptedToken)
    .get('/jams/100')
    .expect(200)
    .expect('should respond with jam\'s details', function (err, res, body) {
        var jam = JSON.parse(body);
        assert.equal(jam.name, 'Mon super Jam');
        assert.equal(jam.privacy, 0);
        assert(jam.videos.length > 0);
     })
    .export(module);
suite.discuss('Get feeds...')
    .setHeader('Authorization', encryptedToken)
    .get('/feeds')
    .expect(200)
    .expect('should respond with feed of jams', function (err, res, body) {
        var feeds = JSON.parse(body);
        assert(feeds.jams.length > 0);
     })
    .export(module);


/**
*   Videos
*/
suite.discuss('Add empty video...')
    .setHeader('Authorization', encryptedToken)
    .post('/jams/100/videos')
    .expect(400)
    .export(module);
suite.discuss('Get video stream...')
    .setHeader('Authorization', encryptedToken)
    .get('/jams/100/videos/100')
    .expect(200)
    .export(module);


/**
*   Users
*/
suite.discuss('Get a user\'s profile...')
    .setHeader('Authorization', encryptedToken)
    .get('/users/100')
    .expect(200)
    .expect('should respond with the profile of a user', function (err, res, body) {
        var profile = JSON.parse(body);
        assert.equal(profile.name, 'Bobby Grostest');
        assert(profile.jams.length > 0);
     })
    .export(module);
suite.discuss('Updating user...')
    .setHeader('Authorization', encryptedToken)
    .put('/users/100')
    .expect(200)
    .export(module);


/**
*   Comments
*/
suite.discuss('Get a jam\'s comments...')
    .setHeader('Authorization', encryptedToken)
    .get('/jams/100/comments')
    .expect(200)
    .expect('should respond with the comments of a jam', function (err, res, body) {
        var comments = JSON.parse(body);
        assert(comments.comments.length > 0);
     })
    .export(module);
suite.discuss('Post empty comment...')
    .setHeader('Authorization', encryptedToken)
    .post('/jams/100/comments')
    .expect(400)
    .export(module);


/**
*   Likes
*/
suite.discuss('Like a jam...')
    .setHeader('Authorization', encryptedToken)
    .post('/jams/100/likes')
    .expect(200)
    .export(module);
suite.discuss('Dislike a jam...')
    .setHeader('Authorization', encryptedToken)
    .del('/jams/100/likes')
    .expect(200)
    .export(module);


/**
*   Friends
*/
suite.discuss('Follow himself...')
    .setHeader('Authorization', encryptedToken)
    .post('/users/100/follow')
    .expect(400)
    .export(module);
suite.discuss('Follow a user...')
    .setHeader('Authorization', encryptedToken)
    .post('/users/80/follow')
    .expect(200)
    .export(module);
suite.discuss('Unfollow a user...')
    .setHeader('Authorization', encryptedToken)
    .del('/users/80/follow')
    .expect(200)
    .export(module);


/**
*   Notes
*/
suite.discuss('Note video...')
    .setHeader('Authorization', encryptedToken)
    .post('/jams/100/videos/100/note')
    .expect(400)
    .export(module);
    