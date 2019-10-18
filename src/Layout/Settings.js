import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";

import { setSettingState } from "../store/actions/photosGallery";

class Settings extends Component {
  constructor(props) {
    super(props);
  }

  toggleChange(setting) {
    this.props.setSettingState(setting);
  }

  componentDidMount() {}

  render() {
    const { settings } = this.props;
    const languageSettingVal = settings.find(el => el.label === "Language")
      .value;

    return (
      <div className="container mx-auto  flex flex-col	 justify-center items-center">
        <h1 className="text-6xl text-center font-hairline">
          {languageSettingVal === "English" ? "Settings" : "Налаштування"}
        </h1>
        {/* <div className="container"> */}
        <ul className="container  my-10 px-64">
          {settings.map((setting, i) => {
            switch (setting.type) {
              case "checkbox":
                return (
                  <li className="my-4" key={setting.value}>
                    <div className="pretty p-switch p-fill">
                      <input
                        type="checkbox"
                        checked={setting.value}
                        onChange={() =>
                          this.toggleChange({
                            ...setting,
                            value: !setting.value
                          })
                        }
                      />
                      <div className="state">
                        <label>{setting.label}</label>
                      </div>
                    </div>
                  </li>
                );
              case "select":
                return <div>shit</div>;
              default:
                break;
            }
          })}
        </ul>
      </div>
    );
  }
}

let mapDispatchToProps = dispatch => {
  return {
    setSettingState: settingKeyVal => dispatch(setSettingState(settingKeyVal))
  };
};

let mapStateToProps = state => {
  console.log("STATE :", state);
  // console.log('state.mapPath :', state.photos.mapPath);
  return {
    settings: state.settings
  };
};

export default connect(mapStateToProps)(Settings);
