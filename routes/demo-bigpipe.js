var express = require('express');
var router  = express.Router();
var config  = require('../config');
//var routerCache = require('../routes.cache');

router.get('/', function(req, res, next) {
	var countdown = 3;
	var start = new Date().getTime();
	res.write('<!DOCTYPE html>');
	res.write('<html><head>');
	res.write('<title>Bigpipe</title>');
	res.write('</head>');
	res.write('<body>');
	setTimeout(function() {
		res.write('<div id="page1"></div>');
		res.write('<script>console.log('+countdown+');</script>');
		if(--countdown === 0) {
			res.end('</body></html>');
		}
	}, 1000);
	setTimeout(function() {
		res.write('<div id="page2"></div>');
		res.write('<script>console.log('+countdown+');</script>');
		if(--countdown === 0) {
			res.end('</body></html>');
		}
	}, 2000);
	setTimeout(function() {
		res.write('<body>');
		res.write('<div id="page3"></div>');
		res.write('<script>console.log('+countdown+');</script>');
		if(--countdown === 0) {
			res.end('</body></html>');
			var end = new Date().getTime();
			res.write('<script>console.log('+(end - start)+');</script>');
		}
	}, 3000);
});

/*router.get('/', routerCache(function(req, res, next) {
	res.render('index', config);
}, 60*5));*/

module.exports = router;
