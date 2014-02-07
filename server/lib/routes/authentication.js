"use strict";
module.exports.init = function (app, config, security, errors) {
    
    /**
    *	Login
    */
    app.get('/auth/facebook', security.authenticate());
	

    /**
    *	OAuth Callback
    */
	app.get('/auth/facebook/callback', security.authenticationCallback(), security.authenticationSuccessful);


	/**
	*	Am I logged in ? Returns user information
	*/
	app.get('/me', security.authenticationRequired, function (req, res, next) {
		req.user.token = '';
	    res.send(req.user);
	});

}
