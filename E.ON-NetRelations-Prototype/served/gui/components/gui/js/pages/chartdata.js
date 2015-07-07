var chartColors = ["#c21c35","#f3341b","#9d2168","#bd3578","#7a4988","#8e72ad","#2f6698","#3787b1","#2b8b7a","#4db19e"];
var chartData = [];
var chartLoaded = false;

$(window).bind('load', function() {

	$('.survey').each(function () {
		var cSurvey = $(this);
		var showResult = cSurvey.find('.view-result');
		var submitUrl = cSurvey.find('.button').attr('data-url');
		var showResultUrl = showResult.attr('data-url');

		cSurvey.on('submit', function(e){
			if ($(this).find('input').is(':checked')) {
				e.preventDefault(); 
				$.ajax({
					type: 'POST',
					cache: false,
					url: submitUrl,
					data:cSurvey.serialize(),
					success: function (data) {
						if (data !== '') {
							cSurvey.parent().removeClass('m-poll').addClass('poll-outcome');
							cSurvey.find('.result').remove();
							cSurvey.append(data);
							cSurvey.find('input[type=submit]').attr('disabled','disabled');
							showResult.data('active', true);
							showResult.data('open', true);
							showResult.text('Dölj resultat');
							cSurvey.find('fieldset').remove();
							initNewChart(cSurvey);
							showResult.prev().show();
							showResult.show();
						}
					}
				});	
			}
			else {
				return false;
			}	
		});		

		if(cSurvey.data("total-answers") === 0){

			showResult.prev().hide();
			showResult.hide();
		}

		showResult.on('click', function (e) {
		    e.preventDefault();
			if(!showResult.data('active')){
				$.ajax({
					type: 'POST',
					cache: false,
					url: showResultUrl,
					data: cSurvey.serialize(),
					success: function (data) {
						if (data !== '') {
							cSurvey.parent().removeClass('m-poll').addClass('poll-outcome');
							cSurvey.append(data);
							showResult.data('active', true);
							showResult.data('open', true);
							showResult.text('Dölj resultat');
							initNewChart(cSurvey);
						}
					}
				});	
			} else {
				var resultContainer = cSurvey.find('.result');
				if(!showResult.data('open')){
					showResult.text('Dölj resultat');
					showResult.data('open', true);
					resultContainer.show();
				}else{
					showResult.text('Visa resultat');
					showResult.data('open', false);
					resultContainer.hide();
				}
			}
		});
		
	});
	
});

var chartInstanceCounter = 0;

window.onload = function () {
	initChart();
};

function initNewChart(crt){

	var canvasSize = 120;
	var newChart = crt.find('ul.stats');

	if($(window).width() <= 640){
		canvasSize = newChart.parent().width();
	}
	updateChart(newChart,false,true,chartInstanceCounter++,canvasSize);	
}
function initChart(){

		var canvasSize = 120;

		$('ul.stats').each(function () {
			if($(window).width() <= 640){
				canvasSize = $(this).parent().width();
			}
			updateChart($(this),false,true,chartInstanceCounter,canvasSize);
			chartInstanceCounter++
		});
		chartLoaded = true;
}

$(window).resize(function () {
	if(chartLoaded){
		if($(window).width() <= 640){
			var c = 0;
			$("ul.stats").each(function () {
				updateChart($(this),true,false,c, $(this).parent().width());
				c++;
			});
		}else{
			var c = 0;
			$('ul.stats').each(function () {
				updateChart($(this),true,false,c,120);
				c++;
			});
		}
	}
});


function updateChart(crt,reload,animation,c,canvasSize){
	var data = [];
	var colCount = 0;

	if(!reload){
		$(crt).find("li").each(function () {
			
			var o = new Object();
			if($(this).data('value') > 0){
				o["value"] = $(this).data('value');
			}else{		
				o["value"] = 0.001;
			}
			o["color"] = chartColors[colCount];
			data.push(o);
				
			var box = $('<span>').attr({
				'class': 'color-box',
				'style':'background-color:' + chartColors[colCount]
			});
			$(this).prepend(box);
			colCount++;

		});
		chartData.push(data);
	}
	if(reload){
		$('#holder-' + c).remove();
	}
	var holder = $('<canvas>').attr({
		'class': 'chart',
		'id': 'holder-' + c,
		'width':canvasSize,
		'height':canvasSize
	});
	$(crt).before(holder);
	if(is_ie8){
		var el = document.getElementById('holder-' + c);
		G_vmlCanvasManager.initElement(el);
	}

	if(chartData[c] !== null) {
		if(is_ie8){
			new Chart($('#holder-' + c).get(0).getContext("2d")).Pie(chartData[c], { segmentStrokeWidth :1,animation :false});
		}else{
			new Chart($('#holder-' + c).get(0).getContext("2d")).Pie(chartData[c], { segmentStrokeWidth :1,animation :animation});
		}
	}
}
