var express = require('express');
var router  = express.Router();
var config  = require('../config');
var MJJS    = require('../common/MJJS');

router.all('*', function(req, res, next) {
	var auth = req.query.auth || '';
	var authorizationData = req.signedCookies.authorizationData || '';
	if (authorizationData) {
		MJJS.http.post('/login/getUserInfo', { token: authorizationData }, function(data) {
			if (data.code === '0000') {
				config.user = data.data;
				config.userStr = JSON.stringify(data.data);
				next();
			} else {
				res.redirect(config.link.logout);
			}
		}, function() {
			res.redirect(config.link.login);
		});
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
		// if (config.evn !== 'localhost') {
			res.redirect(config.link.login);
		// } else {
		// 	MJJS.http.post('/login/login', { auth: '123' }, function(data) {
		// 		//res.cookie('authDemo', 'jimmy.zhuang', { maxAge: 86400000 });
		// 		res.cookie('authorizationData', data.data.token, {
		// 			httpOnly: true,
		// 			signed: true,
		// 			maxAge: 86400000
		// 		});
		// 		//console.log(config.cookieSecret);
		// 		config.user = data.data;
		// 		res.redirect(config.link.index);
		// 	});
		// }
	}
});

module.exports = router;
