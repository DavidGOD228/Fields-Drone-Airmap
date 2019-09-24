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

// https://maps.googleapis.com/maps/api/staticmap?center=Brooklyn+Bridge,New+York,NY&zoom=8&size=600x300&maptype=roadmap&markers=color:blue%7Clabel:S%7C40.702147,-74.015794&markers=color:green%7Clabel:G%7C40.711614,-74.012318&markers=color:red%7Clabel:C%7C40.718217,-73.998284&key=AIzaSyBkDqO4ZFc9wLSfg-6qHo5xdAGusxTsRyI
https://maps.googleapis.com/maps/api/staticmap?size=400x400&center=44.714728,-73.998672&zoom=18&maptype=satellite&key=AIzaSyBkDqO4ZFc9wLSfg-6qHo5xdAGusxTsRyI
