var express = require('express');
var router  = express.Router();
var MJJS    = require('../common/MJJS');

router.post('*', function(req, res, next) {
	var body = req.body;
	MJJS.mergeRequest.init(body, function(data) {
		res.send(data);
	});
});

module.exports = router;
