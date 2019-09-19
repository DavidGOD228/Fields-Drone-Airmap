import React, { Component } from 'react';
import Sidebar from './Layout/Sidebar'
import PhotosGallery from './Layout/PhotosGallery'
import VariablesBlock from "./VariablesBlock"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "./index.css"

class App extends Component {
  render() {
    return (
      <div className="min-h-screen md:flex">
        <div className="flex flex-col content-around flex-none w-full md:max-w-xs bg-gray-800 text-white">
          <Sidebar>
            <div className="flex flex-col justify-start items-center content-center text-center w-full bg-blue-700 py-2 cursor-pointer">
              <FontAwesomeIcon className="mr-2" icon={faBars} />
            </div>
            {/* <ul className="flex flex-col justify-start content-center text-center w-full">
              <li className="w-4/5 bg-blue-400 mx-auto my-1 h-10 flex items-center justify-center rounded cursor-pointer click-scale-down">
                <a href="#" className="text-grey-darker font-bold border-grey-lighter hover:border-purple-light hover:bg-grey-lighter">Upload photos</a>
              </li>
            </ul> */}
            <VariablesBlock vars={[
              { name: "Duration", val: "8.60", icon: "coffee", measuredIn: "minutes"},
              { name: "Resolution", val: 1.7, icon: "coffee", measuredIn: "in/px"},
              { name: "Area", val: 49, icon: "coffee", measuredIn: "acres"},
              { name: "Battery", val: 3900, icon: "coffee", measuredIn: "mph"}
            ]} />
          </Sidebar>
        </div>
        <div className="flex-1 bg-gray-400 text-white">
          <PhotosGallery />
        </div>
      </div>
    );
  }
}

export default App;
