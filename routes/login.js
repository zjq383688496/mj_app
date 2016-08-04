var express = require('express');
var router  = express.Router();
var config  = require('../config');
var MJJS    = require('../common/MJJS');

router.get('/', function(req, res, next) {
	var auth = req.query.auth || '';
	var authorizationData = req.signedCookies.authorizationData || '';
	if (authorizationData) {
		res.redirect('/app');
	} else if (auth) {
		MJJS.http.post('/login/login', { auth: auth }, function(data) {
			if (data.code === '0000') {
				res.cookie('authorizationData', data.data.token, {
					httpOnly: true,
					signed: true,
					maxAge: 86400000
				});
				config.user = data.data;
				config.userStr = JSON.stringify(data.data);
				res.redirect(config.link.index);
			} else {
				res.redirect(config.link.logout);
			}
		}, function() {
			res.redirect(config.link.login);
		});
	} else {
		res.render('login', { layout: 'layout-login' });
	}
});

module.exports = router;
