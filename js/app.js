var favoritePlaces = [
  {
    name: 'Arbor Hills Nature Preserve',
    lat: 33.048430,
    lng: -96.851033,
    text: 'A beautiful park'
  },
  {
    name: 'Sprouts',
    lat: 33.025549,
    lng: -96.888284,
    text: 'A small grocery store with lots of natural and organic items'
  },
  {
    name: 'Carrollton Public Library',
    lat: 33.026226,
    lng: -96.883365,
    text: 'A modern neighborhood public library'
  },
  {
    name: 'HMart',
    lat: 32.984694,
    lng: -96.912247,
    text: 'A Korean Asian grocery store or supermarket'
  },
  {
    name: 'The Shops at Willow Bend',
    lat: 33.030992,
    lng: -96.832434,
    text: 'A clean, uncrowded, upscale mall'
  }
];

var map;

function initMap() {
  var carrollton = new google.maps.LatLng(33.024819,-96.885055);
  map = new google.maps.Map(document.getElementById('map'), {
      center: carrollton,
      zoom: 13
  });

  setMarkers(map);
}

function setMarkers(map) {
  for(var i = 0; i < favoritePlaces.length; i++) {
    var favoritePlace = favoritePlaces[i];
    var marker = new google.maps.Marker({
      position: {lat: favoritePlace.lat, lng: favoritePlace.lng},
      map: map,
      title: favoritePlace.name
    });
  }
}

initMap();
