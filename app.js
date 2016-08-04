'use strict';

var oneapm;
if (!process.env.localhost) oneapm = require('oneapm');
const express      = require('express');
const path         = require('path');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const config       = require('./config');
const routes       = require('./config.routes');
const handlebars   = require('express3-handlebars');
const session      = require('express-session');

// 创建项目实例
const app = express();
const _   = require('lodash');

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
app.set('views', config.views.views);	// 设置views目录
app.set('config', config);

_.extend(app.locals, {
	config: config,
});

// app.locals.selectnav = 'index';

// 定义日志和输出级别
// app.use(logger(config.debug ? 'dev' : 'combined'));

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

app.use(cookieParser(config.cookieSecret));

const oneDay = 86400000;
app.use(express.static(__dirname + config.staticPath, {
	maxAge: oneDay
}));

// 模板缓存
//app.set('view cache', true);

// 配置路由
routes(app);

module.exports = app;
