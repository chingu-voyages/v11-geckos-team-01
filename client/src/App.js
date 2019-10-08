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

// const initialValue = `[{\n  'repeat(5, 15)': {\n    accountId: '{{guid}}',\n    notes: [ { 'repeat(5, 10)': { text: null } } ],\n    picture: 'http://placehold.it/32x32',\n    balance: '{{floating(1000, 4000, 2, "$0,0.00")}}'\n  }\n}]`
import initialValue from './initial.js'

const repeats = (node = {}) => {
  const regex = /repeat\((\w|\d|\s|,)+\)/g
  return Object.keys(node)[0].match(regex)
}
class App extends React.Component {
  // const [value, setValue] = useState('')
  // const [result, setResult] = useState('')
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      value: '',
      result: '',
      initialValue
    }
    this.generateJSON = this.generateJSON.bind(this)
    this.repeatNode = this.repeatNode.bind(this)
    this.onChange = this.onChange.bind(this)
    this.findNodes = this.findNodes.bind(this)
  }
  componentDidMount() {
    // this.setState({
    //   initialValue: JSON.stringify(initial, null, 2).toString()
    // })
    axios.get('/profile', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(({ data }) => {
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
  repeatNode(callback, node, mode) {
    const args = callback.match(/\d+/g)
    const parsed = args.map((str) => parseInt(str, 10))
    // console.log(parsed)

    const max = parsed[1]
    const min = parsed[0]

    let i = Math.floor((Math.random() * ((max + 1) - min)) + min)
    // console.log(`Repeat this object ${i} times.`)

    const result = []
    while (--i) {
      result.push({ ...node })
    }
    return mode === 'json' ? JSON.stringify(result) : result
  }
  findNodes() {
    const queue = [...this.state.value]
    const schema = []
    const explored = []
    const callback = ({ node, callback, name = '_root' }) => {
      const nextState = cloneDeep(node)
      for (let prop in node) {
        if (Array.isArray(node[prop])) {
          // console.log(`this prop should be repeated: ${prop}`)
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
  generateJSON() {
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
  onChange(nextState) {
    console.log(nextState)
    this.setState({ value: nextState })
    console.log(this.state.value)
  }
  render() {
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
                  defaultValue={this.state.initialValue}
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
