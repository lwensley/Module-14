// must run local server to see


// Define connections
var APILink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var mapboxLink = "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}";
var attrCode = "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>";
var platesdata = "https://github.com/fraxen/tectonicplates/blob/master/GeoJSON/PB2002_boundaries.json";
var platesdata = "PB2002_boundaries.json";

// function createMap(earthquakes, faultlines) {
function createMap(earthquakes, tectonic) {

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
      "Earthquakes": earthquakes,
      "Fault Lines": tectonic
      // ,
      // "Fault Lines": faultlines
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      // center: [37.7749, -122.4194],
      center: [0, 0],
      zoom: 2.4,
      layers: [satellite, earthquakes, tectonic]
      // layers: [satellite, earthquakes, faultlines]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);


    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            groups = [0, 1, 2, 3, 4, 5],
            labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < groups.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(groups[i] + 1) + '"></i> ' +
                groups[i] + (groups[i + 1] ? '&ndash;' + groups[i + 1] + '<br>' : '+');
        }

        return div;
    };

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

//alternative function to determine color only
function getColor(magnitude) {
  return  magnitude > 5 ? "#EBFF0D" :
          magnitude > 4 ? "#B4FF09" :
          magnitude > 3 ? "#00E50F" :
          magnitude > 2 ? "#00FFE2" :
          magnitude > 1 ? "#00BDFF" :
          "#003AFF";
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


  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: pointToLayer
  });

  d3.json(platesdata, function(platesdata) {

    var plates = {
      "color": "orange",
      "weight": 2,
      "opacity": .5,
      fillOpacity: 0,
      };

    var tectonic = L.geoJSON(platesdata, {
      style: plates
      });

  // Sending our earthquakes layer to the createMap function
  // createMap(earthquakes, faultlines);
  createMap(earthquakes, tectonic);
})
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



