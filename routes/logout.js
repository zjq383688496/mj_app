var express = require('express');
var router  = express.Router();
var config  = require('../config');

router.get('/', function(req, res, next) {
	res.clearCookie('authorizationData');
	res.redirect(config.link.logoutWeimob);
});

module.exports = router;
