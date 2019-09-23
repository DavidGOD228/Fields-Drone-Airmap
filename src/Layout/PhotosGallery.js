import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faChevronDown, faExpandArrowsAlt } from "@fortawesome/free-solid-svg-icons";
import ScrollTopBottomButton from "../components/ScrollTopBottomButton"
{/* <i class="fas fa-expand-arrows-alt"></i> */}

//const electron = window.require('electron');ok
//const app = window.require('electron').remote;
//const dialog = app.dialog;
//const fs = window.require('fs');

export default class PhotoGallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      expandedIdx: -1
    };
  }

  onChangeHandler(event) {
    const files = event.target.files;
    let tempFiles = this.state.files;

    for(let i = 0; i < files.length; i++) {
      console.log(files[i])
      tempFiles.push(URL.createObjectURL(files[i]));
    }

    this.setState({
      files: tempFiles
    });
  }

  expandPhoto(idx) {
    console.log('idx :', idx);
    this.setState(state => {
      return {
        expandedIdx: state.expandedIdx === -1 ? idx : -1
      }
    })
  }

  render() {
    return (
      <div className="relative">
        <ScrollTopBottomButton />
        <div className="photo-gallery-container">
          {this.state.files.map((f, idx) => (
            <div className={`photo-gallery-item ${ this.state.expandedIdx === idx && "photo-gallery-item-expanded"}`}>
              <div className="photo-expand-button icon-wrapper click-scale-down text-white" onClick={
                () => this.expandPhoto(idx)
              }>
                <FontAwesomeIcon icon={faExpandArrowsAlt} onClick={this.toggleTopBottom}/>
              </div>
              <img
                src={f}
                //FIXME: fix this
                key={Math.random()}
              />
            </div>
          ))}
          <div className="photo-gallery-item ">
            <input
              type="file"
              className="gallery-file-upload"
              name="file"
              accept="image/*"
              onChange={this.onChangeHandler.bind(this)}
              multiple
            />
            <FontAwesomeIcon icon={faPlus} />
          </div>
        </div>
      </div>
    );
  }
}
