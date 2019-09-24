import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

class SimpleMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: {
        lat: 59.95,
        lng: 30.33
      },
      zoom: 11
    };
  }

  // static defaultProps = {
  //   center: {
  //     lat: 59.95,
  //     lng: 30.33
  //   },
  //   zoom: 11
  // };

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyDWANjp4pZTM0TSK2Ic43JvHiK1yg_b_ec" }}
          defaultCenter={this.state.center}
          defaultZoom={this.state.zoom}
        >
          <AnyReactComponent
            lat={59.955413}
            lng={30.337844}
            text="My Marker"
          />
        </GoogleMapReact>
      </div>
    );
  }
}

export default SimpleMap;