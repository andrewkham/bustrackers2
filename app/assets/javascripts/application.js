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

// Setting global variables
var my_map;
var stopMarkersArray = [];
var busMarkersArray = [];
var stopMarker;
var busMarker;
var myRoute;
var busIDs;
var buses =[];
var routeBuses = [];
var validBusIDs = [];

// Function to call submitRoute function upon click of submit button
function selectRoute(){
  document.getElementById('submitText').addEventListener("click", submitRoute);
};

// Function to run upon click of submit button
function submitRoute() {
  // Defining myRoute as input text value
  myRoute = document.getElementById('inputText').value;
  // Run getRouteBus if busMarker is undefined
  if (busMarker == undefined) {
    getRouteBus();
    // Resets search box to blank
    document.getElementById('inputText').value = "";
    // Clear markers and set marker array to empty if busMarker is defined and run functions for newly input route
  } else {
    for(i=0; i<busMarkersArray.length; i++){
      busMarkersArray[i].setMap(null);
    }
    busMarkersArray = [];
    getRouteBus();
    document.getElementById('inputText').value = "";
  }

  if (stopMarker == undefined) {
    getStopsData();
    document.getElementById('inputText').value = "";
  } else {
    for(i=0; i<stopMarkersArray.length; i++){
      stopMarkersArray[i].setMap(null);
    }
    stopMarkersArray = [];
    getStopsData();
    document.getElementById('inputText').value = "";
  }
};

// Function to get stops data via API call, to call specified URL based on textbox input value
function getStopsData() {
  //API call for stops
  var stops = [];
  $.ajax("http://api.metro.net/agencies/lametro/routes/" + myRoute + "/stops/", {
    success: function(data) {
      stops = data;
      // console.log(stops.items[0].latitude);
      // For loop to gather latlongs of stops
      for (var i = 0; i < stops.items.length; i++) {
        var stopPositions = new google.maps.LatLng(stops.items[i].latitude, stops.items[i].longitude);
        // Marker definition based on latlongs of stops
        stopMarker = new google.maps.Marker({
          position: stopPositions,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 3,
            fillColor: '#FF0000',
            strokeColor: '#FF0000',
            fillOpacity: 1,
          }
        });
        // Setting markers for stops
        stopMarker.setMap(my_map);
        stopMarkersArray.push(stopMarker);
      }
    }

  });
}

//Function to store the bus IDs associated with searched routes into an array
function getRouteBus(){
  $.ajax("https://publicdata-transit.firebaseio.com/lametro/routes/" + myRoute + ".json", {
    success: function(data) {
      routeBuses = data;
      busIDs = Object.keys(routeBuses)
      // Runs getBusData immediately
      getBusData()
      console.log(busIDs)
    }
  })

}

// Function to pull lat longs of buses defined by RouteBus function
function getBusData(){
  $.ajax("https://publicdata-transit.firebaseio.com/lametro/vehicles.json", {
    success: function(data) {
      buses = data;
      for(i=0; i<busIDs.length; i++){
        if(buses[busIDs[i]] !== undefined){
          validBusIDs.push(buses[busIDs[i]].id);
          var busPositions = new google.maps.LatLng(buses[busIDs[i]].lat, buses[busIDs[i]].lon)
          busMarker = new google.maps.Marker({
            position: busPositions,
            icon: 'http://chart.googleapis.com/chart?chst=d_bubble_icon_text_small&chld=bus|bbT|' + buses[busIDs[i]].id + '|ffd700|800080'
          });
          busMarker.setMap(my_map);
          busMarkersArray.push(busMarker);
          resetMarkers();
        }
      }
      console.log(validBusIDs)
    }
  })
}

function resetMarkers() {

  setInterval(function(){

    $.ajax("https://publicdata-transit.firebaseio.com/lametro/routes/" + myRoute + ".json", {
      success: function(data) {
        routeBuses = data;
        busIDs = Object.keys(routeBuses)
      }
    });

    for(i=0; i<busMarkersArray.length; i++){
      busMarkersArray[i].setMap(null);
    }

    busMarkersArray = [];
    buses = [];
    validBusIDs = [];

    $.ajax("https://publicdata-transit.firebaseio.com/lametro/vehicles.json", {
      success: function(data2) {
        buses = data2;
        for(i=0; i<busIDs.length; i++){
          if(buses[busIDs[i]] !== undefined){
            validBusIDs.push(buses[busIDs[i]].id);
            var busPositions = new google.maps.LatLng(buses[busIDs[i]].lat, buses[busIDs[i]].lon)
            busMarker = new google.maps.Marker({
              position: busPositions,
              icon: 'http://chart.googleapis.com/chart?chst=d_bubble_icon_text_small&chld=bus|bbT|' + buses[busIDs[i]].id + '|ffd700|800080'
            });
            busMarker.setMap(my_map);
            busMarkersArray.push(busMarker);
          }
        }
      }
    })
  },20000)
}

// Initialize Google Map
function initialize() {

  // Define mapProperties
  var mapProperties = {
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    center: new google.maps.LatLng(34.0500, -118.2500),
    zoom: 11
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
