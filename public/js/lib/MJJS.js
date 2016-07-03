// ==================================================
// ==== MJJS v0.0.1 ====
// 基于jQuery v2.2.1，包括以下方法集合：
// - JS原型方法扩展： String/Number/Array/Date
// - jQuery方法扩展: $.browser/$.fn
// - MJJS旧版保留方法: cookie
// - MJJS方法库： core/json/page
// ==================================================

(function($, window, undefined) {
	
	if (!$) return;
	if (!window.MJJS) window.MJJS = {};

	/* String 原型方法扩展 */
	(function() {
		$.extend(String.prototype, {
			_toBoolean: function() {
				return (this.toString() === 'false' || this.toString() === '' || this.toString() === '0') ? false: true;
			},
			_toNumber: function() {
				return (!isNaN(this)) ? Number(this) : this.toString();
			},
			_toRealValue: function() {
				return (this.toString() === 'true' || this.toString() === 'false') ? this._toBoolean() : this._toNumber();
			},
			trim: function() {
				return this.replace(/(^\s*)|(\s*$)/g, '');
			},
			ltrim: function() {
				return this.replace(/(^\s*)/g, '');
			},
			rtrim: function() {
				return this.replace(/(\s*$)/g, '');
			},
			trimAll: function() {
				return this.replace(/\s/g, '');
			},
			trimNoteChar: function() {
				return this.replace(/^[^\{]*\{\s*\/\*!?|\*\/[;|\s]*\}$/g, '').trim();
			},
			left: function(len) {
				return this.substring(0, len);
			},
			right: function(len) {
				return (this.length <= len) ? this.toString() : this.substring(this.length - len, this.length);
			},
			reverse: function() {
				return this.split('').reverse().join('');
			},
			startWith: function(start, noCase) {
				return !(noCase ? this.toLowerCase().indexOf(start.toLowerCase()) : this.indexOf(start));
			},
			endWith: function(end, noCase) {
				return noCase ? (new RegExp(end.toLowerCase() + '$').test(this.toLowerCase().trim())) : (new RegExp(end + '$').test(this.trim()));
			},
			sliceAfter: function(str) {
				return (this.indexOf(str) >= 0) ? this.substring(this.indexOf(str) + str.length, this.length) : '';
			},
			sliceBefore: function(str) {
				return (this.indexOf(str) >= 0) ? this.substring(0, this.indexOf(str)) : '';
			},
			getByteLength: function() {
				return this.replace(/[^\x00-\xff]/ig, 'xx').length;
			},
			subByte: function(len, s) {
				if (len < 0 || this.getByteLength() <= len) {
					return this.toString();
				}
				var str = this;
				str = str.substr(0, len).replace(/([^\x00-\xff])/g,'\x241 ').substr(0, len).replace(/[^\x00-\xff]$/,'').replace(/([^\x00-\xff]) /g,'\x241');
				return str + (s || '');
			},
			encodeURI: function(type) {
				var etype = type || 'utf',
					efn = (etype == 'uni') ? escape: encodeURIComponent;
				return efn(this);
			},
			decodeURI: function(type) {
				var dtype = type || 'utf',
					dfn = (dtype == 'uni') ? unescape: decodeURIComponent;
				try {
					var os = this.toString(),
						ns = dfn(os);
					while (os != ns) {
						os = ns;
						ns = dfn(os);
					}
					return os;
				} catch(e) {
					// 备注： uni加密，再用utf解密的时候，会报错
					return this.toString();
				}
			},
			textToHtml: function() {
				return this.replace(/</ig, '&lt;').replace(/>/ig, '&gt;').replace(/\r\n/ig, '<br>').replace(/\n/ig, '<br>');
			},
			htmlToText: function() {
				return this.replace(/<br>/ig, '\r\n');
			},
			htmlEncode: function() {
				var text = this,
					re = {
						'<': '&lt;',
						'>': '&gt;',
						'&': '&amp;',
						'"': '&quot;'
					};
				for (var i in re) {
					text = text.replace(new RegExp(i, 'g'), re[i]);
				}
				return text;
			},
			htmlDecode: function() {
				var text = this,
					re = {
						'&lt;': '<',
						'&gt;': '>',
						'&amp;': '&',
						'&quot;': '"'
					};
				for (var i in re) {
					text = text.replace(new RegExp(i, 'g'), re[i]);
				}
				return text;
			},
			stripHtml: function() {
				return this.replace(/(<\/?[^>\/]*)\/?>/ig, '');
			},
			stripScript: function() {
				return this.replace(/<script(.|\n)*\/script>\s*/ig, '').replace(/on[a-z]*?\s*?=".*?"/ig, '');
			},
			replaceAll: function(os, ns) {
				return this.replace(new RegExp(os, 'gm'), ns);
			},
			escapeReg: function() {
				return this.replace(new RegExp("([.*+?^=!:\x24{}()|[\\]\/\\\\])", "g"), '\\\x241');
			},
			addQueryValue: function(name, value) {
				var url = this.getPathName();
				var param = this.getQueryJson();
				if (!param[name]) param[name] = value;
				return url + '?' + $.param(param);
			},
			getQueryValue: function(name) {
				var reg = new RegExp("(^|&|\\?|#)" + name.escapeReg() + "=([^&]*)(&|\x24)", "");
				var match = this.match(reg);
				return (match) ? match[2] : '';
			},
			getQueryJson: function() {
				if (this.indexOf('?') < 0) return {};
				var query = this.substr(this.indexOf('?') + 1),
					params = query.split('&'),
					len = params.length,
					result = {},
					key,
					value,
					item,
					param;
				for (var i = 0; i < len; i++) {
					param = params[i].split('=');
					key = param[0];
					value = param[1];
					item = result[key];
					if (undefined == typeof item) {
						result[key] = value;
					} else if (Object.prototype.toString.call(item) == '[object Array]') {
						item.push(value);
					} else {
						result[key] = [item, value];
					}
				}
				return result;
			},
			getDomain: function() {
				if (this.startWith('http://')) return this.split('/')[2];
				return '';
			},
			getPathName: function() {
				return (this.lastIndexOf('?') == -1) ? this.toString() : this.substring(0, this.lastIndexOf('?'));
			},
			getFilePath: function() {
				return this.substring(0, this.lastIndexOf('/') + 1);
			},
			getFileName: function() {
				return this.substring(this.lastIndexOf('/') + 1);
			},
			getFileExt: function() {
				return this.substring(this.lastIndexOf('.') + 1);
			},
			parseDate: function() {
				return (new Date()).parse(this.toString());
			},
			parseJSON: function() {
				return (new Function("return " + this.toString()))();
			},
			parseAttrJSON: function() {
				var d = {},
					a = this.toString().split(';');
				for (var i = 0; i < a.length; i++) {
					if (a[i].trim() === '' || a[i].indexOf(':') < 1) continue;
					var item = a[i].sliceBefore(':').trim(),
						val = a[i].sliceAfter(':').trim();
					if (item !== '' && val !== '') d[item.toCamelCase()] = val._toRealValue();
				}
				return d;
			},
			_pad: function(width, ch, side) {
				var str = [side ? '': this, side ? this: ''];
				while (str[side].length < (width ? width: 0) && (str[side] = str[1] + (ch || ' ') + str[0]));
				return str[side];
			},
			padLeft: function(width, ch) {
				if (this.length >= width) return this.toString();
				return this._pad(width, ch, 0);
			},
			padRight: function(width, ch) {
				if (this.length >= width) return this.toString();
				return this._pad(width, ch, 1);
			},
			toHalfWidth: function() {
				return this.replace(/[\uFF01-\uFF5E]/g, function(c) {
					return String.fromCharCode(c.charCodeAt(0) - 65248);
				}).replace(/\u3000/g, " ");
			},
			toCamelCase: function() {
				if (this.indexOf('-') < 0 && this.indexOf('_') < 0) {
					return this.toString();
				}
				return this.replace(/[-_][^-_]/g, function(match) {
					return match.charAt(1).toUpperCase();
				});
			},
			format: function() {
				var result = this;
				if (arguments.length > 0) {
					var parameters = (arguments.length == 1 && $.isArray(arguments[0])) ? arguments[0] : $.makeArray(arguments);
					$.each(parameters, function(i, n) {
						result = result.replace(new RegExp("\\{" + i + "\\}", "g"), n);
					});
				}
				return result;
			},
			substitute: function(data) {
				return data && typeof(data) == 'object'? this.replace(/\{([^{}]+)\}/g, function(match, key) {
					var key = key.split('.'), value = data;
					var len = key.length;
					for (var i = 0; i < len; i++) {
						value = value[key[i]];
						if (!value) break;
					}
					return void 0 !== value ? '' + value : '';
				}): this.toString();
			}
		});
	})();

	/* String 数据校验相关 */
	(function() {
		$.extend(String.prototype, {
			isIP: function() {
				var re = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;
				return re.test(this.trim());
			},
			isUrl: function() {
				return (new RegExp(/^(ftp|https?):\/\/([^\s\.]+\.[^\s]{2,}|localhost)$/i).test(this.trim()));
			},
			isURL: function() {
				return this.isUrl();
			},
			isDate: function() {
				var result = this.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
				if (result === null) return false;
				var d = new Date(result[1], result[3] - 1, result[4]);
				return (d.getFullYear() == result[1] && d.getMonth() + 1 == result[3] && d.getDate() == result[4]);
			},
			isTime: function() {
				var result = this.match(/^(\d{1,2})(:)?(\d{1,2})\2(\d{1,2})$/);
				if (result === null) return false;
				if (result[1] > 24 || result[3] > 60 || result[4] > 60) return false;
				return true;
			},
			// 整数
			isInteger: function() {
				return (new RegExp(/^(-|\+)?\d+$/).test(this.trim()));
			},
			// 正整数
			isPositiveInteger: function() {
				return (new RegExp(/^\d+$/).test(this.trim())) && parseInt(this, 10) > 0;
			},
			// 负整数
			isNegativeInteger: function() {
				return (new RegExp(/^-\d+$/).test(this.trim()));
			},
			isNumber: function() {
				return !isNaN(this);
			},
			isRealName: function() {
				return (new RegExp(/^[A-Za-z \u4E00-\u9FA5]+$/).test(this));
			},
			isLogName: function() {
				return (this.isEmail() || this.isMobile());
			},
			isEmail: function() {
				return (new RegExp(/^([_a-zA-Z\d\-\.])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/).test(this.trim()));
			},
			isMobile: function() {
				return (new RegExp(/^(13|14|15|17|18)\d{9}$/).test(this.trim()));
			},
			isPhone: function() {
				return (new RegExp(/^(([0\+]\d{2,3}-)?(0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/).test(this.trim()));
			},
			isAreacode: function() {
				return (new RegExp(/^0\d{2,3}$/).test(this.trim()));
			},
			isPostcode: function() {
				return (new RegExp(/^\d{6}$/).test(this.trim()));
			},
			isLetters: function() {
				return (new RegExp(/^[A-Za-z]+$/).test(this.trim()));
			},
			isDigits: function() {
				return (new RegExp(/^[1-9][0-9]+$/).test(this.trim()));
			},
			isAlphanumeric: function() {
				return (new RegExp(/^[a-zA-Z0-9]+$/).test(this.trim()));
			},
			isValidString: function() {
				return (new RegExp(/^[a-zA-Z0-9\s.\-_]+$/).test(this.trim()));
			},
			isLowerCase: function() {
				return (new RegExp(/^[a-z]+$/).test(this.trim()));
			},
			isUpperCase: function() {
				return (new RegExp(/^[A-Z]+$/).test(this.trim()));
			},
			isChinese: function() {
				return (new RegExp(/^[\u4e00-\u9fa5]+$/).test(this.trim()));
			},
			isIDCard: function() {
				//这里没有验证有效性，只验证了格式
				var r15 = new RegExp(/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/);
				var r18 = new RegExp(/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/);
				return (r15.test(this.trim()) || r18.test(this.trim()));
			},
			isVisa: function() {
				return this.isCardNo('Visa');
			},
			isMasterCard: function() {
				return this.isCardNo('MasterCard');
			}
		});
	})();

	/* Number 原型方法扩展 */
	(function() {
		$.extend(Number.prototype, {
			// 添加逗号分隔，返回为字符串
			comma: function(length) {
				if (!length || length < 1) length = 3;
				var source = ('' + this).split('.');
				source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{' + length + '})+$)', 'ig'), '$1,');
				return source.join('.');
			},
			// 生成随机数
			randomInt: function(min, max) {
				return Math.floor(Math.random() * (max - min + 1) + min);
			},
			// 左侧补齐，返回为字符串
			padLeft: function(width, ch) {
				return ('' + this).padLeft(width, ch);
			},
			// 右侧补齐，返回字符串
			padRight: function(width, ch) {
				return ('' + this).padRight(width, ch);
			}
		});
	})();

	/* Array 原型方法扩展 */
	(function() {
		$.extend(Array.prototype, {
			// 查找内容项位置
			indexOf: function(item, it) {
				for (var i = 0; i < this.length; i++) {
					if (item == ((it) ? this[i][it] : this[i])) return i;
				}
				return -1;
			},
			// 删除指定内容项
			remove: function(item, it) {
				this.removeAt(this.indexOf(item, it));
			},
			// 删除指定内容项
			removeAt: function(idx) {
				if (idx >= 0 && idx < this.length) {
					for (var i = idx; i < this.length - 1; i++) {
						this[i] = this[i + 1];
					}
					this.length--;
				}
			},
			// 清除空字符串内容
			removeEmpty: function() {
				var arr = [];
				for (var i = 0; i < this.length; i++) {
					if (this[i].trim() !== '') {
						arr.push(this[i].trim());
					}
				}
				return arr;
			},
			// 添加内容，比push多一个检查相同内容部分
			add: function(item) {
				if (this.indexOf(item) > -1) {
					return false;
				} else {
					this.push(item);
					return true;
				}
			},
			// 数组数据交换
			swap: function(i, j) {
				if (i < this.length && j < this.length && i != j) {
					var item = this[i];
					this[i] = this[j];
					this[j] = item;
				}
			},
			// 过滤重复数据
			unique: function() {
				var a = [],
					o = {},
					i,
					v,
					len = this.length;
				if (len < 2) return this;
				for (i = 0; i < len; i++) {
					v = this[i];
					if (o[v] !== 1) {
						a.push(v);
						o[v] = 1;
					}
				}
				return a;
			},
			// JSON数组排序
			// it: item name  dt: int, char  od: asc, desc
			sortby: function(it, dt, od) {
				var compareValues = function(v1, v2, dt, od) {
					if (dt == 'int') {
						v1 = parseInt(v1, 10);
						v2 = parseInt(v2, 10);
					} else if (dt == 'float') {
						v1 = parseFloat(v1);
						v2 = parseFloat(v2);
					}
					var ret = 0;
					if (v1 < v2) ret = 1;
					if (v1 > v2) ret = -1;
					if (od == 'desc') {
						ret = 0 - ret;
					}
					return ret;
				};
				var newdata = [];
				for (var i = 0; i < this.length; i++) {
					newdata[newdata.length] = this[i];
				}
				for (i = 0; i < newdata.length; i++) {
					var minIdx = i;
					var minData = (it !== '') ? newdata[i][it] : newdata[i];
					for (var j = i + 1; j < newdata.length; j++) {
						var tmpData = (it !== '') ? newdata[j][it] : newdata[j];
						var cmp = compareValues(minData, tmpData, dt, od);
						if (cmp < 0) {
							minIdx = j;
							minData = tmpData;
						}
					}
					if (minIdx > i) {
						var _child = newdata[minIdx];
						newdata[minIdx] = newdata[i];
						newdata[i] = _child;
					}
				}
				return newdata;
			}
		});
	})();

	/* Date 原型方法扩展 */
	(function() {
		$.extend(Date.prototype, {
			// 时间读取
			parse: function(time) {
				if (typeof(time) == 'string') {
					if (time.indexOf('GMT') > 0 || time.indexOf('gmt') > 0 || !isNaN(Date.parse(time))) {
						return this._parseGMT(time);
					} else if (time.indexOf('UTC') > 0 || time.indexOf('utc') > 0 || time.indexOf(',') > 0) {
						return this._parseUTC(time);
					} else {
						return this._parseCommon(time);
					}
				}
				return new Date();
			},
			_parseGMT: function(time) {
				this.setTime(Date.parse(time));
				return this;
			},
			_parseUTC: function(time) {
				return (new Date(time));
			},
			_parseCommon: function(time) {
				var d = time.split(/ |T/),
					d1 = d.length > 1 ? d[1].split(/[^\d]/) : [0, 0, 0],
					d0 = d[0].split(/[^\d]/);
				return new Date(d0[0] - 0, d0[1] - 1, d0[2] - 0, (d1[0]||0) - 0, (d1[1]||0) - 0, (d1[2]||0) - 0);
			},
			// 复制时间对象
			clone: function() {
				return new Date().setTime(this.getTime());
			},
			// 时间相加
			dateAdd: function(type, val) {
				var _y = this.getFullYear();
				var _m = this.getMonth();
				var _d = this.getDate();
				var _h = this.getHours();
				var _n = this.getMinutes();
				var _s = this.getSeconds();
				switch (type) {
					case 'y':
						this.setFullYear(_y + val);
						break;
					case 'm':
						this.setMonth(_m + val);
						break;
					case 'd':
						this.setDate(_d + val);
						break;
					case 'h':
						this.setHours(_h + val);
						break;
					case 'n':
						this.setMinutes(_n + val);
						break;
					case 's':
						this.setSeconds(_s + val);
						break;
				}
				return this;
			},
			// 时间相减
			dateDiff: function(type, date2) {
				var diff = date2 - this;
				switch (type) {
					case 'w':
						return diff / 1000 / 3600 / 24 / 7;
					case 'd':
						return diff / 1000 / 3600 / 24;
					case 'h':
						return diff / 1000 / 3600;
					case 'n':
						return diff / 1000 / 60;
					case 's':
						return diff / 1000;
				}
			},
			// 格式化为字符串输出
			format: function(format) {
				if (isNaN(this)) return '';
				var o = {
					'm+': this.getMonth() + 1,
					'd+': this.getDate(),
					'h+': this.getHours(),
					'n+': this.getMinutes(),
					's+': this.getSeconds(),
					'S': this.getMilliseconds(),
					'W': ['日', '一', '二', '三', '四', '五', '六'][this.getDay()],
					'q+': Math.floor((this.getMonth() + 3) / 3)
				};
				if (format.indexOf('am/pm') >= 0) {
					format = format.replace('am/pm', (o['h+'] >= 12) ? '下午': '上午');
					if (o['h+'] >= 12) o['h+'] -= 12;
				}
				if (/(y+)/.test(format)) {
					format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
				}
				for (var k in o) {
					if (new RegExp('('+ k +')').test(format)) {
						format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
					}
				}
				return format;
			}
		});
	})();

	/* jQuery方法扩展: $.browser/$.fn */
	(function() {
		// $.browser方法扩展
		var ua = navigator.userAgent.toLowerCase();
		if (!$.browser) {
			$.browser = {
				version: (ua.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [0,'0'])[1],
				safari: /webkit/.test(ua),
				opera: /opera/.test(ua),      
				mozilla: /mozilla/.test(ua) && !/(compatible|webkit)/.test(ua)
			};
		}
		// 增加了IE11的判断
		$.browser.msie = (/msie/.test(ua)||/trident/.test(ua)) && !/opera/.test(ua);
		$.extend($.browser, {
			isIE6: ($.browser.msie && $.browser.version == 6) ? true: false,
			IEMode: (function() {
				if ($.browser.msie) {
					// >=IE8
					if (document.documentMode) {
						return document.documentMode;
					}
					if (document.compatMode && document.compatMode == 'CSS1Compat') {
						return 7;
					}
					// quirks mode
					return 5;
				}
				return 0;
			})(),
			isIPad: (/iPad/i).test(navigator.userAgent),
			language: function() {
				return (navigator.language || navigator.userLanguage || '').toLowerCase();
			}
		});
		// ----------------------------
		// 获取tagName
		$.fn.tagName = function() {
			if (this.length === 0) return '';
			if (this.length > 1) {
				var tagNames = [];
				this.each(function(i, el) {
					tagNames.push(el.tagName.toLowerCase());
				});
				return tagNames;
			} else {
				return this[0].tagName.toLowerCase();
			}
		};
		// 获取select的文本
		$.fn.optionText = function() {
			if (this.length === 0) return '';
			var sel = this[0];
			if (sel.selectedIndex === -1) return '';
			return sel.options[sel.selectedIndex].text;
		};
		// 获取element属性的JSON值
		$.fn.attrJSON = function(attr) {
			return (this.attr(attr || 'rel') || '').parseAttrJSON();
		};
	})();

	/* MJJS core: namespace/define/debug/load */
	(function() {
		// ----------------------------
		// MJJS.namespace 命名空间
		MJJS.namespace = function(name, sep) {
			var s = name.split(sep || '.'),
				d = {},
				o = function(a, b, c) {
					if (c < b.length) {
						if (!a[b[c]]) {
							a[b[c]] = {};
						}
						d = a[b[c]];
						o(a[b[c]], b, c + 1);
					}
				};
			o(window, s, 0);
			return d;
		};
		// ----------------------------
		// 模块方法定义，其中callback为定义后需要附加执行的处理
		MJJS.define = function(name, value, callback) {
			var obj = this,
				item = name;
			if (name.indexOf('.') > 0) {
				var a = name.split('.');
				item = a.pop();
				var source = a.join('.');
				obj = MJJS.namespace(source);
			}
			if (obj[item]) return;
			obj[item] = value;
			if (callback) callback();
			MJJS.debug('MJJS.define', name, 'info');
		};
		// ----------------------------
		// MJJS.debug 过程调试
		MJJS.debug = function(a, b, type) {
			if (!this.debugMode) return;
			type = type || 'log';
			if (window.console && console[type]) {
				console[type](new Date().format('hh:nn:ss.S') + ', ' + a, ' = ', b);
			} else {
				MJJS.debug.log(new Date().format('hh:nn:ss.S') + ', ' + a + ' = ' + b);
			}
		};
		$.extend(MJJS.debug, {
			log: function() {
				this.createDOM();
				var p = [],
					v = $('#_MJJS_debuglog textarea').val();
				for (var i = 0; i < arguments.length; i++) {
					p.push(arguments[i]);
				}
				v += (v === '' ? '': '\n') + p.join(' ');
				$('#_MJJS_debuglog textarea').val(v);
			},
			clear: function() {
				$('#_MJJS_debuglog textarea').val('');
			},
			createDOM: function() {
				if ($('#_MJJS_debuglog').length === 0) {
					var _html = '<div id="_MJJS_debuglog" style="position:fixed;bottom:0;left:0;right:0;_position:absolute;_bottom:auto;_top:0;padding:5px 0 5px 5px;border:solid 5px #666;background:#eee;z-index:1000;"><textarea style="font-size:12px;line-height:16px;display:block;background:#eee;border:none;width:100%;height:80px;"></textarea><a style="text-decoration:none;display:block;height:80px;width:20px;text-align:center;line-height:16px;padding:5px 0;_padding:6px 0;background:#666;color:#fff;position:absolute;right:-5px;bottom:0;" href="#">关闭调试器</a></div>';
					$('body').append(_html);
					$('#_MJJS_debuglog a').click(function() {
						$(this).parent().remove();
						return false;
					});
					$('#_MJJS_debuglog textarea').focus(function() {
						this.select();
					});
				}
			}
		});
		// ----------------------------
		// MJJS.load/MJJS.loader 加载管理
		MJJS.load = function(service, action, params) {
			if ($.isArray(service)) {
				var url = service.join(',');
				var urlsize = service.length;
				var status = MJJS.loader.checkFileLoader(url);
				if (status == urlsize + 1) {
					if (typeof(action) == 'function') action();
				} else if (status > 0) {
					MJJS.loader.addExecute(url, action);
				} else if (status === 0) {
					MJJS.loader.addExecute(url, action);
					MJJS.debug('开始加载JS', url);
					MJJS.loader.fileLoader[url] = 1;
					for (var i = 0; i < urlsize; i++) {
						MJJS.load(service[i], function() {
							MJJS.loader.fileLoader[url]++;
							if (MJJS.loader.fileLoader[url] == urlsize + 1) {
								MJJS.debug('完成加载JS', url);
								MJJS.loader.execute(url);
							}
						});
					}
				}
			} else if (MJJS.loader.serviceLibs[service] && MJJS.loader.serviceLibs[service].requires) {
				MJJS.load(MJJS.loader.serviceLibs[service].requires, function() {
					MJJS.load.run(service, action, params);
				});
			} else {
				MJJS.load.run(service, action, params);
			}
		};
		$.extend(MJJS.load, {
			setPath: function(path) {
				MJJS.loader.serviceBase = path;
			},
			add: function(key, data) {
				if (MJJS.loader.serviceLibs[key]) return;
				if (data.js && (!data.js.startWith('http')) && this.version) {
					data.js = data.js.addQueryValue('v', this.version);
				}
				if (data.css && (!data.css.startWith('http')) && this.version) {
					data.css = data.css.addQueryValue('v', this.version);
				}
				MJJS.loader.serviceLibs[key] = data;
			},
			run: function(service, act, params) {
				var action = (typeof(act) == 'string') ? (function() {
					try {
						var o = eval('MJJS.' + service);
						if (o && o[act]) o[act](params);
					} catch(e) {}
				}) : (act || function() {});
				if (MJJS.loader.checkService(service)) {
					action();
					return;
				}
				var url = MJJS.loader.getServiceUrl(service);
				var status = MJJS.loader.checkFileLoader(url);
				// status:-1异常, 0未加载, 1开始加载, 2完成加载
				if (status === 2) {
					action();
				} else if (status === 1) {
					MJJS.loader.addExecute(url, action);
				} else if (status === 0) {
					if ($('script[src="' + url + '"]').length > 0) {
						MJJS.loader.fileLoader[url] = 2;
						action();
					} else {
						MJJS.loader.addExecute(url, action);
						MJJS.loader.addScript(service);
					}
				} else {
					MJJS.debug('加载异常', service);
				}
			}
		});
		// ----------------------------
		MJJS.define('MJJS.loader', {
			fileLoader: {},
			executeLoader: {},
			serviceBase: (function() {
				return $('script:last').attr('src').sliceBefore('/j/') + '/';
			})(),
			serviceLibs: {},
			checkFullUrl: function(url) {
				return (url.indexOf('/') === 0 || url.indexOf('http://') === 0);
			},
			checkService: function(service) {
				if (this.checkFullUrl(service)) return false;
				try {
					if (service.indexOf('.') > 0) {
						var o = eval('MJJS.' + service);
						return (typeof(o) != undefined);
					}
					return false;
				} catch(e) {
					return false;
				}
			},
			checkFileLoader: function(url) {
				return (url !== '') ? (this.fileLoader[url] || 0) : -1;
			},
			getServiceUrl: function(service) {
				var url = '';
				if (this.checkFullUrl(service)) {
					url = service;
				} else if (this.serviceLibs[service]) {
					url = (this.checkFullUrl(this.serviceLibs[service].js)) ? this.serviceLibs[service].js : (this.serviceBase + this.serviceLibs[service].js);
				}
				return url;
			},
			execute: function(url) {
				if (this.executeLoader[url]) {
					for (var i = 0; i < this.executeLoader[url].length; i++) {
						this.executeLoader[url][i]();
					}
					this.executeLoader[url] = null;
				}
			},
			addExecute: function(url, action) {
				if (typeof(action) != 'function') return;
				if (!this.executeLoader[url]) this.executeLoader[url] = [];
				this.executeLoader[url].push(action);
			},
			addScript: function(service) {
				var this_ = this, url;
				if (this.checkFullUrl(service)) {
					url = service;
					this.getScript(url, function() {
						MJJS.debug('完成加载JS', url);
						this_.fileLoader[url] = 2;
						MJJS.loader.execute(url);
					});
				} else if (this.serviceLibs[service]) {
					if (this.serviceLibs[service].css) {
						url = (this.checkFullUrl(this.serviceLibs[service].css)) ? this.serviceLibs[service].css: (this.serviceBase + this.serviceLibs[service].css);
						if (!this.fileLoader[url]) {
							MJJS.debug('开始加载CSS', url);
							this.fileLoader[url] = 1;
							$('head').append('<link rel="stylesheet" type="text\/css"  href="' + url + '" \/>');
						}
					}
					if (this.serviceLibs[service].js) {
						url = (this.checkFullUrl(this.serviceLibs[service].js)) ? this.serviceLibs[service].js: (this.serviceBase + this.serviceLibs[service].js);
						this.getScript(url, function() {
							MJJS.debug('完成加载JS', url);
							this_.fileLoader[url] = 2;
							MJJS.loader.execute(url);
						});
					}
				}
			},
			getScript: function(url, onSuccess, onError) {
				MJJS.debug('开始加载JS', url);
				this.fileLoader[url] = 1;
				this.getRemoteScript(url, onSuccess, onError);
			},
			getRemoteScript: function(url, param, onSuccess, onError) {
				if ($.isFunction(param)) {
					onError = onSuccess;
					onSuccess = param;
					param = {};
				}
				var head = document.getElementsByTagName("head")[0];
				var script = document.createElement("script");
				script.type = 'text/javascript';
				script.charset = 'utf-8';
				script.src = url;
				for (var item in param) {
					if (item == 'keepScriptTag') {
						script.keepScriptTag = true;
					} else {
						script.setAttribute(item, param[item]);
					}
				}
				script.onload = script.onreadystatechange = function() {
					if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") {
						if (onSuccess) onSuccess();
						script.onload = script.onreadystatechange = null;
						if (!script.keepScriptTag) head.removeChild(script);
					}
				};
				script.onerror = function() {
					if (onError) onError();
				};
				head.appendChild(script);
			}
		});
	})();

	/* MJJS.cookie */
	(function() {
		// ----------------------------
		MJJS.namespace('MJJS.cookie');
		$.extend(MJJS.cookie, {
			getRootDomain: function() {
				var d = document.domain;
				if (d.indexOf('.') > 0 && !d.isIP()) {
					var arr = d.split('.'),
						len = arr.length,
						d1 = arr[len - 1],
						d2 = arr[len - 2],
						d3 = arr[len - 3];
					d = (d2 == 'com' || d2 == 'net') ? (d3 + '.' + d2 + '.' + d1) : (d2 + '.' + d1);
				}
				return d;
			},
			load: function() {
				var tC = document.cookie.split('; ');
				var tO = {};
				var a = null;
				for (var i = 0; i < tC.length; i++) {
					a = tC[i].split('=');
					tO[a[0]] = a[1];
				}
				return tO;
			},
			get: function(name) {
				var value = this.load()[name];
				if (value) {
					try {
						return decodeURI(value);
					} catch(e) {
						return unescape(value);
					}
				} else {
					return false;
				}
			},
			set: function(name, value, options) {
				options = (typeof(options) == 'object') ? options: {
					minute: options
				};
				var arg_len = arguments.length;
				var path = (arg_len > 3) ? arguments[3] : (options.path || '/');
				var domain = (arg_len > 4) ? arguments[4] : (options.domain || (options.root ? this.getRootDomain() : ''));
				var exptime = 0;
				if (options.day) {
					exptime = 1000 * 60 * 60 * 24 * options.day;
				} else if (options.hour) {
					exptime = 1000 * 60 * 60 * options.hour;
				} else if (options.minute) {
					exptime = 1000 * 60 * options.minute;
				} else if (options.second) {
					exptime = 1000 * options.second;
				}
				var exp = new Date(),
					expires = '';
				if (exptime > 0) {
					exp.setTime(exp.getTime() + exptime);
					expires = '; expires=' + exp.toGMTString();
				}
				domain = (domain) ? ('; domain=' + domain) : '';
				document.cookie = name + '=' + escape(value || '') + '; path=' + path + domain + expires;
			},
			del: function(name, options) {
				options = options || {};
				var path = '; path=' + (options.path || '/');
				var domain = (options.domain) ? ('; domain=' + options.domain) : '';
				if (options.root) domain = '; domain=' + this.getRootDomain();
				document.cookie = name + '=' + path + domain + '; expires=Thu,01-Jan-70 00:00:01 GMT';
			}
		});
	})();

	/* MJJS.json */
	(function() {
		// ----------------------------
		MJJS.namespace('MJJS.json');
		$.extend(MJJS.json, {
			parse: function(data) {
				return (new Function("return " + data))();
			},
			stringify: function(obj) {
				var m = {
					'\b': '\\b',
					'\t': '\\t',
					'\n': '\\n',
					'\f': '\\f',
					'\r': '\\r',
					'"': '\\"',
					'\\': '\\\\'
				};
				var s = {
					'array': function(x) {
						var a = ['['],
							b,
							f,
							i,
							l = x.length,
							v;
						for (i = 0; i < l; i += 1) {
							v = x[i];
							f = s[typeof v];
							if (f) {
								v = f(v);
								if (typeof(v) == 'string') {
									if (b) {
										a[a.length] = ',';
									}
									a[a.length] = v;
									b = true;
								}
							}
						}
						a[a.length] = ']';
						return a.join('');
					},
					'boolean': function(x) {
						return String(x);
					},
					'null': function() {
						return 'null';
					},
					'number': function(x) {
						return isFinite(x) ? String(x) : 'null';
					},
					'object': function(x) {
						if (x) {
							if (x instanceof Array) {
								return s.array(x);
							}
							var a = ['{'],
								b,
								f,
								i,
								v;
							for (i in x) {
								v = x[i];
								f = s[typeof v];
								if (f) {
									v = f(v);
									if (typeof(v) == 'string') {
										if (b) {
											a[a.length] = ',';
										}
										a.push(s.string(i), ':', v);
										b = true;
									}
								}
							}
							a[a.length] = '}';
							return a.join('');
						}
						return 'null';
					},
					'string': function(x) {
						if (/["\\\x00-\x1f]/.test(x)) {
							x = x.replace(/([\x00-\x1f\\"])/g, function(a, b) {
								var c = m[b];
								if (c) {
									return c;
								}
								c = b.charCodeAt();
								return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
							});
						}
						return '\"' + x + '\"';
					}
				};
				return s.object(obj);
			}
		});
	})();

	/* MJJS.util */
	(function() {
		// ----------------------------
		MJJS.namespace('MJJS.util');
		// ----------------------------
	})();

	/* MJJS.page */
	(function() {
		// ----------------------------
		MJJS.namespace('MJJS.page');
		// ----------------------------
		$.extend(MJJS.page, {
			// keyHandlers, such as: ESC
			keyHandler: {
				events: {},
				keys: {
					'ESC': 27,
					'PAGEUP': 33,
					'PAGEDOWN': 34,
					'END': 35,
					'HOME': 36,
					'LEFT': 37,
					'TOP': 38,
					'RIGHT': 39,
					'DOWN': 40,
					'INSERT': 45,
					'DELETE': 46,
					'F1': 112,
					'F2': 113,
					'F3': 114,
					'F4': 115,
					'F5': 116,
					'F6': 117,
					'F7': 118,
					'F8': 119,
					'F9': 120,
					'F10': 121,
					'F11': 122,
					'F12': 123
				},
				add: function(doc, key, eventItem, eventCallback) {
					this.events[eventItem] = function(e) {
						try {
							var code = e.which || e.keyCode || 0;
							if (code == MJJS.page.keyHandler.keys[key]) {
								eventCallback();
							}
						} catch(err) {}
					};
					$(doc).bind('keydown', this.events[eventItem]);
				},
				remove: function(doc, eventItem) {
					$(doc).unbind('keydown', this.events[eventItem]);
					this.events[eventItem] = null;
				}
			},
			// ------------------------
			// 设置主域(用于不同二级域下的数据访问)
			setDomain: function() {
				var d = document.domain;
				if (d.indexOf('.') < 0 || d.isIP()) return;
				var k = d.split('.'),
					d1 = k[k.length - 1],
					d2 = k[k.length - 2],
					d3 = k[k.length - 3];
				document.domain = (d2 == 'com' || d2 == 'net') ? (d3 + '.' + d2 + '.' + d1) : (d2 + '.' + d1);
			}
		});
		$.extend(MJJS.page.dialog, {
		});
		// ----------------------------
		// 页面初始化处理
		MJJS.page.init = function() {
			MJJS.debug('page', '开始初始化');
		};
		$(function() {
			MJJS.page.init();
		});
	})();

	/* MJJS.UI */
	(function() {
		// ----------------------------
		MJJS.namespace('MJJS.ui');
		// ----------------------------
		$.extend(MJJS.ui, {
			// 对象合并
			objMerge: function(obj1, obj2) {
				for (var p in obj1) {
					if (!obj2[p]) obj2[p] = obj1[p];
				}
				return obj2;
			},
			// 列表元素对象批量合并 依赖 objMerge 方法
			optsEach: function(list, opts, defOpts, callback) {
				$(list).each(function(i, e) {
					var params = MJJS.json.parse($(e).attr('data-opts'));
					var _opts;
					var _defOpts  = typeof(defOpts) === 'object'? defOpts: undefined;
					var _callback = typeof(defOpts) === 'function'? defOpts: callback;
					if (params && opts) {
						_opts = MJJS.ui.objMerge(opts, params);
					} else {
						_opts = opts || params || _defOpts;
					}
					if (typeof(_callback) === 'function') _callback(e, _opts);
				});
			},
			// 页面滚动条
			nicescroll: {
				init: function(parent, opts) {
					MJJS.load(['nicescroll'], function() {
						opts = opts || {
							styler: 'fb',
							cursorcolor: '#65cea7',
							cursorwidth: '6',
							cursorborderradius: '0px',
							background: '#424f63',
							spacebarenabled: false,
							cursorborder: '0',
							zindex: '1000'
						};
						if (parent) $(parent).niceScroll(opts);
					});
				},
				hide: function(parent) {
					MJJS.load(['nicescroll'], function() {
						if (parent)	$(parent).getNiceScroll().hide();
					});
				},
				show: function(parent) {
					MJJS.load(['nicescroll'], function() {
						if (parent)	$(parent).getNiceScroll().show();
					});
				}
			},
			// 拖动排序
			sortable: function(parent, opts) {
				MJJS.load(['jqueryui'], function() {
					if (parent)	{
						if (opts && typeof(opts) === 'object') {
							$(parent).sortable(opts);
						} else {
							$(parent).sortable();
						}
					}
				});
			},
			// 图表显示控件
			raphael: function(type, opts) {
				MJJS.load(['raphael'], function() {
					if (Morris[type] && opts) Morris[type](opts);
				});
			},
			// 生成线状图
			sparkline: function(parent, data, opts) {
				if (typeof(parent) === 'string') {
					MJJS.load(['sparkline'], function() {
						var defOpts = {
							type: 'bar',
							height: '35',
							barWidth: 5,
							barSpacing: 2,
							barColor: '#65cea7'
						}
						MJJS.ui.optsEach(parent, opts, defOpts, function(e, _opts) {
							$(e).sparkline(data, _opts);
						});
					});
				}
			},
			// 饼图数据统计
			easypiechart: function(parent, opts) {
				if (typeof(parent) === 'string') {
					MJJS.load(['easypiechart'], function() {
						var defOpts = {
							barColor: '#43886e',
							trackColor: '#a3e2ca',
							scaleLength: 0,
							lineCap: 'round',
							lineWidth: 5,
							size: 85,
							rotate: 0
						}
						MJJS.ui.optsEach(parent, opts, defOpts, function(e, _opts) {
							$(e).easyPieChart(_opts);
						});
					});
				}
			},
			// 柱状统计图
			flot: function(parent, data, opts, callback) {
				MJJS.load(['flot'], function() {
					if (parent && typeof(callback)==='function') {
						callback($.plot($(parent), data, opts));
					}
				});
			},
			// 表单美化
			icheck: function(parent, cls) {
				MJJS.load(['icheck'], function() {
					if (parent && cls) {
						$(parent).iCheck({
							checkboxClass: 'icheckbox_'+cls,
							radioClass: 'iradio_'+cls,
							increaseArea: '20%'
						});
					}
				});
			},
			// 日历插件
			clndr: function(callback) {
				MJJS.load(['clndr'], function() {
					moment.lang('zh-cn');
					if (typeof(callback) === 'function') callback();
				});
			},
			// iOS7样式开关
			switchery: function(btn, opts) {
				if (typeof(btn) === 'string') {
					MJJS.load(['switchery'], function() {
						MJJS.ui.optsEach(btn, opts, function(e, _opts) {
							var switchery = new Switchery(e, _opts);
							if (typeof(_opts.on)==='function' && typeof(_opts.off)==='function') {
								$(e).on('change', function() {
									var state = $(this)[0].checked;
									return state? _opts.on(switchery): _opts.off(switchery);
								});
							}
						});
					});
				}
			},
			// 多选下拉列表
			multi: function(parent, opts) {
				if (typeof(parent) === 'string') {
					MJJS.load(['quicksearch'], function() {
						MJJS.ui.optsEach(parent, opts, function(e, _opts) {
							if (_opts && _opts.search) {
								var search = {
									selectableHeader: "<input type='text' class='form-control search-input' autocomplete='off' placeholder='search...'>",
									selectionHeader: "<input type='text' class='form-control search-input' autocomplete='off' placeholder='search...'>",
									afterInit: function (ms) {
										var that = this,
											$selectableSearch = that.$selectableUl.prev(),
											$selectionSearch = that.$selectionUl.prev(),
											selectableSearchString = '#' + that.$container.attr('id') + ' .ms-elem-selectable:not(.ms-selected)',
											selectionSearchString = '#' + that.$container.attr('id') + ' .ms-elem-selection.ms-selected';
										that.qs1 = $selectableSearch.quicksearch(selectableSearchString)
											.on('keydown', function (e) {
												if (e.which === 40) {
													that.$selectableUl.focus();
													return false;
												}
											});
										that.qs2 = $selectionSearch.quicksearch(selectionSearchString)
											.on('keydown', function (e) {
												if (e.which == 40) {
													that.$selectionUl.focus();
													return false;
												}
											});
									},
									afterSelect: function () {
										this.qs1.cache();
										this.qs2.cache();
									},
									afterDeselect: function () {
										this.qs1.cache();
										this.qs2.cache();
									}
								}
								_opts = MJJS.ui.objMerge(search, _opts);
							}
							$(e).multiSelect(_opts);
						});
					});
				}
			},
			// 计算
			spinner: function(parent, opts) {
				if (typeof(parent) === 'string') {
					MJJS.load(['spinner'], function() {
						MJJS.ui.optsEach(parent, opts, function(e, _opts) {
							$(e).spinner(_opts);
						});
					});
				}
			},
			// 图片上传
			fileupload: function() {
				MJJS.load(['fileupload'], function() {});
			},
			// 输入标签
			tagsinput: function(parent, opts) {
				if (typeof(parent) === 'string') {
					MJJS.load(['tagsinput'], function() {
						MJJS.ui.optsEach(parent, opts, function(e, _opts) {
							$(e).tagsInput(_opts);
						});
					});
				}
			},
			// 输入过滤
			inputmask: function() {
				MJJS.load(['inputmask'], function() {});
			},
			// 数据报表
			datatable: function(parent, opts) {
				MJJS.load(['mj_datatable'], function() {
					MJJS.ui.custom.datatable(parent, opts);
				});
			},
			// 日期时间选择器
			timepicker: function(parent, opts, callback) {
				if (typeof(parent) === 'string') {
					MJJS.load(['timepicker'], function() {
						MJJS.ui.optsEach(parent, opts, function(e, _opts) {
							$(e).datetimepicker(_opts).on('changeDate', function(ev) {
								if (typeof(_opts.callback)==='function') _opts.callback(ev, $(e));
							});
						});
					});
				}
			},
			// 模块展开闭合
			collapsible: function(switchBtn, time) {
				if (switchBtn) {
					$('#wrapper').on('click', switchBtn, function() {
						var el = $(this).parents('.panel').eq(0).children('.panel-body');
						var downClass = 'fa-chevron-down';
						var upClass   = 'fa-chevron-up';
						var time = time || 200;
						if ($(this).hasClass(downClass)) {
							$(this).removeClass(downClass).addClass(upClass);
							el.stop().slideDown(time);
						} else {
							$(this).removeClass(upClass).addClass(downClass);
							el.stop().slideUp(time);
						}
					});
				}
			},
			// 模块删除
			panelclose: function(btn) {
				if (btn) {
					$('#wrapper').on('click', btn, function() {
						$(this).parents('.panel').eq(0).parent().remove();
					});
				}
			},
			// 列表删除
			listclose: function(btn) {
				if (btn) {
					$('#wrapper').on('click', btn, function() {
						$(this).closest('li').remove();
					});
				}
			},
			// 列表选择
			listselect: function(btn) {
				if (btn) {
					$('#wrapper').on('click', btn, function () {
						$(this).parents('li').eq(0).children('.todo-title').toggleClass('line-through');
					});
				}
			}
		});
		// ----------------------------
		// 页面初始化处理
		MJJS.ui.init = function() {
			MJJS.debug('ui', '开始初始化');
		};
		$(function() {
			MJJS.ui.init();
		});
	})();

	/* MJJS.track */
	(function() {
		// ----------------------------
		MJJS.namespace('MJJS.track');
		$.extend(MJJS.track, {
			// 自动设置相应js的访问源
			scriptPath: (document.location.protocol=='https:') ? '//secure' : '//i0',
			// 统计初始化，默认加载baidu/google
			init: function(options) {
				options = options || {
					baidu: false,
					google: false
				};
				if (options.baidu) this.baidu.init();
				if (options.google) this.google.init();
			},
			// 页面JS文件加载
			loadJS: function(url, isAsync) {
				if (isAsync) {
					MJJS.loader.getRemoteScript(url, { async:true, keepScriptTag:true });
				} else {
					document.write(unescape('%3Cscript type="text/javascript" src="'+ url +'"%3E%3C/script%3E')); 
				}
			},
			baidu: {
				// 百度uid key值
				uid: '8912c189b15a314abfe42da6db4e5b97',
				setUid: function(uid) {
					this.uid = uid;
				},
				// 百度统计初始化, 异步加载时有问题不提交数据
				init: function(uid) {
					MJJS.track.loadJS('//hm.baidu.com/h.js%3F'+ (uid||this.uid));
				}
			},
			google: {
				uid: 'UA-50969958-1',
				domain: 'ule.com',
				setUid: function(uid) {
					this.uid = uid;
				},
				setDomain: function(domain) {
					this.domain = domain;
				},
				// google统计初始化
				init: function(uid, domain) {
					var url = MJJS.track.scriptPath + '.ule.com/googleana/analytics.js';
					(function(i, s, o, g, r, a, m) {
						i['GoogleAnalyticsObject'] = r;
						i[r] = i[r] || function() { (i[r].q = i[r].q || []).push(arguments); }, i[r].l = 1*new Date();
						a = s.createElement(o), m = s.getElementsByTagName(o)[0];
						a.async = 1;
						a.src = g;
						m.parentNode.insertBefore(a, m);
					})(window, document, 'script', url, 'ga');
					ga('create', uid||this.uid, domain||this.domain);
					ga('require', 'displayfeatures');
					ga('send', 'pageview');
				},
				// 发送自定义数据
				// hitType： pageview/event/social/timing
				send: function(hitType, data) {
					window.ga && ga('send', hitType, data);
				},
				initEC: function() {
					window.ga && ga('require', 'ecommerce', 'ecommerce.js');
				},
				sendEC: function(orderData, itemDatas) {
					if (window.ga) {
						// 暂时用tax字段来保存 cartType.payType信息
						if (orderData.metric4 && orderData.metric5) {
							if (!isNaN(orderData.metric4+'.'+orderData.metric5)) {
								orderData.tax = orderData.metric4 +'.'+ orderData.metric5;
							}
						}
						ga('ecommerce:addTransaction', orderData);
						for (var i=0; i<itemDatas.length; i++) {
							ga('ecommerce:addItem', itemDatas[i]);
						}
						ga('ecommerce:send');
					}
				}
			}
		});
	})();

	/* MJJS init */
	(function() {
		var path = '/js/util/';
		// ----------------------------
		MJJS.load.add('nicescroll',   { js: path+'jquery.nicescroll.js' });
		MJJS.load.add('jqueryui',     { js: path+'jquery-ui/jquery-ui.min.js', css: path+'jquery-ui/jquery-ui.min.css' });
		MJJS.load.add('morris',       { js: path+'morris-chart/morris.min.js', css: path+'morris-chart/morris.css' });
		MJJS.load.add('raphael',      { js: path+'morris-chart/raphael-min.js', css: path+'morris-chart/morris.css', requires: 'morris' });
		MJJS.load.add('sparkline',    { js: path+'sparkline/jquery.sparkline.min.js' });
		MJJS.load.add('easypiechart', { js: path+'easypiechart/jquery.easypiechart.min.js' });
		MJJS.load.add('flot',         { js: path+'flot-chart/jquery.flot.js' });
		MJJS.load.add('icheck',       { js: path+'icheck/jquery.icheck.min.js', css: path+'icheck/skins/square/_all.css' });
		MJJS.load.add('underscore',   { js: path+'underscore.min.js' });
		MJJS.load.add('moment',       { js: path+'calendar/moment-2.2.1.min.js', requires: 'underscore' });
		MJJS.load.add('clndr',        { js: path+'calendar/clndr.min.js', css: path+'calendar/clndr.css', requires: 'moment' });
		MJJS.load.add('switchery',    { js: path+'ios-switch/switchery.min.js', css: path+'ios-switch/switchery.min.css' });
		MJJS.load.add('multi',        { js: path+'jquery-multi-select/js/jquery.multi-select.js' });
		MJJS.load.add('quicksearch',  { js: path+'jquery-multi-select/js/jquery.quicksearch.js', css: path+'jquery-multi-select/css/multi-select.css', requires: 'multi' });
		MJJS.load.add('spinner',      { js: path+'fuelux/js/spinner.min.js' });
		MJJS.load.add('fileupload',   { js: path+'bootstrap-fileupload/bootstrap-fileupload.min.js', css: path+'bootstrap-fileupload/bootstrap-fileupload.min.css' });
		MJJS.load.add('tagsinput',    { js: path+'jquery-tags-input/jquery.tagsinput.min.js', css: path+'jquery-tags-input/jquery.tagsinput.css' });
		MJJS.load.add('inputmask',    { js: path+'bootstrap-inputmask/bootstrap-inputmask.min.js' });
		MJJS.load.add('datatable',    { js: path+'advanced-datatable/js/jquery.dataTables.js', css: path+'advanced-datatable/css/demo_table.css' });
		MJJS.load.add('DT',           { js: path+'data-tables/DT_bootstrap.js', css: path+'data-tables/DT_bootstrap.css', requires: 'datatable' });
		MJJS.load.add('mj_datatable', { js: path+'custom/datatable.js', requires: 'DT' });
		MJJS.load.add('timepicker',   { js: path+'bootstrap-datetimepicker/js/bootstrap-datetimepicker.js', css: path+'bootstrap-datetimepicker/css/datetimepicker-custom.css' });
	})();

	(function() {
		MJJS.server = {
			url:'mj.com'
		}
		MJJS.debug('MJJS.js','加载完成');
	})();

})(jQuery, window);