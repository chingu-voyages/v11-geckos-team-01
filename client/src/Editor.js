import PropTypes from 'prop-types';

require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/theme/neat.css');
require('codemirror/mode/xml/xml.js');
require('codemirror/mode/javascript/javascript.js');
require('codemirror/addon/lint/lint');
require('codemirror/addon/lint/json-lint');

// eslint-disable-next-line import/first
import './Editor.css';
// eslint-disable-next-line import/first
import { formatJSONfromString } from './Utils';

// eslint-disable-next-line import/first
import initialValue from './initial.js';
// JSON.parse(formatJSONfromString(initialValue))

// eslint-disable-next-line import/first
import React from 'react';

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.textAreaNode = null;
    this.codeMirrorInstance = null;
    this.codeMirror = null;
    this.options = {
      mode: props.mode ? props.mode : 'javascript',
      theme: 'material',
      viewportMargin: props.viewPortMargin ? props.viewPortMargin : 10,
      lineNumbers: true
    };
    this.state = {
      lastTemplateId: null,
      defaultValue: initialValue
    }
  }
  getCodeMirrorInstance() {
    return require('codemirror');
  }
  componentWillReceiveProps(props) {
    const { lastTemplateId } = this.state
    if (props.newTemplateId !== lastTemplateId) {
      this.setState({ lastTemplateId: props.newTemplateId })
      try {
        this.codeMirror
          .getDoc()
          .setValue(JSON.stringify(props.defaultValue, null, 2));
      } catch (error) {
        console.error(error)
        return false;
      }
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
    const str = formatJSONfromString(doc.getValue());
    console.log(str)
    const val = JSON.parse(str);
    this.props.onChange(val);

    this.codeMirror.on('change', (doc, change) => {
      try {
        // const str = formatJSONfromString(doc.getValue());
        const str = JSON.parse(doc.getValue())
        // const val = JSON.parse(str);
        this.props.onChange(str);
      } catch (error) {
        console.error(error);
      }
    });
  }
  render() {
    return (
      <textarea
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
  defaultValue: PropTypes.array,
  newTemplateId: PropTypes.string,
  preserveScrollPosition: PropTypes.bool
};

export default Editor;
