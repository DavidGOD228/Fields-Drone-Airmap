import React, { Component } from 'react'

export default class Sidebar extends Component {
  render() {
    return (
        <ul className="flex flex-col justify-start content-center text-center w-full">
          <li className="w-4/5 bg-blue-400 mx-auto my-1 h-10 flex items-center justify-center rounded cursor-pointer click-scale-down">
            <a href="#" className="text-grey-darker font-bold border-grey-lighter hover:border-purple-light hover:bg-grey-lighter">Upload photos</a>
          </li>
        </ul>
    )
  }
}
