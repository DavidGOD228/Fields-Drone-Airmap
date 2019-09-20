import React, { Component } from 'react';
import Sidebar from './Layout/Sidebar'
import PhotosGallery from './Layout/PhotosGallery'
import VariablesBlock from "./VariablesBlock"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faChevronRight, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import "./index.css"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOn: 1
    } 

  }

  toggleMenu(that) {
    that.setState(state => {
      console.log(state);
      return {
        menuOn: !state.menuOn
      }
    })
    console.log("changed state")
  }
  
  render() {
    return (
      <div className="min-h-screen md:flex">
        <div className={`flex flex-col content-around flex-none bg-gray-800 text-white ${ this.state.menuOn ? "w-full md:max-w-xs" : "w-0"}`}>
          <Sidebar>
            <div className="toggle-button cursor-pointer" onClick={() => this.toggleMenu(this)}>
              <FontAwesomeIcon className="mr-2" icon={this.state.menuOn ? faChevronLeft : faChevronRight} />
            </div>
            <div className="flex flex-col justify-start items-center content-center text-center w-full bg-blue-700 py-2 cursor-pointer">
              <FontAwesomeIcon className="mr-2" icon={faBars} />
              {/* <i class="fas fa-chevron-right"></i> */}
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
