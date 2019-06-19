
// Define connections
var APILink = "http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";
// var APILink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
var mapboxLink = "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}";
var attrCode = "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>";


// function createMap(earthquakes, faultlines) {
function createMap(earthquakes) {

    // Create tile layer variables
    var outdoors = L.tileLayer(mapboxLink, {
      attribution: attrCode,
      maxZoom: 25,
      id: "mapbox.outdoors",
      accessToken: API_KEY
    });

    var satellite = L.tileLayer(mapboxLink, {
      attribution: attrCode,
      maxZoom: 25,
      id: "mapbox.satellite",
      accessToken: API_KEY
    });

    var greyscale = L.tileLayer(mapboxLink, {
      attribution: attrCode,
      maxZoom: 25,
      id: "mapbox.light",
      accessToken: API_KEY
    });

    // Create BaseMaps group
    var baseMaps = {
      "Satellite": satellite,
      "Greyscale": greyscale,
      "Outdoors": outdoors
    };

    // // Create 2 separate layer groups   ????????????????????????????????
    // var earthquakes = L.layerGroup(earthMarkers);
    // var faultlines = L.layerGroup(faultMarkers);

    //Create overlay object to hold our overlay layer
    var overlayMaps = {
      "Earthquakes": earthquakes
      // ,
      // "Fault Lines": faultlines
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [37.7749, -122.4194],
      zoom: 5,
      layers: [satellite, earthquakes]
      // layers: [satellite, earthquakes, faultlines]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "legend");
      var labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
      var colors = color;
      var limits = [];

      // Add min & max
      var legendInfo = "<h1>Median Income</h1>" +
        "<div class=\"labels\">" +
          "<div class=\"min\">" + limits[0] + "</div>" +
          "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
        "</div>";

      div.innerHTML = legendInfo;

      limits.forEach(function(limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
      });

      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
    };

    // Adding legend to the map
    legend.addTo(myMap);

}


// Function to determine marker size based on magnitude
function markerSize(feature) {
  return (feature.properties.mag) * 5;
}

// Function to determine marker color based on magnitude
function markerColor(feature) {

  var color = ["#003AFF", "#00BDFF", "#00FFE2", "#00E50F", "#B4FF09", "#EBFF0D"]
  var magnitude =  feature.properties.mag;

  
  if (magnitude > 5) {
    return color[5]
  }
  else if (magnitude > 4) {
    return color[4]
  }
  else if (magnitude > 3) {
    return color[3]
  }
  else if (magnitude > 2) {
    return color[2]
  }
  else if (magnitude > 1) {
    return color[1]
  }
  else {
    return color[0]
  };
}


// var earthquakes;
// var faultlines;

function createFeatures(earthquakeData) {

  // Define functions we want to run once for each feature in the features array

  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Give each feature a popup describing the place and time of the earthquake
  function pointToLayer(feature, latlng) {
    
    var earthQMarkers = {
      stroke: false,
      radius: markerSize(feature),
      fillColor: markerColor(feature),
      weight: 5,
      opacity: .9,
      fillOpacity: .9
    };

    return L.circleMarker(latlng, earthQMarkers);
  }

  // var faultlines = L.geoJSON(faultlinedata, {
  //   onEachFeature: onEachFeature
  // });

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: pointToLayer
  });

  // Sending our earthquakes layer to the createMap function
  // createMap(earthquakes, faultlines);
  createMap(earthquakes);
}

// Perform a GET request to the query URL
d3.json(APILink, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});



// // Loop through data
//   for (var i = 0; i < data.length; i++) {

//     // Set the data location property to a variable
//     var latlng = data[i].features.geometry.coordinates;
//     // var longditude = data[i].features.geometry.coordinates[0];

//     // Add a new marker to the cluster group and bind a pop-up
//     markers.addLayer(L.marker(latlng)
//       .bindPopup(response[i].descriptor));
//     }

//   // Add our marker cluster layer to the map
//   myMap.addLayer(markers);



