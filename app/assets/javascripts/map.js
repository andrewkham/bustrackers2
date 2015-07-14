// The init function needs to run on load
google.maps.event.addDomListener(window, 'load', initialize);
google.maps.event.addDomListener(window, 'page:load', initialize);

// Initialize Google Map
function initialize() {

  // Define mapProperties
  var mapProperties = {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: new google.maps.LatLng(34.0218628, -118.4804206),
    zoom: 12
  }

  // Define my_map to be map rendered on index page, labeled as "address-map"
  var my_map = new google.maps.Map(document.getElementById("address-map"), mapProperties);

  // Defines variable "bounds" as the LatLngBounds of our map
  var bounds = new google.maps.LatLngBounds();
  // Loop for stop positions

  //API call for stops
  var stops = [];
  $.ajax("http://api.metro.net/agencies/lametro/routes/704/stops/", {
    success: function(data) {
      stops = data;
      console.log(stops)
      console.log(stops.items[0].latitude);

      for (var i = 0; i < stops.items.length; i++) {
        var stopPositions = new google.maps.LatLng(stops.items[i].latitude, stops.items[i].longitude);
        // console.log(stopPositions);
        var stopMarker = new google.maps.Marker({
          position: stopPositions,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 3,
            fillColor: '#FF0000',
            strokeColor: '#FF0000',
            fillOpacity: 1,
          }
        })
        stopMarker.setMap(my_map);

        bounds.extend(stopPositions);
      }


    }
  });

// Fits bounds of the map according to LatLngbounds of our map as defined by coordinates of existing data
// my_map.fitBounds(bounds);
}
