import React, { Component } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

export default class ScrollTopBottomButton extends Component {
  render() {
    return (
      <div className="scroll-top-bottom-button click-scale-down">
        <FontAwesomeIcon icon={faChevronDown} />
      </div>
    )
  }
}
