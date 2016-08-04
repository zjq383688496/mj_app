(function(MJJS, window) {
	var API = {
		adgroupList: '/ads/getAdgroupList',
		accountInfo: '/home/getHomeReportAccountInfo',
		clickCount:  '/adGroupReport/getAdGroupInfoListByAdGroupId',
		age:         '/home/getHomeReportAgeDistribution',
		gender:      '/home/getHomeReportGenderDistribution',
		maps:        '/home/getHomeReportRegionDistribution',
		budget:      '/home/updatedailyBudget'
	};
	var INDEX = {
		init: function() {
			var me = this;
			this.mergeRequest(function() {
				me._init();
			});
		},
		_init: function() {
			this.adgroupList();
			this.accountInfo();
			this.delivery.init();
			this.distribution.init();
			this.adList.init();
		},
		mergeRequest: function(callback) {
			var me = this;
			var da = {
				token: _USER_.token
			};
			var API_GROUP = {
				adgroupList: ['/ads/getAdgroupList', 'post', da],
				accountInfo: ['/home/getHomeReportAccountInfo', 'get', da],
				age:         ['/home/getHomeReportAgeDistribution', 'get', da],
				gender:      ['/home/getHomeReportGenderDistribution', 'get', da],
				maps:        ['/home/getHomeReportRegionDistribution', 'get', da]
			};
			MJJS.http.merge(API_GROUP, function(o) {
				me._data = o;
				typeof(callback) === 'function' && callback();
			})
		},
		// 获取adgroupId
		adgroupList: function() {
			var o = this._data.adgroupList;
			if (o && o.length) _USER_.adgroup = o[0];
		},
		// 整体数据
		accountInfo: function() {
			var o = this._data.accountInfo;
			for (var p in o) {
				$('#'+p).html(o[p]);
			}
			$('#budget').bind('click', function() {
				var val = ~~($('#dailyBudget').html());
				var msg = ['<form id="budgetForm"><div class="form-group">',
						'<div class="col-sm-4">',
							'<div class="input-group">',
								'<input id="editBudget" name="editbudget" type="text" class="form-control" value="'+val+'">',
								'<span class="input-group-addon">元</span>',
							'</div>',
						'</div>',
					'</div></form>'].join('');
				MJJS.page.dialog.show({
					title: '修改投放限额',
					message: msg,
					btn_1_name: '提交',
					load: function() {
						MJJS.form.validator('#budgetForm', {
							fields: {
								editbudget: {
									validators: {
										notEmpty: {
											message: '请输入不小于 50 的数值'
										},
										between: {
											min: 50,
											max: 400000,
											message: '请输入不小于 50 的数值'
										}
									}
								}
							}
						});
					},
					confirm: function(dialog) {
						var input = $('#editBudget');
						var newVal = ~~(input.val());
						var diff = Math.abs(newVal-val);
						if (diff > 50) {
							MJJS.http.post(API.budget, {
								token: _USER_.token,
								advertiserId: _USER_.advertiserId,
								dailyBudget: newVal
							}, function() {
								$('#dailyBudget').html(newVal);
								dialog.close();
							}, function(err) {
								MJJS.page.toaster.danger(err.message);
							});
						} else {
							MJJS.page.toaster.danger('修改金额幅度必须大于50元');
						}
					}
				})
			});
		},
		// 投放数据
		delivery: {
			init: function() {
				var me = this;

				this.count(function() {
					me.$select1 = $('#deliverySelect1');
					me.$select2 = $('#deliverySelect2');

					me.highcharts(function(chart) {
						me.render(me.$select1);
						me.render(me.$select2);
						me.select(0, 0, chart);
						me.select(1, 1, chart);
						me.bindEvent(chart);
					});
				});
			},
			// 过去7天数据
			count: function(callback) {
				var me = this;
				var da = {
					selectDateType: 2,
					adgroupId: _USER_.adgroup.adgroupId,
					token: _USER_.token,
					startDate: new Date().dateAdd('d', -7).format('yyyy-mm-dd'),
					endDate: new Date().dateAdd('d', -1).format('yyyy-mm-dd')
				};
				MJJS.http.get(API.clickCount, da, function(o) {
					var li = o.list;
					var len = li.length;
					if (len) {
						for (var i = 1; i < len; i++) {
							me.data[0].push(li[i].impression);
							me.data[1].push(li[i].click);
							me.data[2].push(li[i].ctr);
							me.data[3].push(li[i].cpc);
							me.data[4].push(li[i].cost);
						}
						console.log(li[0]);
						typeof(callback) === 'function' && callback();
						$('#delivery').removeClass('hide');
					}
				});
			},
			highcharts: function(callback) {
				MJJS.ui.highcharts('#delivery-container', {
					anime: true,
					y: [{}, {}],
					x: {
						data: new Array(7).fill().map(function(_, __) { return new Date().dateAdd('d', __-7).format('yyyy-mm-dd') })
					},
					data: [{}, {}],
					load: function(d) {
						var chart = $('#delivery-container').highcharts();
						callback(chart);
					}
				});
			},
			data: {
				0: [],
				1: [],
				2: [],
				3: [],
				4: []
			},
			name: [
				[0, '曝光量'],
				[1, '点击量'],
				[2, '点击率 (%)'],
				[3, '点击单价'],
				[4, '广告消耗']
			],
			bindEvent: function(chart) {
				var me = this;
				this.$select1.on('change', function() {
					me.select(0, $(this).val(), chart);
				});

				this.$select2.on('change', function() {
					me.select(1, $(this).val(), chart);
				});
			},
			render: function(sel) {
				var id = sel.attr('id');
				var name = this.name;
				var opts = [];
				$.each(name, function(i, e) {
					opts.push('<option value="'+e[0]+'">'+e[1]+'</option>');
				});
				sel.html(opts.join(''))
			},
			select: function(num, val, chart) {
				var data = this.data[val];
				var name = this.name[val][1];
				var title = { text: name };
				var dom =  $('#deliverySelect'+(num+1));
				var dom2 = $('#deliverySelect'+(num==0? 2: 1));
				var val2 = dom2.val();
				dom.val(val);
				if (val == 2) {
					title.min = 0;
					title.max = 100;
				}
				chart.series[num].update({
					data: data,
					name: name
				});
				chart.yAxis[num].update({ title: title });
				if (val == val2) {
					chart.series[1].update({ visible: false });
				} else {
					chart.series[1].update({ visible: true });
				}
			}
		},
		// 受众分布
		distribution: {
			init: function() {
				this.da = {
					token: _USER_.token
				};
				this.age();
				this.gender();
				this.map();
			},
			// 年龄
			age: function() {
				var o = INDEX._data.age;
				var li = o.list;
				var age = new Array(li.length).fill().map(function(_, __) { return li[__].impression });
				MJJS.ui.highcharts('#age-container', {
					type: 'column',
					title: '年龄分布',
					y: [{
						min: 0,
						title: '年龄分布',
					}],
					x: {
						data: ['10岁及以下', '11-20岁', '21-30岁', '31-40岁', '41-50岁', '51-60岁']
					},
					tooltipTitle: '<b>{x}</b><br>',
					tooltip: '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y}</b><br/>',
					data: [{
						name: '年龄段',
						color: '#19b2ff',
						data: age
					}]
				});
			},
			// 性别
			gender: function() {
				var o = INDEX._data.gender;
				MJJS.ui.highcharts('#gender-container', {
					type: 'column',
					title: '性别分布',
					y: [{
						min: 0,
						max: 100,
						title: '性别分布百分比 (%)'
					}],
					x: {
						data: ['男', '女']
					},
					tooltipTitle: '<b>性别</b><br>',
					tooltip: '<span style="color:{point.color}">●<b> {x}: {point.y} %</b></span><br/>',
					data: [{
						name: '性别',
						data: [{
							name: '男',
							color: '#19b2ff',
							y: o.list[1].impression
						}, {
							name: '女',
							color: '#f05050',
							y: o.list[0].impression
						}]
					}]
				});
			},
			// 地域
			map: function() {
				var o = INDEX._data.maps;
				$.each(o, function(i, e) {
					e.name = e.regionName.replace(/[省|市|区]/g, '');
					e.value = e.impression;
					//e.value = $.randomInt(0, 10000);
				});
				MJJS.ui.echarts('#map-container', {
					title: '地域分布',
					data: [
						{
							regionName: '人数',
							data: o
						}
					]
				});
			}
		},
		// 广告组列表
		adList: {
			init: function() {
				//this.datatable();
			},
			datatable: function() {
				MJJS.ui.datatable('#adv-list', {
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
								type: 'input',
								key: 'input',
								placeholder: '广告组ID 或 名称',
								columns: 2
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
						url: 'http://localhost:8081/mjad/datatable'
					}
				});
			}
		}
	}
	INDEX.init();

})(MJJS, window);