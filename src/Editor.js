
require('codemirror/lib/codemirror.css')
require('codemirror/theme/material.css')
require('codemirror/theme/neat.css')
require('codemirror/mode/xml/xml.js')
require('codemirror/mode/javascript/javascript.js')

// eslint-disable-next-line import/first
import PropTypes from 'prop-types'

// eslint-disable-next-line import/first
import React from 'react'

class Editor extends React.Component {
  constructor(props) {
    super(props)
    this.textAreaNode = null
    this.codeMirrorInstance = null
    this.codeMirror = null
    this.options = {
      mode: 'javascript',
      theme: 'material',
      lineNumbers: true
    }
  }
  getCodeMirrorInstance () {
		return require('codemirror')
	}
  componentDidMount () {
    console.log(this.textAreaNode)
    const codeMirrorInstance = this.getCodeMirrorInstance()
    this.codeMirror = codeMirrorInstance.fromTextArea(this.textAreaNode, this.options)
  }
  render() {
    return (
      <div>
        <textarea
          ref={(ref) => this.textAreaNode = ref}
          autoFocus={true}
          defaultValue="function Foo () { return 'Bar' }"
        ></textarea>
      </div>
    )
  }
}

Editor.propTypes = {
  autoFocus: PropTypes.bool,
  className: PropTypes.any,
  codeMirrorInstance: PropTypes.func,
  defaultValue: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  onCursorActivity: PropTypes.func,
  onFocusChange: PropTypes.func,
  onScroll: PropTypes.func,
  options: PropTypes.object,
  path: PropTypes.string,
  value: PropTypes.string,
  preserveScrollPosition: PropTypes.bool,
}

export default Editor
