import React, { Component } from 'react';

class MyMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      map: null,
      drawingManager: null,
      polygonArray: [],
      
      currentLabelIdx: 0,
      labels: [
        "Set the base",
        "Set the field"
      ]
    };
    this.googleMapRef = React.createRef();
  }

  componentDidMount() {
    const googleMapScript = document.createElement('script');
    console.log("AIzaSyDWANjp4pZTM0TSK2Ic43JvHiK1yg_b_ec");
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBkDqO4ZFc9wLSfg-6qHo5xdAGusxTsRyI&libraries=drawing`;
    //const googleDrawMapScript = document.createElement('script');
    // googleDrawMapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBkDqO4ZFc9wLSfg-6qHo5xdAGusxTsRyI&libraries=drawing`;
    window.document.body.appendChild(googleMapScript);
    // window.document.body.appendChild(googleDrawMapScript);
    googleMapScript.addEventListener('load', () => {
      const googleMap = this.createGoogleMap();
      const drawingManager = new window.google.maps.drawing.DrawingManager({
        drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
          position: window.google.maps.ControlPosition.TOP_CENTER,
          drawingModes: ['marker', 'polygon']
        },
        markerOptions: {
          icon:
            'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        },
        circleOptions: {
          fillColor: '#ffff00',
          fillOpacity: 1,
          strokeWeight: 5,
          clickable: false,
          editable: true,
          zIndex: 1
        }
      });
      drawingManager.setMap(googleMap);

      window.google.maps.event.addListener(drawingManager, 'polygoncomplete', function(polygon) {
        const polyArr = []
        for (var i = 0; i < polygon.getPath().getLength(); i++) {
          polyArr.push({
            lat: polygon.getPath().getAt(i).lat(),
            lng: polygon.getPath().getAt(i).lng()  
          });
        }
      });
      window.google.maps.event.addListener(drawingManager, 'markercomplete', function(marker) {
        const pos = {
          lat: marker.getPosition().lat(),
          lng: marker.getPosition().lng()
        }
        console.log('homeMarker.getPosition():', pos);
      });

      this.setState({
        map: googleMap,
        drawingManager: drawingManager
      })
    });

    

    // // Add a listener for the click event
    // window.google.maps.event.addListener(map, 'click', function(event) {
    //   addLatLngToPoly(event.latLng, poly);
    // });


    // https://maps.googleapis.com/maps/api/staticmap?size=400x400&center=44.714728,-73.998672&zoom=18&maptype=satellite&key=AIzaSyBkDqO4ZFc9wLSfg-6qHo5xdAGusxTsRyI
    let photos  = this.makePhotos([
      { lat: 43.642567, lng: -79.387054 },
      { lat: 43.642567, lng: -49.387054 },
      { lat: 23.642567, lng: -79.387054 },
      { lat: 43.642567, lng: -19.387054 },
      { lat: 23.642567, lng: -69.387054 }
    ]);
    console.log('photos :', photos);

    this.setState({
      photos: photos
    });
  }

  addLatLngToPoly(latLng, poly) {
    var path = poly.getPath();
    path.push(latLng);
    var encodeString = window.google.maps.geometry.encoding.encodePath(path);
    console.log('encodeString :', encodeString);
    // if (encodeString) {
    //   document.getElementById('encoded-polyline').value = encodeString;
    // }
  }

  makePhotos(points, settings = {
    size: "400x400",
    zoom: 18,
    maptype: "satellite",
    key: "AIzaSyBkDqO4ZFc9wLSfg-6qHo5xdAGusxTsRyI"
  }) {
    console.log('settings :', settings);
    const base = "https://maps.googleapis.com/maps/api/staticmap";
    let buf = [];
    for(let i = 0; i < points.length; i++) {
      settings.center = points[i].lat + "," + points[i].lng;
      buf.push(this.mashLink(base, settings))
    }

    return buf;
  }

  mashLink(base, params) {
    const ps = Object.entries(params);
    let res = base;

    for(let i = 0; i < ps.length; i++) {
      res += i === 0 ? "?" : "&";
      res += ps[i][0] + "=" + ps[i][1];
    }

    return res;
  }

  createGoogleMap() {
    return new window.google.maps.Map(this.googleMapRef.current, {
      zoom: 16,
      center: {
        lat: 43.642567,
        lng: -79.387054
      },
      mapTypeId: window.google.maps.MapTypeId.SATELLITE,
      disableDefaultUI: true
    });
  }

  render() {
    const { labels, currentLabelIdx } = this.state;
    console.log('labels :', labels);
    console.log('currentLabelIdx :', currentLabelIdx);
    return (
      <div className="relative">
        <div id="help-container">
          { labels[currentLabelIdx] }
        </div>
        <div
          ref={this.googleMapRef}
          id="google-map"
          className="card-panel white map-holder"
        >
        </div>
      </div>
    );
  }
}
export default MyMap;