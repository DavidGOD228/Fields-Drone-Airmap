import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from "@fortawesome/free-solid-svg-icons";

export default class VariablesBlock extends Component {

  componentDidMount() {
    
  }  

  render() {
    const { vars } = this.props
    console.log(vars)
    return (
      <div className="block grid-block-container">
        {vars.map(v => (
          <div className="grid-block-item p-4" key={v.name}>
            {/* <FontAwesomeIcon icon={["fas", "fa-ad"]} /> */}
            {/* <FontAwesomeIcon icon={['fas', 'code']} /> */}
            <FontAwesomeIcon className="mr-2" icon={faHome} />
            <span className="text-teal-100">{v.name}</span>
            <p><span className="font-bold">{v.val}</span> {v.measuredIn}</p>
          </div>
        ))}
      </div>
    )
  }
}
