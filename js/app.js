var map;
var service;
var infowindow;

function initialize() {
  var carrollton = new google.maps.LatLng(33.024819,-96.885055);
 	map = new google.maps.Map(document.getElementById('map-div'), {
   		center: carrollton,
    	zoom: 13
  });

	var request = {
		location: carrollton,
		radius: '500',
		query: 'park'
	};

  infowindow = new google.maps.InfoWindow();

  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      //var place = results[i];
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}

initialize();