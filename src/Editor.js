

require('codemirror/lib/codemirror.css')
require('codemirror/theme/material.css')
require('codemirror/theme/neat.css')
require('codemirror/mode/xml/xml.js')
require('codemirror/mode/javascript/javascript.js')

// eslint-disable-next-line import/first
import './Editor.css'

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
      viewportMargin: Infinity,
      lineNumbers: true
    }
    this.state = {
      defaultValue: `\nfunction Foo () {\n  return "Bar"\n}\n`
    }
  }
  getCodeMirrorInstance () {
		return require('codemirror')
	}
  componentDidMount () {
    const codeMirrorInstance = this.getCodeMirrorInstance()
    this.codeMirror = codeMirrorInstance.fromTextArea(this.textAreaNode, this.options)
    //
    // Saves the editor content whenever a change happens
    //
    this.codeMirror.on('change', (doc, change) => {
      this.props.onChange(doc.getValue())
    })
    // this.codeMirror.setSize('100%', '100%')
  }
  render() {
    return (
      <textarea
        ref={(ref) => this.textAreaNode = ref}
        autoFocus={true}
        defaultValue={this.state.defaultValue}
      ></textarea>
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
