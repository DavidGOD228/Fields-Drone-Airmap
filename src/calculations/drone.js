export class Drone {
  constructor(options, window) {
    this.optionsLocal = options;
    this.window = window;
    this.marker = new window.google.maps.Marker(options);
    // this.setState({
    //   drone: this.state.base
    // });

    // marker.place_id = place.id;
    // markers[place.id] = marker;
    // let infowindow = new window.google.maps.InfoWindow({
    //   content: place.details
    // });

    // infowindows[place.id] = infowindow;

    // window.google.maps.event.addListener(marker, 'click', function() {
    //   // infowindows[marker.place_id].open(map,marker);
    // });
  }
  goToTopLeft(field) {
    this.marker.setPosition(
      new this.window.google.maps.LatLng(field.br.lat, field.br.lng)
    );
  }

  start() {}

  moveTop() {
    this.optionsLocal.position.lat += 0.00004;
    this.marker.setPosition(
      new this.window.google.maps.LatLng(
        this.optionsLocal.position.lat,
        this.optionsLocal.position.lng
      )
    );
  }
  moveDown() {
    this.optionsLocal.position.lat -= 0.00004;
    this.marker.setPosition(
      new this.window.google.maps.LatLng(
        this.optionsLocal.position.lat,
        this.optionsLocal.position.lng
      )
    );
  }
  moveLeft() {
    this.optionsLocal.position.lng -= 0.00004;
    this.marker.setPosition(
      new this.window.google.maps.LatLng(
        this.optionsLocal.position.lat,
        this.optionsLocal.position.lng
      )
    );
  }
  moveRight() {
    this.optionsLocal.position.lng += 0.00004;
    this.marker.setPosition(
      new this.window.google.maps.LatLng(
        this.optionsLocal.position.lat,
        this.optionsLocal.position.lng
      )
    );
  }
}
