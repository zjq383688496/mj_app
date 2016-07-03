var ERROR404 = require('./routes/ERROR404');
var ERROR500 = require('./routes/ERROR500');
var INDEX    = require('./routes/index');
var FORMS    = require('./routes/forms');

//console.log(ERROR404);

module.exports = function(app) {
	
	app.use(['/index.html', '/'], INDEX);
	app.use(['/forms.html'], FORMS);

	// 404 catch-all 处理器 & 500 错误处理器
	app.use(ERROR404);
	app.use(ERROR500);
};
