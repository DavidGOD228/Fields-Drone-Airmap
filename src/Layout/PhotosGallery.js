import React, { Component } from 'react'
// const electron = window.require('electron')
// const app = window.require('electron').remote;
// const dialog = app.dialog;
// const fs = window.require('fs');

export default class PhotoGallery extends Component {
  uploadPhotos() {
    console.log("photos")
    // dialog.showSaveDialog((fileName) => {

    // })
  }

  render() {
    return (
      <div className="flex items-center justify-center h-full">
        {/* <div className="bg-blue-400 mx-auto my-1 h-10 flex items-center justify-center rounded cursor-pointer click-scale-down ">
          <a href="#" className="text-grey-darker font-bold border-grey-lighter hover:border-purple-light hover:bg-grey-lighter px-4 select-none">Upload photos</a>
        </div> */}

        <button onClick={this.uploadPhotos} className="bg-blue-400 mx-auto my-1 h-10 flex items-center justify-center rounded cursor-pointer click-scale-down font-bold px-4">Upload files</button>
      </div>
    )
  }
}
