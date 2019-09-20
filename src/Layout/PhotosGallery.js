import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

//const electron = window.require('electron');ok
//const app = window.require('electron').remote;
//const dialog = app.dialog;
//const fs = window.require('fs');

export default class PhotoGallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: []
    };
  }

  onChangeHandler(event) {
    if (event.target.files[0] != null) {
      var tempFile = this.state.files;
      if (tempFile.length == 0)
        tempFile[0] = URL.createObjectURL(event.target.files[0]);
      else
        tempFile[tempFile.length + 1] = URL.createObjectURL(
          event.target.files[0]
        );

      this.setState({
        files: tempFile
      });
    }
  }

  render() {
    return (
      // <div className="flex items-center justify-center h-full">
      <div>
        <div className="photo-gallery-container">
          <div className="photo-gallery-item ">
            <input
              type="file"
              className="gallery-file-upload"
              name="file"
              accept="image/*"
              onChange={this.onChangeHandler.bind(this)}
            />
            <FontAwesomeIcon icon={faPlus} />
          </div>
          {this.state.files.map(f => (
            <div className="photo-gallery-item ">
              <img
                src={f}
                key={f}
                style={{ width: "100px", height: "150px" }}
              />
            </div>
          ))}
        </div>
        {/* <input
          type="file"
          className="fileUpload"
          name="file"
          accept="image/*"
          onChange={this.onChangeHandler.bind(this)}
        />
        {this.state.files.map(f => (
          <img src={f} key={f} style={{ width: "100px", height: "150px" }} />
        ))} */}
      </div>
    );
  }
}
