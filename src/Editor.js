

require('codemirror/lib/codemirror.css')
require('codemirror/theme/material.css')
require('codemirror/theme/neat.css')
require('codemirror/mode/xml/xml.js')
require('codemirror/mode/javascript/javascript.js')
require('codemirror/addon/lint/lint');
require('codemirror/addon/lint/json-lint');

// eslint-disable-next-line import/first
import './Editor.css'
// eslint-disable-next-line import/first
import { formatJSONfromString } from './Utils'

// eslint-disable-next-line import/first
import PropTypes from 'prop-types'

// eslint-disable-next-line import/first
import React from 'react'

class Editor extends React.Component {
  constructor(props) {
    super(props)
    console.log(props.mode)
    this.textAreaNode = null
    this.codeMirrorInstance = null
    this.codeMirror = null
    this.options = {
      mode: props.mode ? props.mode : 'javascript',
      theme: 'material',
      viewportMargin: props.viewPortMargin ? props.viewPortMargin : 10,
      lineNumbers: true
    }
    this.state = {
      // defaultValue: `\nfunction Foo () {\n  return "Bar"\n}\n`
      defaultValue: null
    }
  }
  getCodeMirrorInstance () {
		return require('codemirror')
  }
  componentWillReceiveProps (props) {
    if (props.readOnly) {
      console.log(props)
      try {
        this.codeMirror.getDoc().setValue(
          JSON.stringify(JSON.parse(props.defaultValue), null, 2)
        )
      } catch (error) {
        return false
      }
    }
  }
  componentDidMount () {
    const codeMirrorInstance = this.getCodeMirrorInstance()
    this.codeMirror = codeMirrorInstance.fromTextArea(this.textAreaNode, this.options)
    //
    // Saves the editor content whenever a change happens
    //
    console.log(this.props.defaultValue)
    console.log(this.props.readOnly)
    this.setState({ defaultValue: this.props.defaultValue })
    if (!this.props.readOnly) {
      this.codeMirror.on('change', (doc, change) => {
        try {
          const str = formatJSONfromString(doc.getValue())
          this.props.onChange(JSON.parse(str))
        } catch (error) {
          console.error(error)
        }
      })
    }
    // this.codeMirror.setSize('100%', '100%')
  }
  render() {
    return (
      <textarea
        ref={(ref) => this.textAreaNode = ref}
        autoFocus={true}
        readOnly={this.props.readOnly}
        defaultValue={this.props.defaultValue}
      ></textarea>
    )
  }
}

Editor.propTypes = {
  autoFocus: PropTypes.bool,
  className: PropTypes.any,
  codeMirrorInstance: PropTypes.func,
  // intialValue: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  onCursorActivity: PropTypes.func,
  onFocusChange: PropTypes.func,
  onScroll: PropTypes.func,
  options: PropTypes.object,
  path: PropTypes.string,
  value: PropTypes.string,
  readOnly: PropTypes.bool,
  defaultValue: PropTypes.string,
  preserveScrollPosition: PropTypes.bool,
}

export default Editor
