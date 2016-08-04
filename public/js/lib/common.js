(function(MJJS, window) {
	MJJS.define('MJJS.common', {
		init: function() {
			this._init();
		},
		_init: function() {
			// 滚动条初始化
			MJJS.ui.nicescroll.init('html');
			MJJS.ui.nicescroll.init('.left-side');
			if ($('body').hasClass('left-side-collapsed')) {
				MJJS.ui.nicescroll.hide('.left-side');
			}
			MJJS.ui.nicescroll.hide('.left-side');
			// 拖动排序初始化
			MJJS.ui.sortable('#sortable-todo');
			// 模块展开闭合
			MJJS.page.collapsible('.panel .fa-chevron-up, .panel .fa-chevron-down');
			// 模块删除
			MJJS.page.panelclose('.panel .tools .fa-times');
			// 列表删除
			MJJS.page.listclose('.todo-remove');
			// 列表选择
			MJJS.page.listselect('.todo-check label');
			// 表单美化
			MJJS.ui.icheck('.square input', 'square');
			MJJS.ui.icheck('.square-red input', 'square-red');
			MJJS.ui.icheck('.square-green input', 'square-green');
			MJJS.ui.icheck('.square-blue input', 'square-blue');
			MJJS.ui.icheck('.square-yellow input', 'square-yellow');
			MJJS.ui.icheck('.square-purple input', 'square-purple');

			$('.tooltips').tooltip();
			$('.popovers').popover();

			// Menu Toggle
			$('.toggle-btn').click(function(){
				MJJS.ui.nicescroll.hide('.left-side');
				if ($('body').hasClass('left-side-collapsed')) {
					MJJS.ui.nicescroll.hide('.left-side');
				}
				var body = $('body');
				var bodyposition = body.css('position');

				if (bodyposition != 'relative') {
					if (!body.hasClass('left-side-collapsed')) {
						body.addClass('left-side-collapsed');
						$('.custom-nav ul').attr('style','');
						$(this).addClass('menu-collapsed');
					} else {
						body.removeClass('left-side-collapsed chat-view');
						$('.custom-nav li.active ul').css({display: 'block'});
						$(this).removeClass('menu-collapsed');
					}
				} else {
					if(body.hasClass('left-side-show')) body.removeClass('left-side-show');
					else body.addClass('left-side-show');
					mainContentHeightAdjust();
				}
			});
		}
	});
	MJJS.define('MJJS.http', {
		ajax: function(type, url, data, success, error) {
			var _data, _success, _error;
			if (typeof(data)==='function') {
				_data    = {};
				_success = data;
				_error   = success;
			} else {
				_data    = data;
				_success = success;
				_error   = error;
			}
			$.ajax({
				url: MJJS.server.api + (url || ''),
				data: _data,
				type: type,
				success: function(d) {
					if (d.code==='0000') {
						if (typeof(_success)==='function') _success(d.data);
					} else {
						if (typeof(_error)==='function') _error(d);
					}
				},
				error: function(err) {
					if (typeof(_error)==='function') _error(err);
				}
			});
		},
		get: function(url, data, success, error) {
			this.ajax('get', url, data, success, error);
		},
		post: function(url, data, success, error) {
			this.ajax('post', url, data, success, error);
		},
		merge: function(data, success, error) {
			$.ajax({
				url: MJJS.server.api_merge,
				data: data,
				type: 'post',
				success: function(o) {
					if (o) {
						for (var i in o) {
							var p = o[i];
							if (p.code === '0000') o[i] = p.data
							else o[i] = null;
						}
						typeof(success) === 'function' && success(o);
					}
				},
				error: function(o) {
					typeof(error) === 'function' && error(o);
				}
			});
		}
	});
	MJJS.common.init();
})(MJJS, window);