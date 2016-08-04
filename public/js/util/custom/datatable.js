(function($, window, undefined) {
	"use strict";

	var mj_dataTable = function(parent, opts) {
		this.init(parent, opts);
	}
	$.extend(mj_dataTable.prototype, {
		init: function(parent, opts) {
			this.__._ID_ = 'MJ_'+this.random()+'_';

			this.analysis.init(parent, opts.params);
			this.bindEvent.init();
			this.datatable.init(parent, opts.datatable);
		},
		__: {
			_select_:      [],
			_input_:       [],
			_inputSelect_: [],
			_inputDate_:   []
		},
		random: function() {
			return ''+Math.round(Math.random()*12345*Math.random()*67890);
		},
		// DOM模板
		temp: {
			parent: '<div class="adv-search">{row}</div>',
			row: '<div class="row">{col}</div>',
			col: '<div class="col-sm-{columns}">{content}</div>',
			select: {
				parent: '<select id="{ID}" class="form-control m-bot15" value="{defaultValue}" data-key="{key}" data-reload="{reload}">{option}</select>',
				option: '<option value="{value}">{name}</option>'
			},
			label: '<div class="form-group m-bot15 clearfix form-horizontal text-{dir}"><label class="control-label">{name}</label></div>',
			input: '<div class="form-group m-bot15 clearfix"><input id="{ID}" type="text" class="form-control" placeholder="{placeholder}" data-key=\'{key}\'></div>',
			inputSelect: {
				parent: [
					'<div class="input-group m-bot15">',
						'{select_left}',
						'<input type="text" class="form-control" placeholder="{defaultName}">',
						'{select_right}',
					'</div>'
				].join(''),
				select: [
					'<div class="input-group-btn">',
						'<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"><span id="{ID}" data-key="{defaultKey}">{defaultName}</span> <span class="caret"></span></button>',
						'<ul class="dropdown-menu">',
							'{option}',
						'</ul>',
					'</div>'
				].join(''),
				option: '<li><a key="{key}">{name}</a></li>'
			},
			inputDate: [
				'<div id="{ID}" class="form_datetime input-group date m-bot15" data-key="{key}" data-opts="{opts}">',
					'<input type="text" class="form-control" readonly placeholder="{placeholder}">',
					'<span class="input-group-btn">',
						'<button type="button" class="btn btn-success date-set"><i class="fa fa-calendar"></i></button>',
					'</span>',
				'</div>'
				].join('')
		},
		// 模块解析
		analysis: {
			init: function(parent, opts) {
				if (typeof(parent) === 'string') {
					var temp = this.parent(opts);
					$(parent).parents('.adv-table').eq(0).prepend(temp);
				}
			},
			parent: function(opts) {
				var temp = mj_dataTable.prototype.temp;
				var _str = [''];
				if (opts && opts.length) {
					var len = opts.length;
					_str = [];
					for (var i = 0; i < len; i++) {
						_str.push(this.row(opts[i]));
					}
				}
				var parent = temp.parent.substitute({ row: _str.join('') });
				return parent;
			},
			row: function(opts) {
				var temp = mj_dataTable.prototype.temp;
				var _str  = [''];
				if (opts && opts.length) {
					var len = opts.length;
					_str = [];
					for (var i = 0; i < len; i++) {
						_str.push(this.col(opts[i]));
					}
				}
				return temp.row.substitute({ col: _str.join('') });
			},
			col: function(opts) {
				var temp    = mj_dataTable.prototype.temp;
				var content = this[opts.type]? this[opts.type](opts, temp[opts.type]): '';
				var col     = temp.col.substitute({
					columns: opts.columns,
					content: content
				});
				return col;
			},
			each: function(option, temp) {
				var _option = [''];
				if (option && option.length) {
					var len = option.length;
					_option = [];
					for (var i = 0; i < len; i++) {
						_option.push(temp.substitute(option[i]));
					}
				}
				return _option.join('');
			},
			label: function(opts, temp) {
				opts.dir = opts.dir? opts.dir: 'left';
				return temp.substitute(opts);
			},
			select: function(opts, temp) {
				var me = mj_dataTable.prototype;
				var ID = me.__._ID_+me.random();
				var option = this.each(opts.option, temp.option);
				me.__._select_.push(ID);
				return temp.parent.substitute({
					ID: ID,
					key: opts.key,
					reload: opts.reload === 0? 0: 1,
					defaultValue: opts.option[0].value,
					option: option
				});
			},
			input: function(opts, temp) {
				var me = mj_dataTable.prototype;
				var ID = me.__._ID_+me.random();
				opts.ID = ID;
				me.__._input_.push(ID);
				return temp.substitute(opts);
			},
			inputSelect: function(opts, temp) {
				var me  = mj_dataTable.prototype;
				var ID  = me.__._ID_+me.random();
				var dir = {
					defaultName: opts.option[0].name || ''
				};
				var option = this.each(opts.option, temp.option);
				var select = temp.select.substitute({
					ID: ID,
					defaultName: opts.option[0].name,
					defaultKey: opts.option[0].key,
					option: option
				});
				dir['select_' + (opts.dir || 'left')] = select;
				me.__._inputSelect_.push(ID);
				return temp.parent.substitute(dir);
			},
			inputDate: function(opts, temp) {
				var me = mj_dataTable.prototype;
				var ID = me.__._ID_+me.random();
				opts.ID = ID;
				opts.opts = MJJS.json.stringify(opts.opts).replace(/\"/g, '\'');
				me.__._inputDate_.push(ID);
				return temp.substitute(opts);
			}
		},
		// 事件绑定
		bindEvent: {
			init: function() {
				this.select();
				this.input();
				this.inputSelect();
				this.inputDate();
			},
			select: function() {
				var me = mj_dataTable.prototype;
				var id = me.__._select_;
				$.each(id, function(i, e) {
					var _ = $('#'+e);
					var reload = ~~(_.attr('data-reload'));
					if (reload) {
						_.on('change', function() {
							me.__._oTable_._fnAjaxUpdate();
						});
					}
				});
			},
			input: function() {
				// var me = mj_dataTable.prototype;
				// var id = me.__._input_;
			},
			inputSelect: function() {
				var me = mj_dataTable.prototype;
				var id = me.__._inputSelect_;
				$.each(id, function(i, e) {
					var _ = $('#'+e);
					var parent = _.parents('.input-group').eq(0);
					var opts   = parent.find('a');
					var ipt    = parent.find('input');
					opts.on('click', function() {
						var name = $(this).text();
						_.html(name);
						ipt.attr({ placeholder: name });
					});
				});
			},
			inputDate: function() {
				var me = mj_dataTable.prototype;
				var id = me.__._inputDate_;
				if (id.length) {
					MJJS.load(['timepicker'], function() {
						$.each(id, function(i, e) {
							var _ = $('#'+e);
							MJJS.ui.timepicker('#'+e, {
								callback: function() {
									me.__._oTable_._fnAjaxUpdate();
								}
							});
						});
					});
				}
			}
		},
		datatable: {
			init: function(parent, opts) {
				if (!opts.url || typeof(parent) !== 'string') return;
				var me     = mj_dataTable.prototype;
				var _this  = this;
				var url    = opts.url;
				var type   = opts.type || 'GET';
				var isArray =  opts.isArray || false;
				var data   = {
					searching: false,
					processing: true,
					serverSide: true,
					bLengthChange: false,
					pageLength: opts.pageLength || 10,
					ajax: {
						url: url,
						type: type,
						data: function(d) {
							_this.select(d);
							_this.input(d);
							_this.inputSelect(d);
							_this.inputDate(d);
						}
					},
					language: {
						oPaginate: {
							sPrevious: '',
							sNext: ''
						}
					}
				};
				if (!isArray && opts.columns) {
					data.columns = this.columns(opts.columns);
					data.columnDefs = this.columnDefs(opts.columnDefs);
				}
				me.__._oTable_ = $(parent)
				.on('init.dt', function () {
					me.__._oTable_.removeAttr('style');
					if (typeof(opts.load) === 'function') opts.load(me.__._oTable_);
				})
				.dataTable(data);
			},
			columns: function(columns) {
				if (columns && columns.length) {
					var len = columns.length;
					var arr = [];
					$.each(columns, function(i, e) {
						arr.push({ data: e });
					});
					return arr;
				}
			},
			columnDefs: function(columns) {
				if (columns && columns.length) {
					var len = columns.length;
					var arr = [];
					$.each(columns, function(i, e) {
						//arr.push({ data: e });
						arr.push({
							targets: e.index,
							render: function (data, type, full) {
								return e.temp.substitute(full);
							}
						});
					});
					return arr;
				}
			},
			select: function(d) {
				var me = mj_dataTable.prototype;
				var id = me.__._select_;
				$.each(id, function(i, e) {
					var _ = $('#'+e);
					d[_.attr('data-key')] = _.val();
				});
			},
			input: function(d) {
				var me = mj_dataTable.prototype;
				var id = me.__._input_;
				$.each(id, function(i, e) {
					var _ = $('#'+e);
					d[_.attr('data-key')] = _.val();
					_.on('keydown', function(event) {
						var code = event.keyCode || evt.which;
						if (code === 13) {
							me.__._oTable_._fnAjaxUpdate();
						}
					});
				});
			},
			inputSelect: function(d) {
				var me = mj_dataTable.prototype;
				var id = me.__._inputSelect_;
				$.each(id, function(i, e) {
					var _ = $('#'+e);
					var parent = _.parents('.input-group').eq(0);
					var ipt    = parent.find('input');
					d[_.attr('data-key')] = ipt.val();
					ipt.on('keydown', function(event) {
						var code = event.keyCode || evt.which;
						if (code === 13) {
							me.__._oTable_._fnAjaxUpdate();
						}
					});
				});
			},
			inputDate: function(d) {
				var me = mj_dataTable.prototype;
				var id = me.__._inputDate_;
				$.each(id, function(i, e) {
					var _ = $('#'+e);
					var ipt    = _.find('input');
					d[_.attr('data-key')] = ipt.val();
				});
			}
		}
	});

	MJJS.define('MJJS.ui.custom.datatable', function (parent, opts) {
		new mj_dataTable(parent, opts);
	});

})(jQuery, window);