var favoritePlaces = [
  {
    name: 'Arbor Hills Nature Preserve',
    lat: 33.048430,
    lng: -96.851033,
    text: 'A beautiful park with hiking and biking trails'
  },
  {
    name: 'Sprouts Farmers Market',
    lat: 33.025549,
    lng: -96.888284,
    text: 'A small grocery store with organic items, cheap produce, and great chocolate chip cookies'
  },
  {
    name: 'Carrollton Public Library',
    lat: 33.026226,
    lng: -96.883365,
    text: 'A modern neighborhood public library that hosts family activities'
  },
  {
    name: 'H Mart',
    lat: 32.984694,
    lng: -96.912247,
    text: 'A Korean Asian grocery store with an Asian food court'
  },
  {
    name: 'The Shops at Willow Bend',
    lat: 33.030992,
    lng: -96.832434,
    text: 'A clean, uncrowded, upscale mall with a train and play area for kids'
  },
  {
    name: 'Nebraska Furniture Mart',
    lat: 33.071394, 
    lng: -96.865881,
    text: 'A huge furniture and home appliances/electronics store that will price-match'
  }
];

var carrollton = new google.maps.LatLng(33.024819,-96.873055);
var map = new google.maps.Map(document.getElementById('map'), {
  center: carrollton,
  zoom: 12,
  mapTypeControl: false,
  panControl: false,
  streetViewControl: false,
  zoomControl: false
}); 


var Place = function(name, lat, lng, text) {
  this.name = ko.observable(name);
  this.lat = ko.observable(lat);
  this.lng = ko.observable(lng);
  this.text = ko.observable(text);

  this.marker = new google.maps.Marker({
    position: new google.maps.LatLng(lat, lng),
    title: name,
    map: map,
    optimized: false //stops marker from flashing before animating
  });

  this.infowindow = new google.maps.InfoWindow({
    content: '<div class="info-window-content">' + '<h4>' + name + '</h4>' + '<p>' + text + '</p>' + '</div>',
    maxWidth: 200
  });
  
  this.openInfoWindow = function() {
    map.panTo(this.marker.position);
    this.infowindow.open(map, this.marker);
    this.marker.setAnimation(google.maps.Animation.BOUNCE);
    this.marker.setAnimation(null); //causes the marker to bounce once
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


  this.wikiAPI = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + name + '&format=json&callback=wikiCallbackFunction';

  var wikiRequestTimeout = setTimeout(function() {
        this.infowindow.content += 'Error loading Wikipedia links! Please try again later.';
    }, 8000);

  $.ajax({
    url: this.wikiAPI,
    dataType: "jsonp",
    success: function(response) {
      var wikiArticlesName = response[1];
      var wikiArticlesSnippet = response[2];
      console.log(wikiArticlesName);

      for(var i = 0; i < wikiArticlesName.length; i++) {
        var articleName = wikiArticlesName[i];
        var articleSnippet = wikiArticlesSnippet[i];
        var url = 'http://en.wikipedia.org/wiki/' + articleName;
        this.infowindow.content += '<h6>Wikipedia:</h6>' + '<h6><a href="' + url + '">' + articleName + '</a></h6>' + '<p>' + articleSnippet + '</p>';
      };

      clearTimeout(wikiRequestTimeout);

    }.bind(this)
  });
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







