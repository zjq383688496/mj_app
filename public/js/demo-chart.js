(function(MJJS, window) {
	var CHART = {
		init: function() {
			this._init();
		},
		_init: function() {
			MJJS.ui.highcharts('#visitors-container', {
				type: 'area',
				title: 'wahaha',
				subtitle: 'jimmy',
				y: [{
					title: 'zjq'
				}],
				tooltip: '{series.name} X: {x} | Y: {y}',
				legend: {
					layout: 'y',
					x: 3,
					y: 2
				},
				data: [{
					name: 'Online User',
					data: new Array(30).fill().map(function(_, __) { return __['randomInt'](5000, 10000) })
				}, {
					name: 'Page View',
					data: new Array(30).fill().map(function(_, __) { return __['randomInt'](4000, 8000) })
				}]
			});
			MJJS.ui.highcharts('#visitors-chartContainer2', {
				//type: 'line',
				y: [{
					title: '温度',
					format: '{value}C°'
				}, {
					title: '点击率',
					format: '{value}%',
					min: 0,
					max: 100
				}],
				tooltipTitle: '详情:<br>',
				tooltip: [
					'{series.name}: {y}C°<br>',
					'{series.name}: {y}%'
				],
				data: [{
					name: '温度',
					data: new Array(30).fill().map(function(_, __) { return __['randomInt'](500, 1000) })
				}, {
					name: '点击率',
					data: new Array(30).fill().map(function(_, __) { return __['randomInt'](0, 100) })
				}]
			});
			var arrMax = 300;
			var series = [{
					name: 'Online User',
					data: new Array(arrMax).fill().map(function(_, __) {
						return __['randomInt'](0, 100)
					})
				}]
			MJJS.ui.highcharts('#reatltime-chartContainer', {
				type: 'area',
				//amime: true,
				load: function(d) {
					var s0 = d.series[0];
					setInterval(function() {
						s0.removePoint();
						s0.addPoint(5['randomInt'](0, 60));
					}, 200);
				},
				tooltip: '{series.name} | X:{x}',
				y: [{}],
				legend: {
					layout: 'v',
					x: 3,
					y: 1
				},
				data: series
			});

			MJJS.ui.highcharts('#pie-chartContainer', {
				type: 'pie',
				pieInner: '50%',
				tooltip: '{key}: {y}',
				events: {
					click: function(d) {
						console.log(d)
					}
				},
				data: [
					{
						name: 'Paid Signup',
						y: 60,
						color: '#424f63'
					},
					{
						name: 'Free Signup',
						y: 30,
						color: '#65cea7'
					},
					{
						name: 'Guest Signup',
						y: 10,
						color: '#869cb3'
					}
				]
			});

			MJJS.ui.highcharts('#pie-donutContainer', {
				type: 'pie',
				tooltip: '{key}: {y}',
				//pieInner: '50%',
				data: [
					{
						name: 'Premium Member',
						y: 40,
						color: '#869cb3'
					},
					{
						name: 'Gold Member',
						y: 20,
						color: '#6dc5a3'
					},
					{
						name: 'Platinum Member',
						y: 10,
						color: '#778a9f'
					},
					{
						name: 'Silver Member',
						y: 30,
						color: '#FF6C60'
					}
				]
			});

			MJJS.page.wizard('#stepForm', {
				button: [
					{
						click: function(d) {
							console.log(d);
						},
						validation: function() {
							return true
						}
					},
					{
						click: function(d) {
							console.log(d);
						},
						validation: function() {
							return true
						}
					},
					{
						click: function(d) {
							console.log(d);
						},
						validation: function() {
							return true
						}
					}
				],
				callback: function() {
					alert('finish');
				}
			});

		}
	}
	CHART.init();
})(MJJS, window);