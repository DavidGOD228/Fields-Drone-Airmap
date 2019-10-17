import React, { Component } from 'react'
import { connect } from "react-redux";
import { compose } from "redux";

class CreatedMap extends Component {
  invertPhoto() {
    console.log("invert photos here");
  }

  render() {
    return (
      <div>
        <button
          onClick={() => this.invertPhoto()}
          className="start-flight-button click-scale-down bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        >
          Get Info
        </button>

        <div className="map-image">
          <img src={"data:image/png;base64," + this.props.mapPath} />
        </div>
      </div>
    )
  }
}

let mapStateToProps = state => {
  // console.log('STATE :', state);
  // console.log('state.mapPath :', state.photos.mapPath);
  return {
    mapPath: state.photos.mapPath,
    photos: state.photos
  };
};

export default connect(
  mapStateToProps
)(CreatedMap);