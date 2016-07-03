(function(MJJS, window) {
	MJJS.define('MJJS.common', {
		init: function() {
			this._init();
		},
		_init: function() {
			// 滚动条初始化
			MJJS.ui.nicescroll.init($('html'));
			// 拖动排序初始化
			MJJS.ui.sortable('#sortable-todo');
			// 模块展开闭合
			MJJS.ui.collapsible('.panel .fa-chevron-up, .panel .fa-chevron-down');
			// 模块删除
			MJJS.ui.panelclose('.panel .tools .fa-times');
			// 列表删除
			MJJS.ui.listclose('.todo-remove');
			// 列表选择
			MJJS.ui.listselect('.todo-check label');
			// 表单美化
			MJJS.ui.icheck('.square input', 'square');
			MJJS.ui.icheck('.square-red input', 'square-red');
			MJJS.ui.icheck('.square-green input', 'square-green');
			MJJS.ui.icheck('.square-blue input', 'square-blue');
			MJJS.ui.icheck('.square-yellow input', 'square-yellow');
			MJJS.ui.icheck('.square-purple input', 'square-purple');
		}
	});
	MJJS.common.init();
})(MJJS, window);