interact_bar = {
        window.chartColors = {
            red: 'rgb(255, 99, 132)',
            orange: 'rgb(255, 159, 64)',
            yellow: 'rgb(255, 205, 86)',
            green: 'rgb(75, 192, 192)',
            blue: 'rgb(54, 162, 235)',
            purple: 'rgb(153, 102, 255)',
            grey: 'rgb(201, 203, 207)'
        };
        
        (function(global) {
            var MONTHS = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
            ];

            var COLORS = [
                '#4dc9f6',
                '#f67019',
                '#f53794',
                '#537bc4',
                '#acc236',
                '#166a8f',
                '#00a950',
                '#58595b',
                '#8549ba'
            ];

            var Samples = global.Samples || (global.Samples = {});
            var Color = global.Color;

            Samples.utils = {
                // Adapted from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
                srand: function(seed) {
                    this._seed = seed;
                },

                rand: function(min, max) {
                    var seed = this._seed;
                    min = min === undefined ? 0 : min;
                    max = max === undefined ? 1 : max;
                    this._seed = (seed * 9301 + 49297) % 233280;
                    return min + (this._seed / 233280) * (max - min);
                },

                numbers: function(config) {
                    // the || operand will treat 0 as False
                    // thus if the left hand side becomes 0 below, 
                    // null, NaN, 0, '', undefined
                    var cfg = config || {};
                    var min = cfg.min || 0;
                    var max = cfg.max || 1;
                    var from = cfg.from || [];
                    var count = cfg.count || 8;
                    var decimals = cfg.decimals || 8;
                    var continuity = cfg.continuity || 1;
                    var dfactor = Math.pow(10, decimals) || 0;
                    var data = [];
                    var i, value;

                    for (i = 0; i < count; ++i) {
                        value = (from[i] || 0) + this.rand(min, max);
                        if (this.rand() <= continuity) {
                            data.push(Math.round(dfactor * value) / dfactor);
                        } else {
                            data.push(null);
                        }
                    }

                    return data;
                },

                labels: function(config) {
                    var cfg = config || {};
                    var min = cfg.min || 0;
                    var max = cfg.max || 100;
                    var count = cfg.count || 8;
                    var step = (max - min) / count;
                    var decimals = cfg.decimals || 8;
                    var dfactor = Math.pow(10, decimals) || 0;
                    var prefix = cfg.prefix || '';
                    var values = [];
                    var i;

                    for (i = min; i < max; i += step) {
                        values.push(prefix + Math.round(dfactor * i) / dfactor);
                    }

                    return values;
                },

                months: function(config) {
                    var cfg = config || {};
                    var count = cfg.count || 12;
                    var section = cfg.section;
                    var values = [];
                    var i, value;

                    for (i = 0; i < count; ++i) {
                        value = MONTHS[Math.ceil(i) % 12];
                        values.push(value.substring(0, section));
                    }

                    return values;
                },

                color: function(index) {
                    return COLORS[index % COLORS.length];
                },

                transparentize: function(color, opacity) {
                    var alpha = opacity === undefined ? 0.5 : 1 - opacity;
                    return Color(color).alpha(alpha).rgbString();
                }
            };

            // // DEPRECATED
            // window.randomScalingFactor = function() {
            //     return Math.round(Samples.utils.rand(-100, 100));
            // };

            // INITIALIZATION

            Samples.utils.srand(Date.now());


        }(this));

		var DATA_COUNT = 16;

		var utils = Samples.utils;

		utils.srand(110);

		function colorize(opaque, ctx) {
			var v = ctx.dataset.data[ctx.dataIndex];
			var c = v < -50 ? '#D60000'
				: v < 0 ? '#F46300'
				: v < 50 ? '#0358B6'
				: '#44DE28';

			return opaque ? c : utils.transparentize(c, 1 - Math.abs(v / 150));
		}

		function generateData() {
			return utils.numbers({
				count: DATA_COUNT,
				min: -100,
				max: 100
			});
		}

		var data = {
			labels: utils.months({count: DATA_COUNT}),
			datasets: [{
				data: generateData()
			}]
		};

		var options = {
			legend: false,
			tooltips: false,
			elements: {
				rectangle: {
					backgroundColor: colorize.bind(null, false),
					borderColor: colorize.bind(null, true),
					borderWidth: 2
				}
			}
		};
        document.getElementById('inter_bar').getContext('2d');
		var chart = new Chart('chart-0', {
			type: 'bar',
			data: data,
			options: options
		});

		// eslint-disable-next-line no-unused-vars
		function randomize() {
			chart.data.datasets.forEach(function(dataset) {
				dataset.data = generateData();
			});
			chart.update();
		}

		// eslint-disable-next-line no-unused-vars
		function addDataset() {
			chart.data.datasets.push({
				data: generateData()
			});
			chart.update();
		}

		// eslint-disable-next-line no-unused-vars
		function removeDataset() {
			chart.data.datasets.shift();
			chart.update();
        }
    }