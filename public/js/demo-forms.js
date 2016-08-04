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
							columns: 4,
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
							dir: 'right',
							columns: 4,
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
							type: 'input',
							key: 'input',
							placeholder: '搜索...',
							columns: 2
						},
						{
							type: 'label',
							name: '开始时间',
							dir: 'right',
							columns: 1
						},
						{
							type: 'inputDate',
							key: 'startData',
							columns: 2,
							opts: {
								'initialDate': new Date().format('yyyy-mm-dd')
							}
						},
						{
							type: 'label',
							name: '结束时间',
							dir: 'right',
							columns: 1
						},
						{
							type: 'inputDate',
							key: 'endDate',
							columns: 2,
							opts: {
								initialDate: new Date().dateAdd('d', 1).format('yyyy-mm-dd'),
								startDate: new Date().dateAdd('d', 1).format('yyyy-mm-dd')
							}
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
						'engine',
						'browser',
						'platform',
						'version',
						'css'
					],
					// 列表渲染 (isArray必须为false)
					columnDefs: [
						{
							index: 0,
							temp: '<a title="{engine}" href="{css}">{engine}</a>'
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
			MJJS.ui.timepicker('#formDatetime', {
				startDate: '2016-7-2',
				endDate: '2016-7-10',
				initialDate: '2016-7-10',
				callback: function(ev, dom) {
					console.log(ev.date.format('yyyy-mm-dd'));
					dom.datetimepicker('setEndDate', null);
				}
			});
		}
	}
	FORMS.init();
})(MJJS, window);