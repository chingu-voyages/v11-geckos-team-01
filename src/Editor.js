

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
      // defaultValue: `\nfunction Foo () {\n  return "Bar"\n}\n`
      defaultValue: `[{\n  'repeat(50, 100)': {\n    accountId: '{{guid()}}',\n    notes: [ { 'repeat(50, 100)': { text: null } } ],\n    picture: 'http://placehold.it/32x32',\n    balance: '{{floating(1000, 4000, 2, "$0,0.00")}}'\n  }\n}]`
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
      // this.props.onChange(doc.getValue())
      const str = doc.getValue()
        .replace(/(\r\n|\r|\n|\s)+/g, '')
        .replace(/"/g, `\\"`)
        .replace(/([,]|[{])([\d]|[\w])+:/g, (str) => {
          const word = /\w+/g
          const prop = str.match(word) ? str.match(word)[0] : ''

          if (str.indexOf('{') !== -1) {
            return `{"${prop}":`
          } else {
            return `,"${prop}":`
          }
        })
        .replace(/'/g, '"')

      try {
        console.log(doc.getValue())
        this.props.onChange(JSON.parse(str))
      } catch (error) {
        console.error(error)
      }
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
