import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faChevronDown,
  faExpandArrowsAlt
} from "@fortawesome/free-solid-svg-icons";
import Photo from "../calculations/Photo";

const fs = window.require("fs");

class CompareImages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      img1: null,
      img2: null,
      resultImg: null
    };
  }

  compareImages() {
    let path;
    const { img1, img2 } = this.state;
    fs.readFile("flight_number.txt", (err, buf) => {
      let flightNumber = buf.toString();
      path = `./Photos/compared${flightNumber}.jpg`;

      console.log("fullPath :", path);
      Photo.comparePixelMatch(img1.path, img2.path, path, {});

      var body = fs.readFileSync(path);
      let b64 = body.toString("base64");
      console.log("b64 :", b64);
      this.setState({
        resultImg: b64
      });
    });
  }

  async onPhotoLoad(idx, event) {
    const files = event.target.files;
    console.log("files[0] :", files[0]);
    if (idx === 0) {
      this.setState({
        img1: new Photo(
          { url: URL.createObjectURL(files[0]) },
          { path: files[0].path }
        )
      });
    } else if (idx === 1) {
      this.setState({
        img2: new Photo(
          { url: URL.createObjectURL(files[0]) },
          { path: files[0].path }
        )
      });
    }
  }

  render() {
    const { img1, img2, resultImg } = this.state;
    return (
      <div className="relative">
        <div
          className="photo-gallery-container"
          style={{
            height: "100vh",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {img1 !== null ? (
            <div
              className={`photo-gallery-item`}
              key={Math.random() * Math.random()}
              style={{
                width: "220px",
                height: "300px"
              }}
            >
              <img src={img1.url} />
            </div>
          ) : (
            <div
              className={`photo-gallery-item`}
              style={{
                width: "220px",
                height: "300px"
              }}
            >
              <input
                type="file"
                className="gallery-file-upload"
                name="file"
                accept="image/*"
                // onChange={this.onPhotoLoad.bind(this)}
                onChange={e => this.onPhotoLoad(0, e)}
              />
              <FontAwesomeIcon icon={faPlus} />
            </div>
          )}

          {img2 !== null ? (
            <div
              className={`photo-gallery-item`}
              key={Math.random() * Math.random()}
              style={{
                width: "220px",
                height: "300px"
              }}
            >
              <img src={img2.url} />
            </div>
          ) : (
            <div
              className={`photo-gallery-item`}
              style={{
                width: "220px",
                height: "300px"
              }}
            >
              <input
                type="file"
                className="gallery-file-upload"
                name="file"
                accept="image/*"
                // onChange={this.onPhotoLoad.bind(this)}
                onChange={e => this.onPhotoLoad(1, e)}
              />
              <FontAwesomeIcon icon={faPlus} />
            </div>
          )}

          <div
            className={`photo-gallery-item`}
            key={Math.random() * Math.random()}
            style={{
              width: "220px",
              height: "300px"
            }}
          >
            <img src={"data:image/png;base64," + resultImg} />
          </div>
        </div>
        <button
          onClick={() => this.compareImages()}
          className="start-flight-button click-scale-down bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        >
          Порівняти
        </button>
      </div>
    );
  }
}

export default CompareImages;
