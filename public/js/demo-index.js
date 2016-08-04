(function(MJJS, window) {
	var INDEX = {
		init: function() {
			this._init();
		},
		_init: function() {
			// 生成线状图
			MJJS.ui.sparkline('#p-lead-1', [5,6,7,9,9,5,3,2,4,6,7,5,6,8,7,9]);
			MJJS.ui.sparkline('#visit-1', [5,6,7,9,9,5,3,2,4,6,7,5,6,8,7,9,5]);
			// 饼图数据统计
			MJJS.ui.easypiechart('.chart');
			// 图表显示控件
			MJJS.ui.raphael('Donut', {
				element: 'graph-donut',
				data: [
					{value: 40, label: 'New Visit', formatted: 'at least 70%' },
					{value: 30, label: 'Unique Visits', formatted: 'approx. 15%' },
					{value: 20, label: 'Bounce Rate', formatted: 'approx. 10%' },
					{value: 10, label: 'Up Time', formatted: 'at most 99.99%' }
				],
				backgroundColor: false,
				labelColor: '#fff',
				colors: [
					'#4acacb','#6a8bc0','#5ab6df','#fe8676'
				],
				formatter: function (x, data) { return data.formatted; }
			});

			this.flot();
			this.clndr();
			MJJS.ui.icheck();
		},
		flot: function() {
			var d1 = [
				[0, 501],
				[1, 620],
				[2, 437],
				[3, 361],
				[4, 549],
				[5, 618],
				[6, 570],
				[7, 758],
				[8, 658],
				[9, 538],
				[10, 488]
			];
			var d2 = [
				[0, 401],
				[1, 520],
				[2, 337],
				[3, 261],
				[4, 449],
				[5, 518],
				[6, 470],
				[7, 658],
				[8, 558],
				[9, 438],
				[10, 388]
			];
			var da1 = {
				label: "New Visitors",
				data: d1,
				lines: {
					show: true,
					fill: true,
					fillColor: {
						colors: ["rgba(255,255,255,.4)", "rgba(183,236,240,.4)"]
					}
				}
			};
			var da2 = {
				label: "Unique Visitors",
				data: d2,
				lines: {
					show: true,
					fill: true,
					fillColor: {
						colors: ["rgba(255,255,255,.0)", "rgba(253,96,91,.7)"]
					}
				}
			};

			var data = ([da1, da2]);
			var opts = {
				grid: {
					backgroundColor:
					{
						colors: ["#ffffff", "#f4f4f6"]
					},
					hoverable: true,
					clickable: true,
					tickColor: "#eeeeee",
					borderWidth: 1,
					borderColor: "#eeeeee"
				},
				// Tooltip
				tooltip: true,
				tooltipOpts: {
					content: "%s X: %x Y: %y",
					shifts: {
						x: -60,
						y: 25
					},
					defaultTheme: false
				},
				legend: {
					labelBoxBorderColor: "#000000",
					container: $("#main-chart-legend"), //remove to show in the chart
					noColumns: 0
				},
				series: {
					stack: true,
					shadowSize: 0,
					highlightColor: 'rgba(000,000,000,.2)'
				},
				points: {
					show: true,
					radius: 3,
					symbol: "circle"
				},
				colors: ["#5abcdf", "#ff8673"]
			};
			var plot;
			MJJS.ui.flot('#main-chart-container', data, opts, function(d) {
				plot = d;
				setTimeout(function () {
					data = ([da1]);
					MJJS.ui.flot('#main-chart-container', data, opts, function(d) {
						plot = d;
					});
				}, 2000);
			});
		},
		clndr: function() {
			MJJS.ui.clndr(function() {
				var calendars = INDEX.calendars = {};
				calendars.clndr1 = $('.cal1').clndr({
					constraints: {
					  startDate: '2016-06-01',
					  endDate: '2017-06-15'
					},
					multiDayEvents: {
						startDate: 'startDate',
						endDate: 'endDate'
					},
					showAdjacentMonths: true,
					adjacentDaysChangeMonth: false
				});
			});
		}
	}
	INDEX.init();
})(MJJS, window);