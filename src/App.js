import React, { useState } from 'react'
import './App.css'

import uuid from 'uuid/v4'
import Mustache from 'mustache'

import Editor from './Editor'
import Preview from './Preview'
import Header from './Header'
import Footer from './Footer'

const initialValue = `[{\n  'repeat(5, 15)': {\n    accountId: '{{guid}}',\n    notes: [ { 'repeat(5, 10)': { text: null } } ],\n    picture: 'http://placehold.it/32x32',\n    balance: '{{floating(1000, 4000, 2, "$0,0.00")}}'\n  }\n}]`

// import { formatJSONfromString } from './Utils'

function App() {
  const [value, setValue] = useState('')
  const [result, setResult] = useState('')

  const repeat = (callback, node, mode) => {
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
  const depthFirstSearch = (tree) => {
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
    })(tree)
    return schema
  }
  const generateJSON = () => {
    console.log('CLICK THAT BITCH')
    let result = ''
    let lastNode = {}
    const config = {
      // guid: () => (Math.random() * 999999).toFixed(2)
      guid: () => uuid()
    }
    const arr = depthFirstSearch(value)
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
        ? JSON.stringify(repeat(callback, newNode))
        : result
      if (currentNode) {
        config[currentNode] = () => `{{&${currentNode}}}`
      }
      if (lastNode.name) {
        config[lastNode.name] = () => {
          // console.log(repeat(lastNode.callback, lastNode.node, 'json'))
          return repeat(lastNode.callback, lastNode.node, 'json')
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
    setResult(result)
  }
  const onChange = (nextState) => {
    try {
      setValue(nextState)
    } catch (error) {
      return false
    }
  }
  return (
    <div className="app">
      <Header
        callback={generateJSON}        
      />
      <div className="editor-wrapper">
        <div className="flex-container">
          <div className="flex-item">
            <Editor
              onChange={onChange}
              viewPortMargin={Infinity}
              defaultValue={initialValue}
              readOnly={false}
            />
          </div>
          <div className="flex-item">
            <Preview
              defaultValue={result}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default App
