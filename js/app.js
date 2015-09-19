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



var carrollton = new google.maps.LatLng(33.024819,-96.885055);
var map = new google.maps.Map(document.getElementById('map'), {
  center: carrollton,
  zoom: 13
}); 


function Place(name, lat, lng, text) {
  this.name = ko.observable(name);
  this.lat = ko.observable(lat);
  this.lng = ko.observable(lng);
  this.text = ko.observable(text);
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(lat, lng),
    title: name,
    map: map
  });

  this.isVisible = ko.observable(false);

  this.isVisible.subscribe(function(currentState) {
    if (currentState) {
      marker.setMap(map);
    } else {
      marker.setMap(null);
    }
  });

  this.isVisible(true);
}

var placesArrayMap = ko.utils.arrayMap(favoritePlaces, function(place) {
  return new Place(place.name, place.lat, place.lng, place.text);
});

var viewModel = {
  locations: ko.observableArray([]),
  filter: ko.observable('')
};

ko.utils.stringStartsWith = function (string, startsWith) {         
      string = string || "";
      if (startsWith.length > string.length)
          return false;
      return string.substring(0, startsWith.length) === startsWith;
}

viewModel.filteredItems = ko.dependentObservable(function() {
  var filter = this.filter().toLowerCase();
  if(!filter) {
    return this.locations();
  } else {
      return ko.utils.arrayFilter(this.locations(), function(location) {
        var doesMatch = location.name().toLowerCase().indexOf(filter) >= 0;
        location.isVisible(doesMatch);
        return doesMatch;
      });
  }
}, viewModel);

viewModel.locations(placesArrayMap);

ko.applyBindings(viewModel);







