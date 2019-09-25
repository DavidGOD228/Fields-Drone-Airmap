import React, { Component } from "react";

class MyMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      this.clearSelection();
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

    const bufButtonsArr = this.state.colorButtons;
    for (var i = 0; i < this.state.colors.length; ++i) {
      var currColor = this.state.colors[i];
      bufButtonsArr[currColor].style.border =
        currColor == color ? "2px solid #789" : "2px solid #fff";
    }
    
    this.setState({
      colorButtons: bufButtonsArr
    })

    let polygonOptions = this.state.this.state.drawingManager.get("polygonOptions");
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

  buildColorPalette() {
    var colorPalette = document.getElementById("color-palette");
    const bufArr = this.state.colorButtons;
    for (var i = 0; i < this.state.colors.length; ++i) {
      var currColor = this.state.colors[i];
      var colorButton = this.makeColorButton(currColor);
      colorPalette.appendChild(colorButton);
      bufArr[currColor] = colorButton;
    }
    this.setState({
      colorButtons: bufArr
    })
    this.selectColor(this.state.colors[0]);
  }

  initialize() {
    
    var map = new window.google.maps.Map(this.googleMapRef.current, {
      zoom: 16,
      center: {
        lat: 43.642567,
        lng: -79.387054
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
    let drawingManager = new window.google.maps.drawing.DrawingManager({
      drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
      drawingControlOptions: {
        position: window.google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ['marker', 'polygon']
      },
      markerOptions: {
        draggable: false
      },
      polygonOptions: polyOptions,
      markerOptions: {
        icon:
          'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
      }
    });
    drawingManager.setMap(map);
    
    this.setState({
      drawingManager: drawingManager,
      map: map
    })

    window.google.maps.event.addListener(
      this.state.drawingManager,
      "overlaycomplete",
      function(e) {
        var newShape = e.overlay;

        newShape.type = e.type;

        if (e.type !== window.google.maps.drawing.OverlayType.MARKER) {
          // Switch back to non-drawing mode after drawing a shape.
          this.state.drawingManager.setDrawingMode(null);

          // Add an event listener that selects the newly-drawn shape when the user
          // mouses down on it.
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
      this.state.drawingManager,
      "drawingmode_changed",
      this.clearSelection
    );
    window.google.maps.event.addListener(map, "click", this.clearSelection);
    window.google.maps.event.addDomListener(
      document.getElementById("delete-button"),
      "click",
      this.deleteSelectedShape
    );

    this.buildColorPalette();
  }

  createGoogleMap() {
    return new window.google.maps.Map(this.googleMapRef.current, {
      zoom: 16,
      center: {
        lat: 43.642567,
        lng: -79.387054
      },
      disableDefaultUI: true
    });
  }

  render() {
    // const { labels, currentLabelIdx } = this.state;
    // console.log("labels :", labels);
    // console.log("currentLabelIdx :", currentLabelIdx);
    return (
      <div className="relative">
        {/* <div id="help-container">{labels[currentLabelIdx]}</div> */}
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
