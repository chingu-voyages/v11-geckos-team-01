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
    console.log(tree)
    // https://stackoverflow.com/questions/48612674/depth-first-traversal-with-javascript
    const schema = []

    const callback = ({ node, callback, name = '_root' }) => {
      schema.push({ node, callback })
    }
    (function recurse (context) {
      let node = context
      let prop
      debugger
      const regex = /repeat\((\w|\d|\s|,)+\)/g
      
      if (context[0]) {
        const repeat = Object.keys(node[0])[0]
        if (repeat.match(regex)) {
          console.log(node)
          prop = repeat.match(regex)[0]
          node = context[0][prop]
          callback({ node, callback: repeat })
          return recurse(context[0][prop])
        }
      } else {
        for (let prop in context) {
          if (Array.isArray(context[prop])) {
            callback({ name: prop, node: context })
            return recurse(context[prop])
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
