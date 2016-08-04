'use strict';

var http = require('http');
var cookieSecret = (new Buffer('mengju.com')).toString('base64');
var config  = require('../config');
var request = require('request');

var MJJS = {
	/*
	/*  对象处理
	 */
	obj: {
		isEmptyObject: function(obj) { 
			for (var name in obj) { return false; }
			return true;
		}
	},
	/*
	/*  数据请求
	 */
	http: {
		ajax: function(type, url, reqData, success, error) {
			var _reqData = reqData,
				_success = success,
				_error   = error;
			if (typeof(reqData) === 'function') {
				_reqData = {};
				_success = reqData;
				_error   = success;
			}
			var opts = {
				url: config.mjApi + url,
				json: true,
				form: _reqData
			};
			request[type](opts, function (err, res, data) {
				if (!err && res.statusCode == 200) {
					if (typeof(_success) === 'function') _success(data);
				} else {
					if (typeof(_error) === 'function') _error(err);
					//console.log("Got error: " + err.message);
				}
			});
		},
		get: function (url, reqData, success, error) {
			this.ajax('get', url, reqData, success, error);
		},
		post: function (url, reqData, success, error) {
			this.ajax('post', url, reqData, success, error);
		}
	},
	/*
	/*  信息处理
	 */
	message: {
		// 404 catch-all 处理器（中间件）
		'404': function (res) {
			res.status(404).render('404');
		},
		// 500 错误处理器（中间件）
		'500': function (res) {
			res.status(500).render('500');
		}
	},
	/*
	/*  cookie
	 */
	cookie: {
		// cookie 秘钥放在这里
		secret: cookieSecret
	},
	/*
	/*  email
	 */
	email: {
		gmail: {
			user: 'zjq383688496work@gmail.com',
			password: 'jimmy001',
		}
	},
	/*  合并请求
	 */
	mergeRequest: {
		init: function(body, callback) {
			var len = 0;
			var now = 0;
			var request = {};
			for (var i in body) { ++len; }
			for (var i in body) {
				var api = body[i];
				var url = api[0];
				var type = api[1];
				var da =   api[2];
				if (type === 'get') {
					var param = [];
					for (var p in da) {
						param.push(p + '=' + da[p]);
					}
					param = param.join('&');
					if (url.indexOf('?') < 0) url = url + '?' + param
					else url = url + '&' + param;
				}
				this.ajax(i, url, type, da, function(name, data) {
					++now;
					request[name] = data;
					if (now === len) typeof(callback) === 'function' && callback(request);
				});
			}
		},
		ajax: function(name, url, type, data, callback) {
			MJJS.http[type](url, data, function(data) {
				typeof(callback) === 'function' && callback(name, data);
			}, function(err) {
				typeof(callback) === 'function' && callback(name, {
					code: '503',
					message: '服务器错误',
					data: null
				});
			});
		}
	},
	mapKey: 'AIzaSyBpv83qoZJrtW32r-e-E2ZkXwcYGOZUzrI'
};

module.exports = MJJS;