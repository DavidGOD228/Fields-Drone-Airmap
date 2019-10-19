import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faChevronDown,
  faExpandArrowsAlt
} from "@fortawesome/free-solid-svg-icons";
import ScrollTopBottomButton from "../components/ScrollTopBottomButton";
import { pushPhoto } from "../store/actions/photosGallery";
import sightengine from "sightengine";
import Photo from "../calculations/Photo";

let se = sightengine("540865617", "38b6kZYxVz6DyZLGv82G");

class PhotosGallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedIdx: -1
    };
  }

  onPhotoLoad(event) {
    const files = event.target.files;

    for (let i = 0; i < files.length; i++) {
      this.props.pushPhoto(new Photo({ url: URL.createObjectURL(files[i]) }));
    }
  }

  expandPhoto(idx) {
    this.setState(state => {
      return {
        expandedIdx: state.expandedIdx === -1 ? idx : -1
      };
    });
  }

  render() {
    return (
      <div className="relative">
        <div className="fileter-panel">
          
        </div>
        <ScrollTopBottomButton />
        <div className="photo-gallery-container">
          {this.props.photos.length > 0 &&
            this.props.photos.map((f, idx) => (
              <div
                className={`appear-anim photo-gallery-item ${this.state
                  .expandedIdx === idx && "photo-gallery-item-expanded"}`}
                key={f.url + Math.random() * Math.random()}
              >
                <div
                  className="photo-expand-button icon-wrapper click-scale-down text-white"
                  onClick={() => this.expandPhoto(idx)}
                >
                  <FontAwesomeIcon
                    icon={faExpandArrowsAlt}
                    onClick={this.toggleTopBottom}
                  />
                </div>
                <img src={f.url} />
              </div>
            ))}
          <div className="photo-gallery-item ">
            <input
              type="file"
              className="gallery-file-upload"
              name="file"
              accept="image/*"
              onChange={this.onPhotoLoad.bind(this)}
              multiple
            />
            <FontAwesomeIcon icon={faPlus} />
          </div>
        </div>
      </div>
    );
  }
}

let mapDispatchToProps = dispatch => {
  return {
    pushPhoto: photo => dispatch(pushPhoto(photo))
  };
};

let mapStateToProps = state => {
  return {
    photos: state.photos
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PhotosGallery);
