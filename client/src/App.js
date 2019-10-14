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

import { Snackbar } from '@material/react-snackbar'

import Editor from './Editor'
import Preview from './Preview'
import Header from './Header'
import Templates from './Templates'
import auth from './config/auth'
import template from './config/template'

import '@material/react-list/dist/list.css'
import '@material/react-drawer/dist/drawer.css'
import '@material/react-snackbar/dist/snackbar.css'
import '@material/react-top-app-bar/dist/top-app-bar.css'
import '@material/react-material-icon/dist/material-icon.css'

import './App.css'

import initialValue from './initial.js'
import { formatJSONfromString } from './Utils'

const repeats = (node = {}) => {
  const regex = /repeat\((\w|\d|\s|,)+\)/g
  return Object.keys(node)[0].match(regex)
}
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      value: [],
      result: [],
      templates: [],
      selectedIndex: 0,
      templateId: '',
      open: false
    }
  }

  async componentDidMount() {
    if (localStorage.getItem('drawer')) {
      this.setState({ open: localStorage.getItem('drawer') === 'true' })
    }
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
    this.setState({ result: JSON.parse(result) })
  }

  generateAndSave = () => {
    this.generateJSON()
    
    const url = `/${this.state.templateId}`
    const data = { template: JSON.stringify(this.state.value) }
    const { templates, templateId } = this.state

    template.put(url, data).then(({ data }) => {
      const nextState = templates.map((item) => item._id !== templateId ? item : data)
      this.setState({
        success: true,
        templates: nextState
      })
    }).catch((error) => {
      console.error(error)
    })
  }

  onChange = (nextState) => {
    this.setState({ value: nextState })
  }

  createOne = () => {
    const { templates } = this.state
    const payload = { template: formatJSONfromString(initialValue) }
    template.post('/', payload).then(({ data }) => {
      console.log(data)
      this.setState({ templates: [...templates, data]})
    }).catch((error) => {
      console.error(error)
    })
  }

  deleteOne = () => {
    console.log('[DELETE ONE]')
    const { templates, templateId } = this.state
    const url = `/${templateId}`
    template.delete(url).then((data) => {
      const nextState = templates.filter(({ _id }) => _id !== templateId)
      console.log(data)
      this.setState({
        templateId: '',
        value: JSON.parse(JSON.stringify(initialValue)),
        templates: nextState
      })
    }).catch((error) => {
      console.error(error)
    })
  }

  onSelect = (nextState) => {
    this.setState({
      templateId: nextState._id,
      result: [],
      value: JSON.parse(nextState.template)
    })
  }

  onDrawerClose = () => {
    this.setState({ open: false })
    this.focusFirstFocusableItem()
  }

  toggleDrawer = () => {
    localStorage.setItem('drawer', !this.state.open)
    this.setState((prevState) => { return { open: !prevState.open } })
  }

  getSnackbarInfo = (snackbar) => {
    if (!snackbar) return
    console.log(snackbar.getTimeoutMs())
    console.log(snackbar.isOpen())
    console.log(snackbar.getCloseOnEscape())
  }
  render() {
    const { open, selectedIndex, templates, user, result, value, templateId } = this.state;

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
                <strong><span style={{ color: '#6200ee' }}>JSON</span> GENERATOR</strong>
              </DrawerTitle>
            </DrawerHeader>

            <DrawerContent>
              <Templates
                selctedIndex={selectedIndex}
                callback={this.onSelect}
                createOne={this.createOne}
                templates={templates}
              />
            </DrawerContent>
          </Drawer>

          <DrawerAppContent className="drawer-app-content">
            <TopAppBar title="Inbox">
              <TopAppBarRow
                className={`header ${this.state.open ? 'right-pad' : ''}`}
              >
                <TopAppBarSection align="start" role="toolbar">
                  <TopAppBarIcon navIcon onClick={this.toggleDrawer}>
                    <i className="material-icons">menu</i>
                  </TopAppBarIcon>
                  <Header
                    className="topbar-actions"
                    user={user}
                    templateId={templateId}
                    deleteOne={this.deleteOne}
                    callback={this.generateAndSave}
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
                      newTemplateId={templateId}
                      defaultValue={value}
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
        {/* <Snackbar
          message="Problem Updating Template"
          actionText="dismiss"
          ref={this.getSnackbarInfo}
        /> */}
      </Router>
    )
  }
}

export default App
