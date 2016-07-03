var path      = require('path'),
	rootPath  = path.normalize(__dirname + '/..'),
	env       = process.env.NODE_ENV || 'development',
	localhost = process.env.localhost || 'false';
var config = {
	// 本地环境
	localhost: {
		root: rootPath,
		site_absolutepath: '/',
		domain: '',
		mengjuApi: 'http://121.40.18.85:8080/mjad',
		staticPath: '/public',
		views: {
			views: '/views',
			layouts:  'views/layouts/',
			partials: 'views/partials/'
		},
		link: {
			login: 'http://passport.test.weimob.com/index/login'
		}
	},
	// DEV环境
	development: {
		root: rootPath,
		site_absolutepath: '/',
		domain: '.www.dev.weimob.com',
		mengjuApi: 'http://121.40.18.85:8080/mjad',
		staticPath: '/public/build',
		views: {
			views: '/views/build',
			layouts:  'views/build/layouts/',
			partials: 'views/build/partials/'
		},
		link: {
			login: 'http://passport.test.weimob.com/index/login'
		}
	},
	// PRD环境
	production: {
		root: rootPath,
		site_absolutepath: '/',
		domain: 'weimob.com',
		mengjuApi: 'http://10.51.14.53:8080/mjad',
		staticPath: '/public/build',
		views: {
			views: '/views/build',
			layouts:  'views/build/layouts/',
			partials: 'views/build/partials/'
		},
		link: {
			login: 'http://passport.test.weimob.com/index/login'
		}
	}
};

var online = (localhost == 'false'),
	currentConfig = config[online? env: 'localhost'];

//console.log(online? env: 'localhost');
module.exports = currentConfig;
module.exports.evn = (online? env: 'localhost');
module.exports.noLocal = ((online? env: 'localhost') != 'localhost');
module.exports.debug = (env == 'development');
module.exports.online = online;
module.exports.title = '微盟盟聚—移动社交广告一站式投放平台';
module.exports.description = '盟聚(上海盟聚信息科技有限公司),是微盟旗下全资子公司,依托微盟公司多年来微信营销经验，为客户提供包括微信朋友圈广告，微信MP广告（微信公众号广告）和广点通三大社交广告的投放服务,并向客户提供包括微信行业营销解决方案，以及素材制作账号优化和数据分析在内的增值服务。';
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
