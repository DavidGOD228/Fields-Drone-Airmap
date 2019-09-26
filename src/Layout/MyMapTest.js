import React, { Component } from "react";

class MyMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],

      base: null,
      field: null,
      readyForStart: false,

      currentLabelIdx: 0,
      labels: [
        "Set the base",
        "Set the field"
      ],
      
      map: null,
      drawingManager: null,
      selectedShape: null,
      colors: ["#1E90FF", "#FF1493", "#32CD32", "#FF8C00", "#4B0082"],
      selectedColor: null,
      colorButtons: {}
    };
    this.googleMapRef = React.createRef();
  }

  componentDidMount() {
    const googleMapScript = document.createElement("script");
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBkDqO4ZFc9wLSfg-6qHo5xdAGusxTsRyI&libraries=drawing`;
    window.document.body.appendChild(googleMapScript);

    googleMapScript.addEventListener("load", () => {
      this.initialize();
    });
  }

  clearSelection() {
    if (this.state.selectedShape) {
      if (this.state.selectedShape.type !== "marker") {
        this.state.selectedShape.setEditable(false)
      }
      this.setState({
        selectedShape: null
      })
    }
  }

  setSelection(shape) {
    if (shape.type !== "marker") {
      this.clearSelection.call(this);

      shape.setEditable(true);
      this.selectColor(shape.get("fillColor") || shape.get("strokeColor"));
    }

    this.setState({
      selectedShape: shape
    })
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

    let polygonOptions = this.state.drawingManager.get("polygonOptions");
    polygonOptions.fillColor = color;
    this.state.drawingManager.set("polygonOptions", polygonOptions);
  }

  setSelectedShapeColor(color) {
    if (this.state.selectedShape) {
      if (
        this.state.selectedShape.type == window.google.maps.drawing.OverlayType.POLYLINE
      ) {
        this.state.selectedShape.set("strokeColor", color);
      } else {
        this.state.selectedShape.set("fillColor", color);
      }
    }
  }

  makeColorButton(color) {
    var button = document.createElement("span");
    button.className = "color-button";
    button.style.backgroundColor = color;
    window.google.maps.event.addDomListener(button, "click", function() {
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
        drawingModes: ['marker', 'polygon']
      },
      
      polygonOptions: polyOptions,
      markerOptions: {
        draggable: true,
        icon:
          'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
      }
    });
    drawingManager.setMap(map);

    window.google.maps.event.addListener(drawingManager, 'polygoncomplete', (polygon) => {
      const polyArr = []
      for (var i = 0; i < polygon.getPath().getLength(); i++) {
        polyArr.push({
          lat: polygon.getPath().getAt(i).lat(),
          lng: polygon.getPath().getAt(i).lng()  
        });
      }
      console.log('polyArr :', polyArr);
      // FIXME: not customizable at all 


      this.setState({
        field: polyArr
      })

      if(!this.state.labels[this.state.currentLabelIdx + 1]) { 
        this.stopDrawing();
        this.setState({
          readyForStart: true
        })
      }
      this.setState(state => {
        return {
          currentLabelIdx: state.currentLabelIdx + 1,
        }
      })

      // this.stopDrawing();
    });

    window.google.maps.event.addListener(drawingManager, 'markercomplete', (marker) => {
      const pos = {
        lat: marker.getPosition().lat(),
        lng: marker.getPosition().lng()
      }
      console.log('homeMarker.getPosition():', pos);

      this.setState({
        base: pos
      })
    
      if(!this.state.labels[this.state.currentLabelIdx + 1]) { 
        this.stopDrawing();
        this.setState({
          readyForStart: true
        })
      }
      this.setState(state => {
        return {
          currentLabelIdx: state.currentLabelIdx + 1
        }
      })

      this.state.drawingManager.setDrawingMode(window.google.maps.drawing.OverlayType.POLYGON);

      this.createDrone({
        position: pos,
        map: this.state.map,
        icon: {
          url: "https://image.flaticon.com/icons/svg/215/215736.svg",
          scaledSize: new window.google.maps.Size(32, 32)
        }
      })
    

      // FIXME: not customizable at all 
    });

    // TODO: Delete map element
    // window.google.maps.event.addListener(drawingManager, 'overlaycomplete', (event) => {
    //   var element = event.overlay;
    //   window.google.maps.event.addListener(element, 'click', (e) => {
    //     element.setMap(null);
    //   });
    // });

    window.google.maps.event.addListener(
      drawingManager,
      "overlaycomplete",
      (e) => {
        var newShape = e.overlay;

        newShape.type = e.type;

        if (e.type !== window.google.maps.drawing.OverlayType.MARKER) {
          drawingManager.setDrawingMode(null);
          window.google.maps.event.addListener(newShape, "click", function(e) {
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
          window.google.maps.event.addListener(newShape, "click", function(e) {
            this.setSelection(newShape);
          });
          this.setSelection(newShape);
        }
      }
    );

    window.google.maps.event.addListener(
      drawingManager,
      "drawingmode_changed",
      () => this.clearSelection.call(that)
    );

    window.google.maps.event.addListener(map, "click", () => this.clearSelection.call(that));

    this.setState({
      drawingManager: drawingManager,
      map: map
    })
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

  createDrone(options, place) {
    let marker = new window.google.maps.Marker(options);
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

  render() {
    const { labels, currentLabelIdx, readyForStart } = this.state;
    console.log('readyForStart :', readyForStart);
    return (
      <div className="relative">
        <div 
          id="help-container" 
          style={{display: labels[currentLabelIdx] ? 'flex' : 'none' }}
        >
          {labels[currentLabelIdx]}
        </div>

        <button 
          className="start-flight-button click-scale-down bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          style={{display: readyForStart ? "block" : "none" }}
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
