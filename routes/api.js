var express = require('express');
var router  = express.Router();
var MJJS    = require('../common/MJJS');

router.get('*', function(req, res, next) {
	MJJS.http.get(req.originalUrl.substr(5), function(data) {
		res.send(data);
	});
});

router.post('*', function(req, res, next) {
	MJJS.http.post(req.originalUrl.substr(5), req.body, function(data) {
		res.send(data);
	});
});

module.exports = router;
