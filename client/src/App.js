import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import uuid from 'uuid/v4'
import Mustache from 'mustache'

import cloneDeep from 'lodash/cloneDeep'

import Drawer, {
  DrawerHeader,
  DrawerTitle,
  DrawerContent,
  DrawerAppContent
} from '@material/react-drawer'

import TopAppBar, {
  TopAppBarFixedAdjust,
  TopAppBarSection,
  TopAppBarIcon,
  TopAppBarRow
} from '@material/react-top-app-bar'

import Editor from './Editor'
import Preview from './Preview'
import Header from './Header'
import Templates from './Templates'
import auth from './config/auth'
import template from './config/template'

import '@material/react-list/dist/list.css'
import '@material/react-drawer/dist/drawer.css'
import '@material/react-top-app-bar/dist/top-app-bar.css'
import '@material/react-material-icon/dist/material-icon.css'

import './App.css'

import initialValue from './initial.js'

const repeats = (node = {}) => {
  const regex = /repeat\((\w|\d|\s|,)+\)/g
  return Object.keys(node)[0].match(regex)
}
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      value: '',
      result: '',
      initialValue,
      templates: [],
      selectedIndex: 0,
      open: false
    }
  }
  async componentDidMount() {
    template.get('/').then(({ data }) => {
      console.log(data);
      this.setState({ templates: data });
    });
    const response = await auth.get('/current_user', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })

    if (response.status === 200 && response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user))
      this.setState({ user: response.data.user })
    }
  }
  repeatNode(callback, node, mode) {
    const args = callback.match(/\d+/g)
    const parsed = args.map((str) => parseInt(str, 10))

    const max = parsed[1]
    const min = parsed[0]

    let i = Math.floor((Math.random() * ((max + 1) - min)) + min)

    const result = []
    while (--i) {
      result.push({ ...node })
    }
    return mode === 'json' ? JSON.stringify(result) : result
  }
  findNodes = () => {
    const queue = [...this.state.value]
    const schema = []
    const explored = []
    const callback = ({ node, callback, name = '_root' }) => {
      const nextState = cloneDeep(node)
      for (let prop in node) {
        if (Array.isArray(node[prop])) {
          nextState[prop] = `{{&${prop}}}`
        }
      }
      return schema.push({ node: nextState, callback, name })
    }
    function BFS(callback, rootNode) {
      let node = [rootNode]
      let name
      while (queue.length > 0) {
        node = queue.shift()
        name = explored.shift()
        let prop
        if (node && repeats(node)) {
          prop = repeats(node)
          callback({ node: node[prop], callback: repeats(node)[0], name })
          explored.push(prop)
          queue.push(node[prop])
        } else {
          for (let prop in node) {
            if (Array.isArray(node[prop])) {
              explored.push(prop)
              queue.push(node[prop][0])
            }
          }
        }
      }
    }
    BFS(callback, this.state.value)
    return schema
  }
  generateJSON = () => {
    let result = ''
    let lastNode = {}
    const nodes = this.findNodes()
    const callbacks = nodes.reduce((acc, { node, callback, name }) => ({
      ...acc, [name]: () => this.repeatNode(callback, node, 'json')
    }), {})
    const config = {
      guid: () => uuid(),
      ...callbacks
    }
    while (nodes.length) {
      lastNode = nodes.shift()
      const { callback, node, name } = lastNode
      let template = ''
      template = name === '_root'
        ? JSON.stringify(this.repeatNode(callback, node))
        : result
      const string = Mustache.render(template, config)
      result = string
        .replace(/("\[)/g, "[")
        .replace(/(\]")/g, "]")
    }
    this.setState({ result })
  }
  onChange = (nextState) => {
    this.setState({ value: nextState })
  }

  onDrawerClose = () => {
    this.setState({ open: false })
    this.focusFirstFocusableItem()
  }

  toggleDrawer = () => {
    this.setState((prevState) => { return { open: !prevState.open } })
  }

  render() {
    const { open, selectedIndex, templates, user, result } = this.state;

    return (
      <Router>
        <div className="drawer-container">
          <Drawer
            className="drawer"
            dismissible
            open={open}
            onClose={this.drawerOnClose}
          >
            <DrawerHeader>
              <DrawerTitle tag="h1">
                <strong>JSON_GENERATOR {'{ }'}</strong>
              </DrawerTitle>
            </DrawerHeader>

            <DrawerContent>
              <Templates
                selctedIndex={selectedIndex}
                templates={templates}
              />
            </DrawerContent>
          </Drawer>

          <DrawerAppContent className="drawer-app-content">
            <TopAppBar title="Inbox">
              <TopAppBarRow className="header" style={{ overflowX: 'hidden' }}>
                <TopAppBarSection align="start" role="toolbar">
                  <TopAppBarIcon navIcon onClick={this.toggleDrawer}>
                    <i className="material-icons">menu</i>
                  </TopAppBarIcon>
                  <Header
                    className="topbar-actions"
                    user={user}
                    callback={this.generateJSON}
                  />
                </TopAppBarSection>
              </TopAppBarRow>
            </TopAppBar>
            <TopAppBarFixedAdjust>
              <div className="editor-wrapper">
                <div className="flex-container">
                  <div className="flex-item">
                    <Editor
                      onChange={this.onChange}
                      viewPortMargin={Infinity}
                      defaultValue={initialValue}
                      readOnly={false}
                    />
                  </div>
                  <div className="flex-item">
                    <Preview defaultValue={result} />
                  </div>
                </div>
              </div>
            </TopAppBarFixedAdjust>
          </DrawerAppContent>
        </div>
      </Router>
    )
  }
}

export default App
