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
      expandedIdx: -1,
      blurPercentage: 0,
      images: []
    };
  }

  async onPhotoLoad(event) {
    const files = event.target.files;

    for (let i = 0; i < files.length; i++) {
      console.log("files[i] :", files[i]);
      this.props.pushPhoto(
        new Photo(
          { url: URL.createObjectURL(files[i]) },
          {
            sharpness: await Photo.getFileBlurFactor(files[i].path).then(
              res => res
            )
          }
        )
      );
    }

    console.log("this.props.photos :", this.props.photos);
    // this.setState(state => {
    //   return {
    //     images: [...state.images, this.props]
    //   };
    // });
  }

  expandPhoto(idx) {
    this.setState(state => {
      return {
        expandedIdx: state.expandedIdx === -1 ? idx : -1
      };
    });
  }

  handlePercentageChange(event) {
    this.setState({
      blurPercentage: event.target.value
    });
    console.log("percentage: ", this.state.blurPercentage);
    console.log("this.props.photos :", this.props.photos);
  }

  render() {
    return (
      <div className="relative">
        <div
          className="fileter-panel"
          style={{ background: "#009fff54", padding: "5px" }}
        >
          <div
            className="mb-4"
            style={{ width: "200px", margin: "0", marginLeft: "20px" }}
          >
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
              value={this.state.blurPercentage}
              onChange={this.handlePercentageChange.bind(this)}
            />
          </div>
        </div>
        <ScrollTopBottomButton />
        <div className="photo-gallery-container">
          {this.props.photos.length > 0 &&
            this.props.photos
              .filter(el => el.sharpness > this.state.blurPercentage / 100)
              .map((f, idx) => (
                <div
                  className={`photo-gallery-item ${this.state.expandedIdx ===
                    idx && "photo-gallery-item-expanded"}`}
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
