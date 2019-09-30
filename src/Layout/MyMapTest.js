import React, { Component } from 'react';
import Rectangle from '../calculations/Rectangle.js';
import Drone from '../calculations/drone.js';
import Vector from '../calculations/Vector';
import Field from '../calculations/Field';
import { SIGTSTP } from 'constants';

// TODO: make photos of the field
// https://maps.googleapis.com/maps/api/staticmap?size=400x400&center=51.359313,25.499893&zoom=18&maptype=satellite&key=AIzaSyBkDqO4ZFc9wLSfg-6qHo5xdAGusxTsRyI

class MyMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],

      base: null,
      field: null,
      drone: null,
      readyForStart: false,

      currentLabelIdx: 0,
      labels: ['Set the base', 'Set the field'],

      map: null,
      drawingManager: null,
      selectedShape: null,
      colors: ['#1E90FF', '#FF1493', '#32CD32', '#FF8C00', '#4B0082'],
      selectedColor: null,
      colorButtons: {}
    };
    this.googleMapRef = React.createRef();
  }

  componentDidMount() {
    const googleMapScript = document.createElement('script');
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBkDqO4ZFc9wLSfg-6qHo5xdAGusxTsRyI&libraries=drawing`;
    window.document.body.appendChild(googleMapScript);

    googleMapScript.addEventListener('load', () => {
      this.initialize();
    });
  }

  clearSelection() {
    if (this.state.selectedShape) {
      if (this.state.selectedShape.type !== 'marker') {
        this.state.selectedShape.setEditable(false);
      }
      this.setState({
        selectedShape: null
      });
    }
  }

  setSelection(shape) {
    if (shape.type !== 'marker') {
      this.clearSelection.call(this);

      shape.setEditable(true);
      this.selectColor(shape.get('fillColor') || shape.get('strokeColor'));
    }

    this.setState({
      selectedShape: shape
    });
  }

  deleteSelectedShape() {
    if (this.state.selectedShape) {
      this.state.selectedShape.setMap(null);
    }
  }

  selectColor(color) {
    this.setState({
      selectedColor: color
    });

    let polygonOptions = this.state.drawingManager.get('polygonOptions');
    polygonOptions.fillColor = color;
    this.state.drawingManager.set('polygonOptions', polygonOptions);
  }

  setSelectedShapeColor(color) {
    if (this.state.selectedShape) {
      if (
        this.state.selectedShape.type ==
        window.google.maps.drawing.OverlayType.POLYLINE
      ) {
        this.state.selectedShape.set('strokeColor', color);
      } else {
        this.state.selectedShape.set('fillColor', color);
      }
    }
  }

  makeColorButton(color) {
    var button = document.createElement('span');
    button.className = 'color-button';
    button.style.backgroundColor = color;
    window.google.maps.event.addDomListener(button, 'click', function() {
      this.selectColor(color);
      this.setSelectedShapeColor(color);
    });

    return button;
  }

  initialize() {
    let map = new window.google.maps.Map(this.googleMapRef.current, {
      zoom: 16,
      center: {
        lat: 51.359313,
        lng: 25.499893
      },
      mapTypeId: window.google.maps.MapTypeId.SATELLITE,
      disableDefaultUI: true,
      zoomControl: true
    });

    var polyOptions = {
      strokeWeight: 0,
      fillOpacity: 0.45,
      editable: true,
      draggable: true
    };

    let that = this;

    let drawingManager = new window.google.maps.drawing.DrawingManager({
      drawingMode: window.google.maps.drawing.OverlayType.MARKER,
      drawingControlOptions: {
        position: window.google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ['marker', 'polygon', 'rectangle']
      },

      polygonOptions: polyOptions,
      markerOptions: {
        draggable: true,
        icon:
          'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
      }
    });
    drawingManager.setMap(map);

    window.google.maps.event.addListener(
      drawingManager,
      'polygoncomplete',
      polygon => {
        const polyArr = [];
        for (var i = 0; i < polygon.getPath().getLength(); i++) {
          polyArr.push({
            lat: polygon
              .getPath()
              .getAt(i)
              .lat(),
            lng: polygon
              .getPath()
              .getAt(i)
              .lng()
          });
        }
        // FIXME: not customizable at all

        this.setState({
          field: polyArr
        });

        if (!this.state.labels[this.state.currentLabelIdx + 1]) {
          this.stopDrawing();
          this.setState({
            readyForStart: true
          });
        }
        this.setState(state => {
          return {
            currentLabelIdx: state.currentLabelIdx + 1
          };
        });

        // this.stopDrawing();
      }
    );

    window.google.maps.event.addListener(
      drawingManager,
      'rectanglecomplete',
      rect => {
        let { bounds } = rect;

        let tr = {
            lat: bounds.getNorthEast().lat(),
            lng: bounds.getNorthEast().lng()
          },
          bl = {
            lat: bounds.getSouthWest().lat(),
            lng: bounds.getSouthWest().lng()
          };

        // let myRect = new Rectangle(tr, bl);
        let field = new Field({
          bounds: {
            tr,
            bl
          }
        });

        this.setState({
          field
        });

        if (!this.state.labels[this.state.currentLabelIdx + 1]) {
          this.stopDrawing();
          this.setState({
            readyForStart: true
          });
        }
        this.setState(state => {
          return {
            currentLabelIdx: state.currentLabelIdx + 1
          };
        });
      }
    );

    window.google.maps.event.addListener(
      drawingManager,
      'markercomplete',
      marker => {
        const pos = {
          lat: marker.getPosition().lat(),
          lng: marker.getPosition().lng()
        };

        this.setState({
          base: pos
        });

        if (!this.state.labels[this.state.currentLabelIdx + 1]) {
          this.stopDrawing();
          this.setState({
            readyForStart: true
          });
        }
        this.setState(state => {
          return {
            currentLabelIdx: state.currentLabelIdx + 1
          };
        });

        this.state.drawingManager.setDrawingMode(
          window.google.maps.drawing.OverlayType.RECTANGLE
        );
        console.log(
          (Math.cos(marker.getPosition().lat()) * 40000) / 360 / (40000 / 360)
        );

        // 0.0002 *
        // ((Math.cos(marker.getPosition().lng()) * 40000) /
        //   360 /
        //   (40000 / 360))
        this.state.drone = new Drone(
          {
            position: pos,
            speed: 0.000004,
            overlayRadiusLat: 0.0002,
            overlayRadiusLng:
              0.0002 /
              ((Math.cos(marker.getPosition().lat()) * 40000) /
                360 /
                (40000 / 360)), //
            direction: Math.PI / 2,
            targetMode: true,
            map: this.state.map,
            icon: {
              url: 'https://image.flaticon.com/icons/svg/215/215736.svg',
              scaledSize: new window.google.maps.Size(32, 32)
            }
          },
          window
        );

        // FIXME: not customizable at all
      }
    );

    // TODO: Delete map element
    // window.google.maps.event.addListener(drawingManager, 'overlaycomplete', (event) => {
    //   var element = event.overlay;
    //   window.google.maps.event.addListener(element, 'click', (e) => {
    //     element.setMap(null);
    //   });
    // });

    window.google.maps.event.addListener(
      drawingManager,
      'overlaycomplete',
      e => {
        var newShape = e.overlay;
        newShape.type = e.type;

        if (e.type !== window.google.maps.drawing.OverlayType.MARKER) {
          drawingManager.setDrawingMode(null);
          window.google.maps.event.addListener(newShape, 'click', function(e) {
            if (e.vertex !== undefined) {
              if (
                newShape.type === window.google.maps.drawing.OverlayType.POLYGON
              ) {
                var path = newShape.getPaths().getAt(e.path);
                path.removeAt(e.vertex);
                if (path.length < 3) {
                  newShape.setMap(null);
                }
              }
            }
            this.setSelection(newShape);
          });
          this.setSelection(newShape);
        } else {
          window.google.maps.event.addListener(newShape, 'click', function(e) {
            this.setSelection(newShape);
          });
          this.setSelection(newShape);
        }
      }
    );

    window.google.maps.event.addListener(
      drawingManager,
      'drawingmode_changed',
      () => this.clearSelection.call(that)
    );

    window.google.maps.event.addListener(map, 'click', () =>
      this.clearSelection.call(that)
    );

    this.setState({
      drawingManager: drawingManager,
      map: map
    });
  }

  stopDrawing() {
    this.state.drawingManager.setMap(null);
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

  startFlight() {
    let that = this;
    this.state.drone.setField(this.state.field);
    let target = this.state.drone.findClosestPoint(
      this.state.field.bounds.toArray()
    );
    // console.log('target.add(this.state.drone.overlayRadiusLat, this.state.drone.overlayRadiusLng) :', target.add(new Vector(this.state.drone.overlayRadiusLat, this.state.drone.overlayRadiusLng)));
    // this.state.drone.addToPath(target.add(new Vector(this.state.drone.overlayRadiusLat, this.state.drone.overlayRadiusLng)));

    this.state.field.setSquareRadius(this.state.drone.overlayRadiusLng);
    this.state.field.distributeOnSquares();

    this.state.drone.addToPath(this.state.drone.mapToCenter(target));
    this.update.call(that);
    console.log('this.state.drone :', this.state.drone);
  }

  update() {
    this.state.drone.update();
    if (!this.state.drone.finishedFlight) {
      setTimeout(() => {
        this.update.call(this);
      }, 1);
    }
    // requestAnimationFrame(this.update.call(this));
  }

  testSetup() {}

  render() {
    const { labels, currentLabelIdx, readyForStart } = this.state;
    let that = this;
    return (
      <div className="relative">
        <div
          id="help-container"
          style={{ display: labels[currentLabelIdx] ? 'flex' : 'none' }}
        >
          {labels[currentLabelIdx]}
        </div>

        <button
          onClick={() => this.startFlight.call(that)}
          className="start-flight-button click-scale-down bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          style={{ display: readyForStart ? 'block' : 'none' }}
        >
          Start
        </button>

        <div
          ref={this.googleMapRef}
          id="google-map"
          className="card-panel white map-holder"
        ></div>
      </div>
    );
  }
}
export default MyMap;
