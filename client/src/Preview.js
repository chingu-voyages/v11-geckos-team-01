
import React from 'react'

import PropTypes from 'prop-types'
// import isEqual from 'lodash/isEqual'

require('codemirror/lib/codemirror.css')
require('codemirror/theme/material.css')
require('codemirror/theme/neat.css')
require('codemirror/mode/xml/xml.js')
require('codemirror/mode/javascript/javascript.js')
require('codemirror/addon/lint/lint')
require('codemirror/addon/lint/json-lint')

// eslint-disable-next-line import/first
import './Editor.css'
// eslint-disable-next-line import/first
import './Preview.css'

class Preview extends React.Component {
  // console.log(props.defaultValue)
  constructor(props) {
    super(props)
    this.textAreaNode = null
    this.codeMirrorInstance = null
    this.codeMirror = null
    this.options = {
      mode: props.mode ? props.mode : 'javascript',
      theme: 'material',
      readOnly: true,
      viewportMargin: props.viewPortMargin ? props.viewPortMargin : 10,
      lineNumbers: true
    }
    this.state = {
      lastState: null
    }
  }
  getCodeMirrorInstance() {
    return require('codemirror')
  }
  componentWillReceiveProps(props) {
    try {
      this.codeMirror
        .getDoc()
        .setValue(JSON.stringify(props.defaultValue, null, 2))
    } catch (error) {
      console.error(error)
      return false
    }
  }
  componentDidMount() {
    const codeMirrorInstance = this.getCodeMirrorInstance()
    this.codeMirror = codeMirrorInstance.fromTextArea(
      this.textAreaNode,
      this.options
    )
  }
  render() {
    return (
      <div className="wrapper">
        <textarea
          ref={(ref) => (this.textAreaNode = ref)}
          autoFocus={true}
          readOnly={true}
          defaultValue={this.props.defaultValue}
        ></textarea>
      </div>
    )
  }
}

Preview.propTypes = {
  autoFocus: PropTypes.bool,
  className: PropTypes.any,
  codeMirrorInstance: PropTypes.func,
  name: PropTypes.string,
  onChange: PropTypes.func,
  onCursorActivity: PropTypes.func,
  onFocusChange: PropTypes.func,
  onScroll: PropTypes.func,
  options: PropTypes.object,
  path: PropTypes.string,
  value: PropTypes.string,
  readOnly: PropTypes.bool,
  defaultValue: PropTypes.array,
  preserveScrollPosition: PropTypes.bool
}
export default Preview
