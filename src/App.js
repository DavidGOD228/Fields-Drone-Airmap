import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Link } from "react-router-dom";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faChevronRight,
  faChevronLeft
} from "@fortawesome/free-solid-svg-icons";

import Sidebar from "./Layout/Sidebar";
import PhotosGallery from "./Layout/PhotosGallery";
import MyMap from "./Layout/MyMap";
import CreatedMap from "./Layout/CreatedMap";
import Settings from "./Layout/Settings";
import CompareImages from "./Layout/CompareImages";
import VariablesBlock from "./VariablesBlock";

import "./index.css";

const fs = window.require("fs");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarOn: 1,
      menuOn: 1
    };
  }

  toggleSidebar(that) {
    that.setState(state => {
      return {
        sidebarOn: !state.sidebarOn
      };
    });
  }

  toggleMenu(that) {
    that.setState(state => {
      return {
        menuOn: !state.menuOn
      };
    });
  }

  render() {
    const { settings, droneParameters } = this.props;
    const languageSettingVal = settings.find(el => el.label === "Language")
      .value;
    return (
      <BrowserRouter>
        <div className="min-h-screen md:flex">
          <div
            className={`flex flex-col content-around flex-none bg-gray-800 text-white relative ${
              this.state.sidebarOn ? "w-full md:max-w-xs" : "w-0"
            }`}
          >
            <Sidebar>
              <div
                className={`toggle-button cursor-pointer`}
                onClick={() => this.toggleSidebar(this)}
              >
                <FontAwesomeIcon
                  className="mr-2"
                  icon={this.state.sidebarOn ? faChevronLeft : faChevronRight}
                />
              </div>

              <div
                className={`menu-container ${this.state.menuOn ? "" : "h-0"}`}
              >
                <Link
                  to="/map"
                  className="menu-item flex flex-col justify-start items-center content-center text-center w-full bg-blue-700 py-2 cursor-pointer"
                >
                  {languageSettingVal === "English"
                    ? "Map"
                    : "Карта місцевості"}
                </Link>
                <Link
                  to="/"
                  className="menu-item flex flex-col justify-start items-center content-center text-center w-full bg-blue-700 py-2 cursor-pointer"
                >
                  {languageSettingVal === "English"
                    ? "Photos"
                    : "Загрузити фото"}
                </Link>
                <Link
                  to="/created-map"
                  className="menu-item flex flex-col justify-start items-center content-center text-center w-full bg-blue-700 py-2 cursor-pointer"
                >
                  {languageSettingVal === "English"
                    ? "Created map"
                    : "Скомпонована карта"}
                </Link>
                <Link
                  to="/settings"
                  className="menu-item flex flex-col justify-start items-center content-center text-center w-full bg-blue-700 py-2 cursor-pointer"
                >
                  {languageSettingVal === "English"
                    ? "Settings"
                    : "Налаштування"}
                </Link>
                <Link
                  to="/compare-images"
                  className="menu-item flex flex-col justify-start items-center content-center text-center w-full bg-blue-700 py-2 cursor-pointer"
                >
                  {languageSettingVal === "English"
                    ? "Compare Images"
                    : "Порівняти картинки"}
                </Link>
              </div>

              <div
                className="flex flex-col justify-start items-center content-center text-center w-full bg-blue-700 py-2 cursor-pointer"
                onClick={() => this.toggleMenu(this)}
              >
                <FontAwesomeIcon className="mr-2" icon={faBars} />
              </div>

              <VariablesBlock vars={droneParameters} />

              <Link to="/created-map">
                <div>
                  <img
                    src={"data:image/png;base64," + this.props.mapPath}
                    alt="No img yet"
                  />
                </div>
              </Link>
            </Sidebar>
          </div>
          <div className="flex-1 bg-gray-400 text-white">
            <Switch>
              <Route exact path="/" component={PhotosGallery} />
              <Route exact path="/map" component={MyMap} />
              <Route exact path="/created-map" component={CreatedMap} />
              <Route exact path="/settings" component={Settings} />
              <Route exact path="/compare-images" component={CompareImages} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

let mapDispatchToProps = dispatch => {
  return {
    // pushPhoto: photo => dispatch(pushPhoto(photo)),
    // setMapPath: mapPath => dispatch(setMapPath(mapPath))
  };
};

let mapStateToProps = state => {
  // console.log("STATE :", state);

  return {
    mapPath: state.map.mapPath,
    photos: state.photos,
    settings: state.settings,
    droneParameters: state.droneParameters
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
