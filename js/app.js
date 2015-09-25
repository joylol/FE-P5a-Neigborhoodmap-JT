/*Array of locations*/
var favoritePlaces = [
  {
    name: 'Cityplace/Uptown (DART station)',
    lat: 32.805600, 
    lng: -96.793870,
    text: 'The only in Dallas where you can be 120 ft underground, ride a slanted elevator, and pretend you are in New York City or another major city with underground subways'
  },
  {
    name: 'McKinney Avenue Transit Authority',
    lat: 32.805854,
    lng: -96.793808,
    text: 'Catch a ride here on a historic trolley through uptown to downtown Dallas.'
  },
  {
    name: 'Klyde Warren Park',
    lat: 32.789415, 
    lng: -96.801788,
    text: 'A small park on top of a highway in downtown Dallas with lots of free activities and food trucks to choose from.'
  },
  {
    name: 'Morton H. Meyerson Symphony Center',
    lat: 32.789784,
    lng: -96.798599,
    text: 'A wonderful place for great music and the best bread pudding.'
  },
  {
    name: 'Perot Museum of Nature and Science',
    lat: 32.786891, 
    lng: -96.806698,
    text: 'Great place for kids to interact with exhibits showcasing human body, robotics, dinosaurs, earth, space, and birds. There is also a play place for young kids.'
  },
  {
    name: 'Fountain Place',
    lat: 32.784423,
    lng: -96.802311,
    text: 'My favorite building in downtown Dallas. It is surrounded by fountains and trees, which is as calming as it is beautiful.'
  },
  {
    name: 'Fair Park',
    lat: 32.781592, 
    lng: -96.761702,
    text: 'Come here for the Texas State Fair, ride the Texas Star Ferris Wheel (tallest in the USA), and eat fun fried foods like funnel cakes.'
  },
  {
    name: 'Thanks-Giving Square',
    lat: 32.782668,
    lng: -96.798472,
    text: 'Visit the chapel to see beautiful spiral stained-glass.'
  },
  {
    name: 'Reunion Tower',
    lat: 32.775636, 
    lng: -96.808974,
    text: 'Eat here - the floor makes a full revolution each hour. You will get a full 360 view of Dallas.'
  },
  {
    name: 'Dallas Museum of Art',
    lat: 32.787642,
    lng: -96.800789,
    text: 'Free art museum with frequent Friday and Thursday night concerts and events.'
  }
];

/*Set up Google map*/
var dallas = new google.maps.LatLng(32.791545, -96.786556);
var map = new google.maps.Map($('#map')[0], {
  center: dallas,
  zoom: 13,
  mapTypeControl: false,
  panControl: false,
  streetViewControl: false,
  zoomControl: false
}); 

/* Represents a location.
 * @constructor
 * @param {object} name, lat, lng, text - from favoritePlaces array.
 */
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
  
  /*Pans to marker, opens infowindow, and animates marker.*/
  this.openInfoWindow = function() {
    map.panTo(this.marker.position);
    this.infowindow.open(map, this.marker);
    this.marker.setAnimation(google.maps.Animation.BOUNCE);
    this.marker.setAnimation(null); //causes the marker to bounce once
  }.bind(this);

  this.marker.addListener('click', this.openInfoWindow.bind(this));

  this.isVisible = ko.observable(true);

  /*Hides or make visible markers on the map.*/
  this.isVisible.subscribe(function(currentState) {
    if (currentState) {
      this.marker.setMap(map);
    } else {
      this.marker.setMap(null);
    }
  }.bind(this)); 

  /*URL for Wikipedia API*/
  this.wikiAPI = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + name + '&format=json&callback=wikiCallbackFunction';

  /*Error response for a Wikipedia response*/
  var wikiRequestTimeout = setTimeout(function() {
        this.infowindow.content += 'Error loading Wikipedia links! Please try again later.';
    }, 8000);

  /* Fetches meetups via JSON-P from Wikipedia API
   * @params {string} url - Wikipedia API URL 
   */
  $.ajax({
    url: this.wikiAPI,
    dataType: "jsonp",
    success: function(response) {
      //if fetch is successful, create variables to store response
      var wikiArticlesName = response[1];
      var wikiArticlesSnippet = response[2];

      //Loop through response and add push data to infowindow content
      for(var i = 0; i < wikiArticlesName.length; i++) {
        var articleName = wikiArticlesName[i];
        var articleSnippet = wikiArticlesSnippet[i];
        var url = 'http://en.wikipedia.org/wiki/' + articleName;
        this.infowindow.content += '<h6>Wikipedia:</h6>' + '<h6><a href="' + url + '">' + articleName + '</a></h6>' + '<p>' + articleSnippet + '</p>';
      };

      //Cancel error response.
      clearTimeout(wikiRequestTimeout);

    }.bind(this)
  });
};

/*Application View Model*/
var viewModel = function() {

  /*Makes locations observable*/
  this.locations = ko.observableArray([]);

  //Pushes each place object from favoritePlace array into this.locations
  favoritePlaces.forEach(function(place){
    this.locations.push(new Place(place.name, place.lat, place.lng, place.text));
  }, this); 

  /*Search query, bound to #searchArea input box*/
  this.filter = ko.observable('');

  /*Filters search query*/
  this.filteredItems = ko.dependentObservable(function() {
    var filter = this.filter().toLowerCase();
    //If there is no search query, keep all markers and locations visible 
    if(!filter) {
      ko.utils.arrayFilter(this.locations(), function(location) {
        location.isVisible(true);
      });
      return this.locations();
    } else {  
        return ko.utils.arrayFilter(this.locations(), function(location) {
          //Match search query to location names
          var doesMatch = location.name().toLowerCase().indexOf(filter) >= 0;
          //Display only markers that match search query
          location.isVisible(doesMatch);
          //Display only locations that match in the list
          return doesMatch;
        });
    }
  }, this);

  /*Opens infowindow when location on list is clicked*/
  this.openLocationWindow = function(clickedLocation) {
    clickedLocation.openInfoWindow();
  };
};

ko.applyBindings(new viewModel());







