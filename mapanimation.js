var map;
var markers = [];

// load map
function init() {
  var myOptions = {
    zoom: 14,
    center: { lat: 42.35335, lng: -71.091525 },
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  };

  var element = document.getElementById("map");
  map = new google.maps.Map(element, myOptions);
  //calls the function that loops through the bus data
  //and adds markers accordingly then calls itsels
  //every 15 seconds aka next one
  addMarkers();
}

// Add bus markers to map
async function addMarkers() {
  // get bus data
  var locations = await getBusLocations();
  // loop through data, add bus markers
  locations.forEach(function (bus) {
    var marker = getMarker(bus.id);
    //if the marker matching this id exists,
    //move this marker, otherwise create a new one
    //and push it to an array
    if (marker) {
      moveMarker(marker, bus);
    } else {
      addMarker(bus);
    }
  });

  // timer
  console.log(new Date());
  setTimeout(addMarkers, 15000);
}

// Request bus data from MBTA
async function getBusLocations() {
  var url =
    "https://api-v3.mbta.com/vehicles?api_key=ca34f7b7ac8a445287cab52fb451030a&filter[route]=1&include=trip";
  var response = await fetch(url);
  var json = await response.json();
  return json.data;
}

//this fun is called earlier asynchrously when a bus id
//does not match one in the array
function addMarker(bus) {
  var icon = getIcon(bus);
  var marker = new google.maps.Marker({
    position: {
      lat: bus.attributes.latitude,
      lng: bus.attributes.longitude,
    },
    map: map,
    icon: icon,
    id: bus.id,
  });
  markers.push(marker);
}

//this function is called in the next one
function getIcon(bus) {
  // select icon based on bus direction
  if (bus.attributes.direction_id === 0) {
    return "red.png";
  }
  return "blue.png";
}

function moveMarker(marker, bus) {
  // change icon if bus has changed direction
  var icon = getIcon(bus);
  marker.setIcon(icon);

  // move icon to new lat/lon
  marker.setPosition({
    lat: bus.attributes.latitude,
    lng: bus.attributes.longitude,
  });
}

//search the array of markers created earlier to
//return the first item that matches the id
//passed to this function

function getMarker(id) {
  var marker = markers.find(function (item) {
    return item.id === id;
  });
  return marker;
}

window.onload = init;
