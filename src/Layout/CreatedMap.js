import React, { Component } from 'react'
import { connect } from "react-redux";
import { compose } from "redux";

class CreatedMap extends Component {
  render() {
    return (
      <div>
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