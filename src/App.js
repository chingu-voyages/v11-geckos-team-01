import React, { useState } from 'react'
import './App.css'

import Editor from './Editor'
import Preview from './Preview'
import Header from './Header'
import Footer from './Footer'

function App() {
  const [content, setContent] = useState('')


  function repeat (min, max, item) {
    let i = Math.floor((Math.random() * ((max + 1) - min)) + min)
    const arr = []
    while(--i) {
      arr.push({ ...item })
    }
    return arr
  }

  const depthFirstSearch = (tree) => {
    // https://stackoverflow.com/questions/48612674/depth-first-traversal-with-javascript
    const schema = []

    const callback = ({ node, callback, name = '_root' }) => {
      schema.push({ node, callback, name })
      console.log(schema)
    }
    (function recurse (context, name) {
      let prop
      // debugger
      const regex = /repeat\((\w|\d|\s|,)+\)/g
      debugger
      const repeats = context[0] && Object.keys(context[0])[0].match(regex)
      if (context[0] && repeats) {
        debugger
        prop = repeats[0]
        callback({ node: context[0][prop], callback: repeats[0], name })
        return recurse(context[0][prop])
      } else {
        debugger
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

  const onChange = (nextState) => {
    // console.log(nextState)
    setContent(nextState)


    console.log(depthFirstSearch(nextState))
    // findNestedLists(nextState)
    // console.timeEnd('parse')
  }
  return (
    <div className="app">
      <Header />
      <div className="flex-container">
        <div className="flex-item">
          <Editor
            onChange={onChange}
          />
        </div>
        {/* <div className="flex-item">
          <Preview
            content={content}
          />
        </div> */}
      </div>
      <Footer />
    </div>
  )
}

export default App
