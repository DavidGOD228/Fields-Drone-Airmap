import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";

import Photo from "../calculations/Photo";

class CreatedMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inversed: false
    };
  }

  toggleInvert(that) {
    this.setState(state => {
      return {
        inversed: !state.inversed
      };
    });
    console.log("this.props.jimpMap :", this.props.jimpMap);
  }

  render() {
    const { mapPath, invertedPath } = this.props;
    const { inversed } = this.state;

    console.log("mapPath, invertedPath :", mapPath, invertedPath);
    return (
      <div style={{ position: "relative" }}>
        <button
          style={{ position: "absolute", top: "20px", left: "20px" }}
          onClick={() => this.toggleInvert()}
          className="click-scale-down bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        >
          Інформація поливу
        </button>

        <div className="map-image">
          <img
            src={
              "data:image/png;base64," + (!inversed ? mapPath : invertedPath)
            }
          />
        </div>
      </div>
    );
  }
}

let mapStateToProps = state => {
  return {
    mapPath: state.map.mapPath,
    jimpMap: state.map.jimpMap,
    invertedPath: state.map.invertedPath,
    photos: state.photos
  };
};

export default connect(mapStateToProps)(CreatedMap);
