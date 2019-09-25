
import React from 'react'

import PropTypes from 'prop-types'

import Editor from './Editor'

import './Preview.css'

function Preview(props) {
  // console.log(props.defaultValue)
  return (
    <div className="wrapper">
      <Editor
        mode={'json'}
        defaultValue={props.defaultValue}
        readOnly={true}
      />
    </div>
  )
}

Preview.propTypes = {
  defaultValue: PropTypes.string
}
export default Preview
