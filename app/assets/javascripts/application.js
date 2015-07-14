// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require bootstrap-sprockets
//= require_tree .


// The init function needs to run on load

// google.maps.event.addDomListener(window, 'page:load', initialize);
var my_map;

function selectRoute(){
  document.getElementById('submitText').addEventListener("click", submitRoute);
};

function getMap(my_map) {
  return my_map;
}

function getStopsData(x) {
  //API call for stops
  var stops = [];
  $.ajax("http://api.metro.net/agencies/lametro/routes/" + x + "/stops/", {
    success: function(data) {
      stops = data;
      console.log(stops.items[0].latitude);

      for (var i = 0; i < stops.items.length; i++) {
        var stopPositions = new google.maps.LatLng(stops.items[i].latitude, stops.items[i].longitude);

        var stopMarker = new google.maps.Marker({
          position: stopPositions,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 3,
            fillColor: '#FF0000',
            strokeColor: '#FF0000',
            fillOpacity: 1,
          }
        });
        console.log(stopMarker);
        console.log(my_map)
        stopMarker.setMap(my_map);
      }
    }

  });
}

function submitRoute() {
  var myRoute = document.getElementById('inputText').value;
  getStopsData(myRoute);
};

// Initialize Google Map
function initialize() {

  // Define mapProperties
  var mapProperties = {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: new google.maps.LatLng(34.0218628, -118.4804206),
    zoom: 12
  }
  // Define my_map to be map rendered on index page, labeled as "address-map"
  my_map = new google.maps.Map(document.getElementById("address-map"), mapProperties);

  // Defines variable "bounds" as the LatLngBounds of our map
  // var bounds = new google.maps.LatLngBounds();
  // Loop for stop positions

  // Fits bounds of the map according to LatLngbounds of our map as defined by coordinates of existing data
  // my_map.fitBounds(bounds);

  selectRoute();

}
