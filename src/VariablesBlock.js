import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { compose } from "redux";
import { updateDroneParameter } from "./store/actions/droneParameters";
class VariablesBlock extends Component {
  componentDidMount() {}

  onPropChange(prop, e) {
    // console.log("prop, e, this :", prop, e, this);
    // console.log("e.target :", e.target);
    // console.log("e.target :", e.target.value);

    let val = e.target.value;
    console.log("val :", val);

    console.log("prop, e, this :", prop, e, this);
    switch (prop.type) {
      case "slider":
        this.props.updateDroneParameter(prop.name, val);
        console.log("CHANGED");
        break;

      default:
        break;
    }
  }

  render() {
    const { vars } = this.props;

    return (
      <div className="block grid-block-container">
        {vars.map(v => {
          switch (v.type) {
            case "text":
              return (
                <div className="grid-block-item p-4" key={v.name}>
                  <FontAwesomeIcon className="mr-2" icon={faHome} />
                  <span className="text-teal-100">{v.name}</span>
                  <p>
                    <span className="font-bold">{v.val}</span> {v.measuredIn}
                  </p>
                </div>
              );
            case "slider":
              return (
                <div
                  key={v.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gridColumnStart: "1",
                    gridColumnEnd: "3",
                    padding: "0 15px",
                    flexDirection: "column"
                  }}
                >
                  <div className="w-full">
                    <FontAwesomeIcon className="mr-2" icon={faHome} />
                    <span className="text-teal-100">{v.name}</span>
                  </div>
                  <div className="w-full">
                    <input
                      type="range"
                      min={v.min}
                      max={v.max}
                      value={v.val}
                      onChange={e => this.onPropChange(v, e)}
                      className="range"
                      style={{
                        width: "70%"
                      }}
                    />
                    <span
                      style={{
                        paddingLeft: "10px"
                      }}
                    >
                      <span className="font-bold">{v.val}</span> {v.measuredIn}
                    </span>
                  </div>
                </div>
              );
            default:
              return <div>NO SUCH TYPE!</div>;
          }
        })}
      </div>
    );
  }
}

let mapDispatchToProps = dispatch => {
  return {
    updateDroneParameter: (name, val) =>
      dispatch(updateDroneParameter(name, val))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(VariablesBlock);
