queue()
    .defer(d3.json, "/api/data")
    .await(makeGraphs);

function makeGraphs(error, apiData) {
	
    //Start Transformations
	var dataSet = apiData;
	
	 var dateFormat = d3.time.format("%m/%d/%Y");
	 var timeFormat = d3.time.format("%H:%M:%S");
	 // %H:%M:%S
	 console.log(dateFormat);
     console.log(timeFormat);

    dataSet.forEach(function(d) {
	
    //Parse DateOfStop	
	console.log(d.DateOfStop);
	console.log("before");
    d.DateOfStop = dateFormat.parse(d.DateOfStop);
	// d.DateOfStop.setDate(1);
	console.log("after");
	console.log(d.DateOfStop);
	
	//Parse TimeOfStop
	console.log(d.TimeOfStop);
	console.log("before");
    d.TimeOfStop = timeFormat.parse(d.TimeOfStop);
	// d.DateOfStop.setDate(1);
	console.log("after");
	console.log(d.TimeOfStop);
	
	d.Longitude = +d.Longitude;
	d.Latitude = +d.Latitude;
   
}); 
	

	//Create a Crossfilter instance
	var ndx = crossfilter(dataSet);

	//Define Dimensions
	var datePosted = ndx.dimension(function(d) { return d.DateOfStop; });
	var datePosted2 = ndx.dimension(function(d) { return d.TimeOfStop; });
	var race = ndx.dimension(function(d) { return d.Race; });
	var makeType = ndx.dimension(function(d) { return d.Make; });
	var vehicleType = ndx.dimension(function(d) { return d.VehicleType; });
	
	var genderType = ndx.dimension(function(d) { return d.Gender; });
	//var fundingStatus3 = ndx.dimension(function(d) { return d.Gender; });
	var alcoholType = ndx.dimension(function(d) { return d.Alcohol; });
	//var fundingStatus4 = ndx.dimension(function(d) { return d.Alcohol; });
	var beltsType = ndx.dimension(function(d) { return d.Belts; });
	//var fundingStatus5 = ndx.dimension(function(d) { return d.Belts; });
	var accidentType = ndx.dimension(function(d) { return d.Accident; });
	//var fundingStatus6 = ndx.dimension(function(d) { return d.Accident; });
	var personalInjuryType = ndx.dimension(function(d) { return d.PersonalInjury; });
	//var fundingStatus7 = ndx.dimension(function(d) { return d.PersonalInjury; });
	var arrest = ndx.dimension(function(d) { return d.ArrestType; });
	//var fundingStatus8 = ndx.dimension(function(d) { return d.ArrestType; });
	
	var allDim = ndx.dimension(function(d) {return d;})
	


	//Calculate metrics
	var projectsByDate = datePosted.group();
	var projectsByDate2 = datePosted2.group(); 
	var trafficIncidentsByRace = race.group();
	var trafficIncidentsByMake = makeType.group();
	var trafficIncidentsByVehicleType = vehicleType.group();
	var trafficIncidentsByGenderType = genderType.group();
	var trafficIncidentsByAlcoholType = alcoholType.group();
	var trafficIncidentsByBeltsType = beltsType.group();
	var trafficIncidentsByAccidentType = accidentType.group();
	var trafficIncidentsByPersonalInjuryType = personalInjuryType.group();
	var trafficIncidentsByArrest = arrest.group();
	

	var all = ndx.groupAll();

	//Define threshold values for data
	var minDate = datePosted.bottom(1)[0].DateOfStop;
	var maxDate = datePosted.top(1)[0].DateOfStop;
	
	//Define threshold values for data
	var minTime = datePosted2.bottom(1)[0].TimeOfStop;
	var maxTime = datePosted2.top(1)[0].TimeOfStop;

	console.log("minDate");
    console.log(minDate);
    console.log("maxDate");
    console.log(maxDate);
	
	
	//TimeOfStop
	console.log("minDate");
    console.log(minTime);
    console.log("maxDate");
    console.log(maxTime);
	

    //Charts
	var dateChart = dc.lineChart("#date-chart");
	var dateChart2 = dc.lineChart("#date-chart2");
	var dataTable = dc.dataTable("#dc-table-graph");
	var raceTypeChart = dc.rowChart("#race-chart");
	var makeTypeChart = dc.pieChart("#make-chart");
	var totalProjects = dc.numberDisplay("#total-projects");
	var vehicleTypeChart = dc.rowChart("#vehicleType-chart");
	var genderTypeChart = dc.pieChart("#gender-chart");
	var alcoholTypeChart = dc.pieChart("#alcohol-chart");
	var beltsTypeChart = dc.pieChart("#belts-chart");
	var accidentChart = dc.pieChart("#accident-chart");
	var personalInjuryChart = dc.pieChart("#personalInjury-chart");
	var arrestChart = dc.rowChart("#arrest-chart");



    dc.dataCount("#row-selection")
        .dimension(ndx)
        .group(all);


	totalProjects
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(all);

		
     // Magnitide Bar Graph Counted
        dateChart
		.width(1100)
		.height(400)
		.margins({top: 10, right: 50, bottom: 30, left: 50})
		.dimension(datePosted)
		.group(projectsByDate)
		.renderArea(true)
		.transitionDuration(500)
		.x(d3.time.scale().domain([minDate, maxDate]))
		.elasticY(true)
		.renderHorizontalGridLines(true)
    	.renderVerticalGridLines(true)
		.xAxisLabel("Year")
		.yAxis().ticks(5);
		
		
		// Magnitide Bar Graph Counted
        dateChart2
		.width(1100)
		.height(400)
		.margins({top: 10, right: 30, bottom: 30, left: 30})
		.dimension(datePosted2)
		.group(projectsByDate2)
		.renderArea(true)
		.transitionDuration(500)
		.x(d3.time.scale().domain([minTime, maxTime]))
		.elasticY(true)
		.renderHorizontalGridLines(true)
    	.renderVerticalGridLines(true)
		.xAxisLabel("Year")
		.yAxis().ticks(5);

	
	
    //raceTypeChart	
	raceTypeChart
        .width(700)
        .height(600)
        .dimension(race)
        .group(trafficIncidentsByRace)
        .elasticX(true)
        .xAxis().ticks(8);

	

 
			
	//makeTypeChartcar manufacturer company	
	makeTypeChart
            .height(768)
            .width(600)
            .radius(250)
            .innerRadius(50)
			//.legend(dc.legend())
			//.externalLabels(50)
            //.externalRadiusPadding(50)
            //.drawPaths(true)
            .transitionDuration(1500)
            .dimension(makeType)
            .group(trafficIncidentsByMake);
			
	
		
		vehicleTypeChart
        .width(600)
        .height(800)
        .dimension(vehicleType)
        .group(trafficIncidentsByVehicleType)
        .elasticX(true)
        .xAxis().ticks(8);
		
			
			
		genderTypeChart
            .height(270)
            .width(400)
            .radius(100)
            .innerRadius(50)
			.legend(dc.legend())
			//.externalLabels(50)
            //.externalRadiusPadding(50)
            //.drawPaths(true)
            .transitionDuration(1500)
            .dimension(genderType)
            .group(trafficIncidentsByGenderType);
			
			
			
			alcoholTypeChart
            .height(250)
            .width(400)
            .radius(100)
            .innerRadius(50)
			.legend(dc.legend())
			//.externalLabels(50)
            //.externalRadiusPadding(50)
            //.drawPaths(true)
            .transitionDuration(1000)
            .dimension(alcoholType)
            .group(trafficIncidentsByAlcoholType);
			
			
			
			beltsTypeChart
            .height(250)
            .width(400)
            .radius(100)
            .innerRadius(50)
			.legend(dc.legend())
			//.externalLabels(50)
            //.externalRadiusPadding(50)
            //.drawPaths(true)
            .transitionDuration(1500)
            .dimension(beltsType)
            .group(trafficIncidentsByBeltsType);
			
			
			
		accidentChart
            .height(250)
            .width(400)
            .radius(100)
            .innerRadius(50)
			.legend(dc.legend())
			//.externalLabels(50)
            //.externalRadiusPadding(50)
            //.drawPaths(true)
            .transitionDuration(1500)
            .dimension(accidentType)
            .group(trafficIncidentsByAccidentType);
			
			
		personalInjuryChart
            .height(250)
            .width(400)
            .radius(100)
            .innerRadius(50)
			//.externalLabels(50)
            //.externalRadiusPadding(50)
            //.drawPaths(true)
            .transitionDuration(1500)
            .dimension(personalInjuryType)
            .group(trafficIncidentsByPersonalInjuryType); 
			
			
		
	arrestChart
        .width(600)
        .height(800)
        .dimension(arrest)
        .group(trafficIncidentsByArrest)
        .elasticX(true)
        .xAxis().ticks(8);
		
		
   // Table of Traffic Incidents data
   dataTable
    .width(2000)
	.height(1000)
    .dimension(datePosted)
	.group(function(d) { return "" })
	.size(25)
    .columns([
      function(d) { return d.Year; },
      function(d) { return d.Race; },
      function(d) { return d.Make; },
      function(d) { return d.VehicleType; },
      function(d) { return d.Gender; },
	  function(d) { return d.Alcohol; },
	  //PersonalInjury
	  function(d) { return d.PersonalInjury; },
	  //ArrestType
	  function(d) { return d.ArrestType; },
	  function(d) { return d.Accident; },
	  function(d) { return d.Belts; },
	  function(d) { return '<a href=\"http://maps.google.com/maps?z=12&t=m&q=loc:' + d.Latitude + '+' + d.Longitude +"\" target=\"_blank\">Google Map</a>"},
	  function(d) { return '<a href=\"http://www.openstreetmap.org/?mlat=' + d.Latitude + '&mlon=' + d.Longitude +'&zoom=12'+ "\" target=\"_blank\"> OSM Map</a>"}
    ])
    .sortBy(function(d){ return d.Year; })
    .order(d3.ascending);
	
		//Map
	
	var map = L.map('map');

	var drawMap = function(){

	    map.setView([39.0915833333333, -77.0426416666667], 10);
		mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
		L.tileLayer(
			'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '&copy; ' + mapLink + ' Contributors',
				maxZoom: 25,
			}).addTo(map);

		 //HeatMap
		var geoData = [];
		_.each(allDim.top(Infinity), function (d) {
			geoData.push([d["Latitude"], d["Longitude"], 1]);
	      });
		var heat = L.heatLayer(geoData,{
			radius: 10,
			blur: 20, 
			maxZoom: 1,
		}).addTo(map);

	};

	//Draw Map
	drawMap();
	
	
	//Update the heatmap if any dc chart get filtered
	dcCharts = [dateChart, dateChart2, raceTypeChart, makeTypeChart, vehicleTypeChart,totalProjects,genderTypeChart,alcoholTypeChart,beltsTypeChart,accidentChart,personalInjuryChart,arrestChart];

	_.each(dcCharts, function (dcChart) {
		dcChart.on("filtered", function (chart, filter) {
			map.eachLayer(function (layer) {
				map.removeLayer(layer)
			}); 
			drawMap();
		});
	}); 
	
	




    dc.renderAll();

};