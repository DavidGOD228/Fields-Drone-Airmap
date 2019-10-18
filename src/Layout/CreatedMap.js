import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";

class CreatedMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inversed: false
    };
  }

  toggleInvert(that) {
    that.setState(state => {
      return {
        inversed: !state.inversed
      };
    });
  }

  render() {
    return (
      <div style={{ position: "relative" }}>
        <button
          style={{ position: "absolute", top: "20px", left: "20px" }}
          onClick={() => this.toggleInvert()}
          className="click-scale-down bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        >
          Get Info
        </button>

        <div className="map-image">
          <img src={"data:image/png;base64," + this.props.mapPath} />
        </div>
      </div>
    );
  }
}

let mapStateToProps = state => {
  // console.log('STATE :', state);
  // console.log('state.mapPath :', state.photos.mapPath);
  return {
    mapPath: state.photosData.mapPath,
    photos: state.photosData
  };
};

export default connect(mapStateToProps)(CreatedMap);
