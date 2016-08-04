var path      = require('path'),
	rootPath  = path.normalize(__dirname + '/..'),
	env       = process.env.NODE_ENV || 'localhost';
var config = {
	// 本地环境
	localhost: {
		root: rootPath,
		site_absolutepath: '/',
		domain: '',
		mjApi: 'http://121.40.18.85:8080/mjad',
		//mjApi: 'http://localhost:8080/mjad',
		staticPath: '/public',
		views: {
			views: 'views',
			layouts:  'views/layouts/',
			partials: 'views/partials/'
		},
		link: {
			index: 'http://localhost:3000/app',
			login: 'http://localhost:3000',
			logout: 'http://localhost:3000/logout',
			logoutWeimob: 'http://passport.test.weimob.com/index/loginout'
		},
		cookieSecret: (new Buffer('localhost:4010')).toString('base64')
	},
	// DEV环境
	development: {
		root: rootPath,
		site_absolutepath: '/',
		domain: 'dev.weimob.com',
		mjApi: 'http://121.40.18.85:8080/mjad',
		staticPath: '/public/build',
		views: {
			views: 'views/build',
			layouts:  'views/build/layouts/',
			partials: 'views/build/partials/'
		},
		link: {
			index: 'http://app.mj.dev.weimob.com/app',
			login: 'http://app.mj.dev.weimob.com',
			logout: 'http://app.mj.dev.weimob.com/logout',
			logoutWeimob: 'http://passport.test.weimob.com/index/loginout'
		},
		cookieSecret: (new Buffer('mj.dev.weimob.com')).toString('base64')
	},
	// PRD环境
	production: {
		root: rootPath,
		site_absolutepath: '/',
		domain: 'weimob.com',
		mjApiIP: '10.51.14.53',
		mjApi: 'http://10.51.14.53:8080/mjad',
		staticPath: '/public/build',
		views: {
			views: '/views/build',
			layouts:  'views/build/layouts/',
			partials: 'views/build/partials/'
		},
		link: {
			index: 'http://app.mj.weimob.com/app',
			login: 'http://app.mj.weimob.com',
			logout: 'http://app.mj.weimob.com/logout',
			logoutWeimob: 'http://passport.weimob.com/index/loginout'
		},
		cookieSecret: (new Buffer('mj.weimob.com')).toString('base64')
	}
};

var currentConfig = config[env];

module.exports = currentConfig;
module.exports.evn = env;
module.exports.noLocal = (env != 'localhost');
module.exports.title = '微盟盟聚—移动社交广告一站式投放平台';
module.exports.keywords = '微盟,盟聚,微盟盟聚,朋友圈广告,微信公众号广告,微信MP广告,广点通,移动社交广告';
/*module.exports.app = {
	site_name: "weimob",
	business_number: "1,617,148",
	site_description: "微盟，国内最大的微信公众平台开发服务商，提供微信商城、餐饮O2O、移动办公、智慧城市等一体化微信营销解决方案",
	site_keywords: "微盟,微信营销,微信商城,微信定制开发,餐饮O2O,微网站,微商城,微营销,微信公众平台"
};*/
module.exports.geetestKey = {
	privateKey: '1b68c22778cbed6dbb8d84c867b92e60',
	publicKey: 'e66cee0d8f0f98aa1223bc0103ca28b6'
}
module.exports.geetest = require('geetest')(module.exports.geetestKey.privateKey, module.exports.geetestKey.publicKey);
