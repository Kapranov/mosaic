App = Ember.Application.create();

App.Router.map(function() {
  this.route("index", { path: "/" });
  this.route("locations", { path: "/locations" });
  this.route("about", { path: "/about" });
});

App.LocationsRoute = Ember.Route.extend({
  model: function() {
    return {
      locations: [
        Ember.Object.create({ name: 'London', latitude: 51.5085300, longitude: -0.1257400 }),
        Ember.Object.create({ name: 'New York', latitude: 40.7142700 , longitude: -74.0059700 }),
        Ember.Object.create({ name: 'Moskow', latitude: 55.7522200, longitude: 37.6155600 }),
        Ember.Object.create({ name: 'Sydnay', latitude: -33.8678500, longitude: 151.2073200 }),
        Ember.Object.create({ name: 'Buenos Aires', latitude: -34.6131500, longitude: -58.3772300 })
      ],

      markers: [
        Ember.Object.create({ latitude: 50.08703, longitude: 14.42024 }),
        Ember.Object.create({ latitude: 50.08609, longitude: 14.42091 }),
        Ember.Object.create({ latitude: 40.71356, longitude: -74.00632 }),
        Ember.Object.create({ latitude: -33.86781, longitude: 151.20754 })
      ]
    };
  }
});

App.Marker = Ember.Object.extend({
});

App.InlineTextField = Ember.TextField.extend({
  focusOut: function() {
    this.set('blurredValue', this.get('value'));
  }
});


App.MapView = Ember.View.extend({
  id: 'map_canvas',
  tagName: 'div',

  attributeBindings: ['style'],
  style:"width:100%; height:200px",
  didInsertElement: function() {
    var mapOptions = {
      center: new google.maps.LatLng(37.871667, -122.272778),
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var controller = this.get("controller");
    var map = new google.maps.Map(this.$().get(0),mapOptions);
    var triggerButton = $('#' + this.get("triggerButton"));

    console.log("found triggerButton" + triggerButton);

    var that = this;
    triggerButton.click(function () {
      that.loadDirections();
      return false;
    });

    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);

    this.set("map",map);

    var that = this;
  },
  loadDirections: function() {
    console.log("Observed content change in the index controller.... should update.....")

    from = this.get("from");
    to = this.get("to");

    if (from && to) {

    console.log("Loading up direction from " + from + " to " + to);

    var directionsService = new google.maps.DirectionsService();

     var request = {
      origin:from,
      destination:to,
      travelMode: google.maps.DirectionsTravelMode.DRIVING
      };
      directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
        }
      });

    } else {
      console.log("Need both a from and a to");
    }


  }.observes("from","to")
});

App.IndexController = Ember.ArrayController.extend({
  fromToChanged: function() {
    console.log("fromToChanged")
  }.observes("from"),

  directionsText: function() {
    return "Going from " + this.get("from") + " to " + this.get("to");
  }.property("from")
});

App.GoogleMapsComponent = Ember.Component.extend({
  insertMap: function() {
    var container = this.$('.map-canvas');

    var options = {
      center: new google.maps.LatLng(this.get('latitude'),
this.get('longitude')),
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.set('map', new google.maps.Map(container[0], options));
    this.set('markerCache', []);

    this.setMarkers();
  }.on('didInsertElement'),

  coordinatesChanged: function() {
    var map = this.get('map');

    if (map) map.setCenter(new google.maps.LatLng(this.get('latitude'), this.get('longitude')));
  }.observes('latitude', 'longitude'),

  setMarkers: function() {
    var map = this.get('map'),
        markers = this.get('markers'),
        markerCache = this.get('markerCache');

    markerCache.forEach(function(marker) { marker.setMap(null); });

    markers.forEach(function(marker){
      var gMapsMarker = new google.maps.Marker({
        position: new google.maps.LatLng(marker.get('latitude'), marker.get('longitude')),
        map: map
      });

      markerCache.pushObject(gMapsMarker);
    }, this);
  }.observes('markers.@each.latitude', 'markers.@each.longitude')
});
