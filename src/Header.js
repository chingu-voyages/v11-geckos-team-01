
import React from 'react'

import PropTypes from 'prop-types'

import './Header.css'

function Header (props) {
  console.log(props)
  return (
    <div className="header">
      {/* CONTENT HERE */}
      <button
        className="btn"
        onClick={props.callback}
      >
        generate
      </button>
    </div>
  )
}

Header.propTypes = {
  callback: PropTypes.func
}
export default Header
