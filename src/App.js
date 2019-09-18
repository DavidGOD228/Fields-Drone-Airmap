import React, { Component } from 'react';
import Sidebar from './Layout/Sidebar'
import PhotosGallery from './Layout/PhotosGallery'
import "./index.css"

class App extends Component {
  render() {
    return (
      <div className="min-h-screen md:flex">
        <div className="flex content-around flex-none w-full md:max-w-xs bg-gray-800 text-white">
          <Sidebar />
        </div>
        <div className="flex-1 bg-gray-400 text-white">
          <PhotosGallery />
        </div>
      </div>
    );
  }
}

export default App;
