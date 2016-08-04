var ERROR404   = require('./routes/ERROR404');
var ERROR500   = require('./routes/ERROR500');

var DEMO_INDEX = require('./routes/demo-index');
var DEMO_FORMS = require('./routes/demo-forms');
var DEMO_CHART = require('./routes/demo-chart');
var DEMO_BIGPIPE = require('./routes/demo-bigpipe');

var COOKIE     = require('./routes/cookie');
var LOGOUT     = require('./routes/logout');
var LOGIN      = require('./routes/login');

var INDEX      = require('./routes/index');
var GENERALIZE = require('./routes/generalize');

var API        = require('./routes/api');
var API_MERGE  = require('./routes/api-merge');

module.exports = function(app) {
	// 判断用户登录状态
	app.use('/app', COOKIE);
	app.use('/logout', LOGOUT);
	app.use('/', LOGIN);
	// 主页面
	app.use('/app', INDEX);						// 首页
	app.use('/app/generalize', GENERALIZE);		// 新建推广


	// API
	app.use('/mjad', API);
	app.use('/mjad_merge', API_MERGE);

	// DEMO
	app.use(['/app/demo-index'], DEMO_INDEX);
	app.use(['/app/demo-forms'], DEMO_FORMS);
	app.use(['/app/demo-chart'], DEMO_CHART);
	app.use(['/app/demo-bigpipe'], DEMO_BIGPIPE);

	/*app.all('*', function(req, res, next) {
		res.redirect('/');
	});*/

	// 404 catch-all 处理器 & 500 错误处理器
	app.use(ERROR404);
	app.use(ERROR500);
};
