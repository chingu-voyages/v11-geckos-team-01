
import React from 'react';
import ReactDOM from 'react-dom';

import { shallow, mount } from 'enzyme';

import Editor from '../../components/Editor.js'

import codeMirrorSetup from '../helpers/codeMirrorSetup.js';

import initial from '../../initial.json'

console.log(typeof initial);

const mountFunction = (options = {}) => {

  let { onChange, defaultValue } = options

  if (!onChange) {
    onChange = () => {}
  }

  return mount(
    <Editor
      onChange={onChange}
      viewPortMargin={Infinity}
      newTemplateId={''}
      readOnly={false}
    />
  );
}

beforeEach(codeMirrorSetup)

it('renders without crashing', () => {
  mountFunction()
});

it('should invoke onChange callback on initial mount', () => {
  const onChange = jest.fn();

  const wrapper = mountFunction({ onChange })

  expect(onChange).toHaveBeenCalled();
})

it('should display an intial value that matches a snapshot', () => {
  const wrapper = mountFunction();

  const el = wrapper.find('#editor-instance');

  expect(el.text()).toMatchSnapshot();
})
