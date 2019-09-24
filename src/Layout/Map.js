// import React, { Component } from 'react'
// import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
// import maps from "@google/maps";

// let googleMaps = maps.createClient({
//   key: 'your API key here'
// });

// class MyMap extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       map: null
//     } 
//   }

//   componentDidMount() {
//     this.setState({
//       map: new google.maps.Map(document.getElementById('map'), {
//         center: {lat: -34.397, lng: 150.644},
//         zoom: 8
//       })
//     })
//   }
  
//   render() {
//     return (
//       <div className="w-full">
//         <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDWANjp4pZTM0TSK2Ic43JvHiK1yg_b_ec&callback=initMap"
//           async defer></script>
//         <div id="map"></div>
//       </div>  
//     )
//   }
// }

// export default MyMap;



import React, { Component } from 'react'
import { Map, GoogleApiWrapper, Marker,GoogleMapReact } from 'google-maps-react';

class MyMap extends Component {
  render() {
    return (
      <div className="w-full">
        <Map
          google={this.props.google}
          zoom={8}
          style={mapStyles}
          initialCenter={{ lat: 47.444, lng: -122.176}}
        >
          <Marker position={{ lat: 48.00, lng: -122.00}} />
        </Map>
      </div>
    )
  }
}

const mapStyles = {
  width: '100%',
  height: '100vh',
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyBkDqO4ZFc9wLSfg-6qHo5xdAGusxTsRyI"
})(MyMap);

