var express = require('express');
var router  = express.Router();
var config  = require('../config');
var MJJS    = require('../common/MJJS');
//var routerCache = require('../routes.cache');

router.get('/', function(req, res, next) {
	res.render('index', {
		config: config,
		index: {
			button: true
		}
	});
});

/*router.get('/', routerCache(function(req, res, next) {
	res.render('index', { config: config });
}, 60*5));*/

module.exports = router;
