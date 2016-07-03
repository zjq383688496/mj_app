var express = require('express');
var router  = express.Router();

router.use(function(err, req, res, next) {
	res.status(500);
	res.render('ERROR500', {
		message: err.message,
		layout: false
	});
});

module.exports = router;
