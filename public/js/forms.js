(function(MJJS, window) {
	var FORMS = {
		init: function() {
			this._init();
		},
		_init: function() {
			// iOS7样式开关
			MJJS.ui.switchery('.js-switch', {
				on: function(ipt) {
				},
				off: function(ipt) {

				}
			});
			// 多选下拉列表
			MJJS.ui.multi('#my_multi_select1, #my_multi_select2, #my_multi_select3');
			// 计算
			MJJS.ui.spinner('#spinner1, #spinner2, #spinner3, #spinner4');
			// 图片上传
			MJJS.ui.fileupload();
			// 输入标签
			MJJS.ui.tagsinput('#tags_1, #tags_2');
			// 输入过滤
			MJJS.ui.inputmask();
			// 数据报表
			MJJS.ui.datatable('#dynamic-table', {
				params: [
					[
					{
						type: 'select',
						key: 'status',
						columns: 2,
						option: [
							{
								name: '全部状态',
								value: 0
							},
							{
								name: '待审核',
								value: 1
							},
							{
								name: '审核通过',
								value: 2
							},
							{
								name: '审核拒绝',
								value: 3
							}
						]
					},
					{
						type: 'inputSelect',
						key: 'type',
						dir: 'right',
						columns: 3,
						option: [
							{
								name: '广告主ID',
								key: 'adman_id'
							},
							{
								name: '广告主名称',
								key: 'adman_name'
							}
						]
					}
					],
					[
					{
						type: 'select',
						key: 'status2',
						columns: 3,
						option: [
							{
								name: '全部状态',
								value: 0
							},
							{
								name: '待审核',
								value: 1
							},
							{
								name: '审核通过',
								value: 2
							},
							{
								name: '审核拒绝',
								value: 3
							}
						]
					},
					{
						type: 'inputSelect',
						key: 'type2',
						columns: 3,
						option: [
							{
								name: '广告组ID',
								key: 'adgloup_id'
							},
							{
								name: '广告组名称',
								key: 'adgloup_name'
							}
						]
					}
					]
				],
				datatable: {
					// 是否为纯数组, 默认false
					// data 数据实例
					// true:  [["jimmy"], ["zjq"]]
					// false: [{ name: "jimmy" }, { name: "zjq" }]
					isArray: false,
					// 列表排序 (isArray必须为false)
					columns: [
						'engin',
						'browser',
						'platform',
						'version',
						'css'
					],
					// 列表渲染 (isArray必须为false)
					columnDefs: [
						{
							index: 0,
							temp: '<a title="{engin}" href="{css}">{version}</a>'
						}
					],
					load: function(table) {
						setTimeout(function() {
							table._fnAjaxUpdate();
						}, 3000);
					},
					url: 'http://localhost:8080/mjad/datatable'
				}
			});
			// 日期时间选择器
			MJJS.ui.timepicker('.form_datetime', {
				startDate: '2016-7-2',
				endDate: '2016-7-10',
				initialDate: '2016-7-10',
				callback: function(ev, dom) {
					dom.datetimepicker('setEndDate', null);
				}
			});
		}
	}
	FORMS.init();
})(MJJS, window);