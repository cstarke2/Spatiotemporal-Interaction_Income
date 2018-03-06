$.getJSON("data/income.geojson")
	.done(function(data) {
			var info = processData(data);
			createPropSymbols(info.timestamps, data);
			createLegend(info.min,info.max);
			createSliderUI(info.timestamps);
	})
.fail(function() { alert("There has been a problem loading the data.")});

function processData(data) {
	var timestamps = [];
	var min = Infinity;
	var max = -Infinity;
	
	for (var feature in data.features) {
		var properties = data.features[feature].properties;
		
		for (var attribute in properties) {
			if ( attribute != 'id' &&
			  attribute != 'name' &&
			  attribute != 'lat' &&
			  attribute != 'long') {
				  if ($.inArray(attribute, timestamps) === -1) {
					  timestamps.push(attribute);
				  }
				  if (properties[attribute] < min) {
					  min = properties[attribute];
				  }
				  if (properties[attribute] > max) {
					  max = properties[attribute];
				  }
			  }
		}
	}
	return {
		timestamps : timestamps,
		min : min,
		max : max
	}
	function createPropSymbols(timestamps, data) {
		states = L.geoJson(data, {
			pointToLayer: function(feature, latlng) {
			
			return L.CircleMarker(latlng, {
				fillColor: "#228B22",
				color: "#EEE8AA",
				weight: 1,
				fillOpacity: 0.5
			}).on({
				mouseover: function(e) {
					this.openPopup();
					this.setStyle({color: '#008080'});
				},
				mouseout: function(e) {
					this.closePopup();
					this.setStyle({color: '#EEE8AA'});
				}
			});
			}
		
		}).addTo(map);
		updatePropSymbols(timestamps[0]);
	}
	function updatePropSymbols(timestamp) {
		states.eachLayer(function(layer) {
			var props = layer.feature.properties;
			var radius = calcPropRadius(props[timestamp]) +
			var popupContent = "<b>" + String(props[timestamp]) +
				"units</b><br>" +
				"<i>" + props.name +
				"</i> in </i>" +
				timestamp + "</i>";
			
			layer.setRadius(radius);
			layer.bindPopup(popupContent, { offset: new L.Point(0, -radius) });
		});
	}
	function calcPropRadius(attributeValue) {
		var scaleFactor = 16;
		var area = attributeValue * scaleFactor;
		return Math.sqrt(area/Math.PI) *2;
	}
	function createLegend(min,max) {
		if (min< 10) {
			min = 10;
		}
		function roundNumber(inNumber) {
			return (Math.round(inNumber/10) * 10);
		}
		var legend = L.control( {position: 'bottomright'});
		
		legend.onAdd = function(map) {
		
		var legendContainer = L.DomUtil.create("div", "legend");
		var symbolsContainer = L.DomUtil.create("div", "symbolsContainer");
		var classes = [roundNumber(min), roundNumber((max-min)/2), roundNumber(max)];
		var legendCircle = 0;
		var currentRadius;
		var margin;
		
		L.DomEvent.addListener(legendContainer, 'mousedown', function(e) {
			L.DomEvent.stopPropagation(e);
		});
		
		$(legendContainer).append("<h2 id='legendTitle'># Income</h2>");
		for (var i = 0; i <= classes.length-1; i++) {
			legendCircle = L.DomUtil.create("div", "legendCircle");
			currentRadius = calcPropRadius(classes[i]);
			margin = -currentRadius - lastRadius -2;
			$(legendCircle).attr("style", "width: " + currentRadius*2 +
				"px; height: " + currentRadius*2 +
				"px; margin-left: " + margin +"px" );
			$(legendCircle).append("<span class='legendValue'>"classes[i]+"/span>");
			$(symbolsContainer).append(legendCircle);
			lastRadius = currentRadius;
		}
		$(legendContainer.append(symbolsContainer);
		return legendContainer;
		};
		legend.addTo(map);
		
		function createSliderUI(timestamps) {
			var sliderControl = L.control({position: 'bottomleft'});
			sliderControl.onAdd = function(map) {
				var slider = L.DomUtil.create("input","range-slider");
				L.DomEvent.addListener(slider, 'mousedown', function(e) {
					L.DomEvent.stopPropagation(e);
				});
				$(slider)
					.attr({'type':'range',
						   'max': timestamps[timestamps.length-1],
						   'min': timestamps[0],
					       'step': 1,
						   'value': String(timestamps[0])})
					.on('input change', function() {
					updatePropSymbols($(this).val().toString());
						$(".temporal-legend").text(this.value);
					
					});
					return slider;
			}
			sliderControl.addTo(map)
			createTemporalLegend(timestamps[0]);
		}
		function createTemporalLegend(startTimeStamp) {
			var temportalLegend = L.control({position: 'bottomleft'});
			temportalLegend.onAdd = function(map) {
				var output = L.DomUtil.create("output", "temporal-legend"");
				$(output).text(startTimeStamp)
				return output;
			}
			temportalLegend.addTo(map);
		}
} //end createLegend();

var map = L.map('map').setView([39.828, -98.579], 8);
		
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'username: cstarke2',
    accessToken: 'pk.eyJ1IjoiY3N0YXJrZTIiLCJhIjoiY2plZWY3YzR4MTZ4YTJ4czNhcjR2cHl3aSJ9.zMWwBdMgEh9ObNYskdtfGw'
}).addTo(mymap);

var marker = L.marker([39.828, -98.579]).addTo(mymap);

var circle = L.circle([40.5, -99.1], {
    color: 'grey',
    fillColor: '#008000',
    fillOpacity: 0.5,
    radius: 500
}).addTo(mymap);

]).addTo(map);
marker.bindPopup("<b>Spatiotemporal Income in the US.</b><br>How Income Has Changed.").openPopup();
circle.bindPopup("Income.");
	
var popup = L.popup()
	.setLatLng([39.828, -98.579])
	.setContent("This is the central location of this data spread.")
	.openOn(map);
		
var popup = L.popup();
	
function onMapClick(e) {
	popup
		.setLatLng(e.latlng)
		.setContent("You clicked the map at " +e.latlng.toString())
		.openOn(map);
}
map.on('click', onMapClick);