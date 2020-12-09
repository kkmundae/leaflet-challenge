// Creating map object
// Lat and Long set for centre of map
// This gets inserted into the div with an id of 'map' in index.html
var myMap = L.map("map", {
    center: [0, 0],
    zoom: 1.5
});

// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// Store our API endpoint
// var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

//  GET color radius call to the query URL
d3.json(queryUrl, function (data) {
    function styleInfo(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: "purple",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }
    // set different color from depths
    function getColor(depth) {
        switch (true) {
            case depth > 50:
                return "red";
            case depth > 40:
                return "orange";
            case depth > 30:
                return "yellow";
            case depth > 20:
                return "green";
            case depth > 10:
                return "blue";
            default:
                return "purple";
        }
    }
    // set radius from magnitude
    function getRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }

        return magnitude * 4;
    }
    // GeoJSON layer
    L.geoJson(data, {
        // Maken cricles
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        // cirecle style
        style: styleInfo,
        // popup for each marker
        onEachFeature: function (feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
    }).addTo(myMap);

    // an object legend
    var legend = L.control({
        position: "bottomright"
    });

    // details for the legend
    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");

        var grades = [-10, 10, 20, 30, 40, 50];
        var colors = [
            "red",
            "orange",
            "yellow",
            "green",
            "blue",
            "purple"
        ];

        // Looping through
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                "<i style='background: " + colors[i] + "'></i> " +
                grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
        return div;
    };

    // Finally, we add our legend to the map.
    legend.addTo(myMap);
});