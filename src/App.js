import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import './App.css'

import uuid from 'uuid/v4'
import Mustache from 'mustache'
import axios from 'axios'

import cloneDeep from 'lodash/cloneDeep'

import Editor from './Editor'
import Preview from './Preview'
import Header from './Header'
import Footer from './Footer'

const initialValue = `[{\n  'repeat(5, 15)': {\n    accountId: '{{guid}}',\n    notes: [ { 'repeat(5, 10)': { text: null } } ],\n    picture: 'http://placehold.it/32x32',\n    balance: '{{floating(1000, 4000, 2, "$0,0.00")}}'\n  }\n}]`

// import { formatJSONfromString } from './Utils'

const repeats = (node = {}) =>{
  const regex = /repeat\((\w|\d|\s|,)+\)/g
  return Object.keys(node)[0].match(regex)
}
class App extends React.Component {
  // const [value, setValue] = useState('')
  // const [result, setResult] = useState('')
  constructor (props) {
    super(props)
    this.state = {
      user: null,
      value: '',
      result: ''
    }
    this.generateJSON = this.generateJSON.bind(this)
    this.repeatNode = this.repeatNode.bind(this)
    this.onChange = this.onChange.bind(this)
    this.bfs_findNodes = this.bfs_findNodes.bind(this)
  }
  componentDidMount () {
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
  bfs_findNodes () {
    // console.log(this.state.value)
    const queue = [...this.state.value]
    const schema = []
    const explored = []
    const callback = ({ node, callback, name = '_root' }) => {
      const nextState = cloneDeep(node)
      for (let prop in node) {
        if (Array.isArray(node[prop])) {
          console.log(`this prop should be repeated: ${prop}`)
          nextState[prop] = `{{&${prop}}}`
        }
      }
      return schema.push({ node: nextState, callback, name })
    }
    // const logger = (node) => {
    //   schema.push(node)
    //   return console.log(node)
    // }
    function BFS (callback, root) {
      // var queue=[this];
      let node = [root]
      let name
      while(queue.length > 0) {
        node = queue.shift()
        name = explored.shift()
        let prop
        // debugger
        if (node && repeats(node)) {
          prop = repeats(node)
          callback({ node: node[prop], callback: repeats(node)[0], name })
          explored.push(prop)
          queue.push(node[prop])
          // console.log(queue)
        } else {
          // debugger
          for (let prop in node) {
            // debugger
            if (Array.isArray(node[prop])) {
              // queue.push(node[prop], prop, node)
              // console.log(prop)
              // console.log(node[prop][0])
              explored.push(prop)
              queue.push(node[prop][0])
            }
          }
          console.log(queue)
        }
      } 
    }
    BFS(callback, this.state.value)
    console.log(schema)
    return schema
  }
  generateJSON () {
    let result = ''
    let lastNode = {}
    const config = {
      // guid: () => (Math.random() * 999999).toFixed(2)
      guid: () => uuid()
    }
    const arr = this.bfs_findNodes()
    // console.log(arr)
    // debugger
    arr.map(({ node, callback, name }, i) => {
      lastNode = { node, callback, name }
      let currentNode = null
      // let nextNode = arr[i + 1]
      // console.log(lastNode)
      debugger
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
      // console.log(JSON.parse(result))
      // console.log(currentNode)
      // console.log('----------------------END--------------------------------')
      // console.log(result)
    })
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
        <div className="app">
          <Header
            user={this.state.user}
            callback={this.generateJSON}        
          />
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
          <Footer />
        </div>        
      </Router>
    )    
  }
}

export default App
