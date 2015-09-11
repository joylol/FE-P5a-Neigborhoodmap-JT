var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map-div'), {
    center: {lat: 33.024819, lng: -96.885055},
    zoom: 12
  });
}