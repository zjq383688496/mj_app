'use strict';

var oneapm;
if (!process.env.localhost) oneapm = require('oneapm');
var express      = require('express');
var path         = require('path');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var config       = require('./config');
var routes       = require('./config.routes');
var handlebars   = require('express3-handlebars');
var session      = require('express-session');

// 创建项目实例
var app = express();
var _   = require('lodash');

app.disable('x-powered-by');

_.extend(app.locals, { oneapm: oneapm });

// 定义 handlebars 模板引擎和模板文件位置.
var hbs = handlebars.create({
	layoutsDir:    config.views.layouts,	// layout目录
	partialsDir:   config.views.partials,	// 局部模块目录
	defaultLayout: 'layout',	// 默认layout名称, 默认: main
	extname: '.hbs',			// 文件后缀名, 默认 .handlebars
	helpers: {
		section: function(name, options) {
			if (!this._sections) this._sections = {};
			this._sections[name] = options.fn(this);
			return null;
		}
	}
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname + config.views.views));	// 设置views目录
app.set('config', config);

_.extend(app.locals, {
	config: config,
});

// app.locals.selectnav = 'index';

// 定义日志和输出级别
//app.use(logger(config.debug ? 'dev' : 'combined'));

app.use(session({
	secret: 'mengju.weimob.com.secret',
	resave: true,
	name: 'mengju.session',
	//  cookie: { domain:config.domain,path: '/'},
	saveUninitialized: true
}));

// 定义数据解析器
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

var oneDay = 86400000;
app.use(express.static(__dirname + config.staticPath, {
	maxAge: oneDay
}));

// 模板缓存
//app.set('view cache', true);

// 配置路由
routes(app);

module.exports = app;
