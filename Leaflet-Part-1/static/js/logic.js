// Initialize the map
var map = L.map("map").setView([37.09, -95.71], 5);

// Add a base map layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Load earthquake data from USGS GeoJSON
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(link).then(function(data) {
    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: feature.properties.mag * 4,
                fillColor: getColor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 0.5,
                opacity: 1,
                fillOpacity: 0.8
            }).bindPopup(`Magnitude: ${feature.properties.mag}<br>Location: ${feature.properties.place}`);
        }
    }).addTo(map);

    // Create legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var depth = [-10, 10, 30, 50, 70, 90];
        var colors = ["#2c99ea", "#2ceabf", "#92ea2c", "#d5ea2c", "#eaa92c", "#ea2c2c"];
        div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"

        for (var i = 0; i < depth.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(map);
});

// Function to determine marker color based on depth
function getColor(depth){
  if (depth < 10) return "#2c99ea";
  else if (depth < 30) return "#2ceabf";
  else if (depth < 50) return "#92ea2c";
  else if (depth < 70) return "#d5ea2c";
  else if (depth < 90) return "#eaa92c";
  else return "#ea2c2c";
}
