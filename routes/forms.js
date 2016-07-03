var express = require('express');
var router  = express.Router();
var config  = require('../config');
var routerCache = require('../routes.cache');

router.get('/', function(req, res, next) {
	res.render('forms', config);
});

/*router.get('/', routerCache(function(req, res, next) {
	res.render('forms', config);
}, 60*5));*/

module.exports = router;
