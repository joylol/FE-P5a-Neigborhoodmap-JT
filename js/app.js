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
  zoom: 12
}); 


var Place = function(name, lat, lng, text) {
  this.name = ko.observable(name);
  this.lat = ko.observable(lat);
  this.lng = ko.observable(lng);
  this.text = ko.observable(text);

  this.marker = new google.maps.Marker({
    position: new google.maps.LatLng(lat, lng),
    title: name,
    map: map
  });

  this.infowindow = new google.maps.InfoWindow({
    content: name
  });

  this.openInfoWindow = function() {
    this.infowindow.open(map, this.marker);
  }.bind(this);

  this.marker.addListener('click', this.openInfoWindow.bind(this));

  this.isVisible = ko.observable(true);

  this.isVisible.subscribe(function(currentState) {
    if (currentState) {
      this.marker.setMap(map);
    } else {
      this.marker.setMap(null);
    }
  }.bind(this)); 
};

var viewModel = function() {

  this.locations = ko.observableArray([]);

  favoritePlaces.forEach(function(place){
    this.locations.push(new Place(place.name, place.lat, place.lng, place.text));
  }, this); 
 
  this.filter = ko.observable('');

  this.filteredItems = ko.dependentObservable(function() {
    var filter = this.filter().toLowerCase();
    if(!filter) {
      ko.utils.arrayFilter(this.locations(), function(location) {
        location.isVisible(true);
      });
      return this.locations();
    } else {
        return ko.utils.arrayFilter(this.locations(), function(location) {
          var doesMatch = location.name().toLowerCase().indexOf(filter) >= 0;
          location.isVisible(doesMatch);
          return doesMatch;
        });
    }
  }, this);
  
  this.openLocationWindow = function(clickedLocation) {
    clickedLocation.openInfoWindow();
  };
};


ko.applyBindings(new viewModel());







