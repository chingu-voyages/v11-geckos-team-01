import React, { useState } from 'react'
import './App.css'

// import ResizableBox from 'react-resizable'
import './Resizable.css'

import Editor from './Editor'
import Preview from './Preview'
import Header from './Header'
import Footer from './Footer'

const ResizableBox = require('react-resizable').ResizableBox;

function App() {
  const [content, setContent] = useState('')

  const onChange = (nextState) => {
    console.log(nextState)
    setContent(nextState)
  }
  return (
    <div className="app">
      <Header />
      {/* <div className="flex-container">
        <div className="flex-item">
          <Editor
            onChange={onChange}
          />
        </div>
        <div className="flex-item">
          <Preview
            content={content}
          />
        </div>
      </div> */}
      <div className="flex-container">
      <ResizableBox className="box" width={500} axis="x">
        <div>
          <h2>First Pane</h2>
        </div>
      </ResizableBox>
        <div>
          <h2>Sencond Pane</h2>
        </div>
        </div>
     
      <Footer />
    </div>
  )
}

export default App
