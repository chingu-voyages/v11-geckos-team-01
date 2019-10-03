import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import uuid from 'uuid/v4'
import Mustache from 'mustache'
import axios from 'axios'

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

import '@material/react-list/dist/list.css'
import '@material/react-drawer/dist/drawer.css'
import '@material/react-top-app-bar/dist/top-app-bar.css'
import '@material/react-material-icon/dist/material-icon.css'

import './App.css'

import Editor from './Editor'
import Preview from './Preview'
import Header from './Header'
import Footer from './Footer'
import Templates from './Templates'

const initialValue = `[{\n  'repeat(5, 15)': {\n    accountId: '{{guid}}',\n    notes: [ { 'repeat(5, 10)': { text: null } } ],\n    picture: 'http://placehold.it/32x32',\n    balance: '{{floating(1000, 4000, 2, "$0,0.00")}}'\n  }\n}]`

// import { formatJSONfromString } from './Utils'

class App extends React.Component {
  // const [value, setValue] = useState('')
  // const [result, setResult] = useState('')
  constructor (props) {
    super(props)
    this.state = {
      user: null,
      value: '',
      result: '',
      open: false,
      templates: [],
      selectedIndex: 0
    }
    this.findNodes = this.findNodes.bind(this)
    this.generateJSON = this.generateJSON.bind(this)
    this.repeatNode = this.repeatNode.bind(this)
    this.onChange = this.onChange.bind(this)
    this.toggleDrawer = this.toggleDrawer.bind(this)
  }
  // mainContentEl = React.createRef()
  // focusFirstFocusableItem = () => {
  //   this.mainContentEl.current.querySelector('input, button').focus()
  // }
  onDrawerClose = () => {
    this.setState({ open: false })
    this.focusFirstFocusableItem()
  }  
  toggleDrawer () {
    console.log(this.state.open)
    this.setState({ open: !this.state.open })
  }
  componentDidMount () {
    const url = 'https://next.json-generator.com/api/json/get/Ek4J2QRPw'
    axios.get(url).then(({ data }) => {
      console.log(data)
      this.setState({ templates: data })
    })
    axios.get('/profile', { headers: {
      'Access-Control-Allow-Origin': '*'
    }}).then(({ data }) => {
      console.log(data)
      if (data.user && data.user.id) {
        console.log('loggged in')
        console.log(data)
        localStorage.setItem('user', JSON.stringify(data))
        this.setState({ user: data })
      } else {
        console.log('logged out')
      }
    })
  }
  repeatNode (callback, node, mode) {
    const args = callback.match(/\d+/g)
    const parsed = args.map((str) => parseInt(str, 10))
    // console.log(parsed)

    const max = parsed[1]
    const min = parsed[0]
    
    let i = Math.floor((Math.random() * ((max + 1) - min)) + min)
    // console.log(`Repeat this object ${i} times.`)
    
    const result = []
    while(--i) {
      result.push({ ...node })
    }
    return mode === 'json' ? JSON.stringify(result) : result
  }
  findNodes () {
    // https://stackoverflow.com/questions/48612674/depth-first-traversal-with-javascript
    const schema = []

    const callback = ({ node, callback, name = '_root' }) => {
      if (schema.length) {
        schema[schema.length - 1].node[name] = `{{&${name}}}`
      }
      schema.push({ node, callback, name })
      // console.log(schema)
    }
    (function recurse (context, name) {
      console.log(context, name)
      let prop
      // debugger
      const regex = /repeat\((\w|\d|\s|,)+\)/g
      // debugger
      const repeats = context[0] && Object.keys(context[0])[0].match(regex)
      if (context[0] && repeats) {
        // debugger
        prop = repeats[0]
        callback({ node: context[0][prop], callback: repeats[0], name })
        return recurse(context[0][prop])
      } else {
        // debugger
        for (let prop in context) {
          if (Array.isArray(context[prop])) {
            // callback({ name: prop, node: context[prop] })
            return recurse(context[prop], prop)
          }
        }
      }
    })(this.state.value)
    console.log(this.state.value)
    return schema
  }
  generateJSON () {
    console.log('CLICK THAT BITCH')
    let result = ''
    let lastNode = {}
    const config = {
      // guid: () => (Math.random() * 999999).toFixed(2)
      guid: () => uuid()
    }
    const arr = this.findNodes()
    debugger
    console.log(arr)
    arr.map(({ node, callback, name }, i) => {
      lastNode = { node, callback, name }
      let currentNode = null
      // let nextNode = arr[i + 1]
      // console.log(lastNode)
      // debugger
      if (arr[i + 1]) {
        currentNode = arr[i + 1].name
      }
      const newNode = { ...node,
        [currentNode]: `{{&${currentNode}}}`,
      }
      const template = i === 0
        ? JSON.stringify(this.repeatNode(callback, newNode))
        : result
      if (currentNode) {
        config[currentNode] = () => `{{&${currentNode}}}`
      }
      if (lastNode.name) {
        config[lastNode.name] = () => {
          // console.log(repeatNode(lastNode.callback, lastNode.node, 'json'))
          return this.repeatNode(lastNode.callback, lastNode.node, 'json')
        }
      }
      // console.log(config)
      const string = Mustache.render(template, config)
      result = string
        .replace(/("\[)/g, "[")
        .replace(/(\]")/g, "]")
      console.log(JSON.parse(result))
      // console.log(currentNode)
      // console.log('----------------------END--------------------------------')
      // console.log(result)
    })
    console.log(result)
    // console.log(JSON.parse(result))
    this.setState({ result })
  }
  onChange (nextState) {
    console.log(nextState)
    this.setState({ value: nextState })
    console.log(this.state.value)
    // try {

    // } catch (error) {
    //   return false
    // }
  }
  render () {
    return (
      <Router>
        <div className='drawer-container'>
          <Drawer
            className="drawer"
            dismissible
            open={this.state.open}
            onClose={this.drawerOnClose}
          >
            <DrawerHeader>
              <DrawerTitle tag='h1'>
                <strong>JSON_GENERATOR {"{ }"}</strong>
              </DrawerTitle>
            </DrawerHeader>

            <DrawerContent>
              <Templates
                selctedIndex={this.state.selectedIndex}
                templates={this.state.templates}
              />
            </DrawerContent>
          </Drawer>

          {/* ref={this.mainContentEl} */}
          <DrawerAppContent className='drawer-app-content'>
            <TopAppBar
              title='Inbox'
            >
              <TopAppBarRow
                className="header"
                style={{ overflowX: "hidden" }}
              >
                <TopAppBarSection align='start' role='toolbar'>
                  <TopAppBarIcon
                    navIcon
                    onClick={this.toggleDrawer}
                  >
                    <i className='material-icons'>menu</i>
                  </TopAppBarIcon>
                  <Header
                    className="topbar-actions"
                    user={this.state.user}
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
                    <Preview
                      defaultValue={this.state.result}
                    />
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
