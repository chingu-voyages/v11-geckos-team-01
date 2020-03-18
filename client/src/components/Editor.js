import PropTypes from 'prop-types';
// import { JSHINT } from 'jshint';

// eslint-disable-next-line import/first
import 'codemirror/addon/lint/lint.css';
// eslint-disable-next-line import/first
import 'codemirror/addon/lint/lint';

import initial from '../initial.json'

import './Editor.css';

import React from 'react';

require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/theme/neat.css');
require('codemirror/mode/xml/xml.js');
require('codemirror/mode/javascript/javascript.js');
require('codemirror/addon/lint/lint');
require('codemirror/addon/lint/json-lint');
// require('codemirror/addon/lint/javascript-lint');

// window.JSHINT = JSHINT;

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.codeMirrorInstance = null;
    this.codeMirror = null;
    this.options = {
      mode: 'javascript',
      theme: 'material',
      gutters: ['CodeMirror-lint-markers'],
      lint: true,
      viewportMargin: props.viewPortMargin ? props.viewPortMargin : 10,
      lineNumbers: true
    };
    this.state = {
      lastTemplateId: null,
      defaultValue: JSON.stringify(initial, null, 2)
    }
  }
  getCodeMirrorInstance() {
    return require('codemirror');
  }
  componentDidUpdate(props) {
    const { lastTemplateId } = this.state

    if (props.newTemplateId !== lastTemplateId) {
      this.setState({ lastTemplateId: props.newTemplateId })
      // try {
      //   this.codeMirror
      //     .getDoc()
      //     .setValue(JSON.stringify(props.defaultValue, null, 2));
      // } catch (error) {
      //   console.error(error)
      //   return false;
      // }
    }
  }
  componentDidMount() {
    this.setState({
      defaultValue: this.props.defaultValue
    })

    const codeMirrorInstance = this.getCodeMirrorInstance();

    this.codeMirror = codeMirrorInstance.fromTextArea(
      this.textAreaNode,
      this.options
    );
    //
    // Saves the editor content whenever a change happens
    //
    const doc = this.codeMirror.getDoc();
    // const str = formatJSONfromString(doc.getValue());
    const str = doc.getValue();

    const val = JSON.parse(str);
    this.props.onChange(val);

    this.codeMirror.on('change', (doc, change) => {
      try {
        // const str = formatJSONfromString(doc.getValue());
        const str = JSON.parse(doc.getValue())
        // const val = JSON.parse(str);
        this.props.onChange(str);
      } catch (error) {
        return false;
      }
    });
  }
  render() {
    return (
      <textarea
        id="editor-instance"
        ref={(ref) => (this.textAreaNode = ref)}
        autoFocus={true}
        defaultValue={this.state.defaultValue}
      ></textarea>
    );
  }
}

Editor.propTypes = {
  codeMirrorInstance: PropTypes.func,
  onChange: PropTypes.func,
  options: PropTypes.object,
  readOnly: PropTypes.bool,
  newTemplateId: PropTypes.string,
  defaultValue: PropTypes.object,
  preserveScrollPosition: PropTypes.bool
};

export default Editor;
