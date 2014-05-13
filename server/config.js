"use strict";
module.exports = {

    server: {
        port : 3000
    },

    db: {
        name : 'htmljam',
        host : 'localhost',
        user : 'root',
        password: 'root',
        port: 3306,
        dialect: 'mysql',
        enableLogging: true
    },

    smtp: {
        service: 'Gmail',
        senderName: 'HTML5 Jam', 
        user: '',
        pass: ''
    },

    client: {
        port : 8888,
        baseUrl: 'http://0.0.0.0:',
        loginFailedUrl: 'http://0.0.0.0:',
        loginSuccessUrl: 'http://0.0.0.0:'
    },

    facebook: {
        clientID: '1450264391870610',
        clientSecret: '5f4d3d2e66046a46b62b3efc889fb33f' 
    },

    crypto: {
        algorithm: 'aes256',
        key: 'bobbyLapo1nte'
    }

};