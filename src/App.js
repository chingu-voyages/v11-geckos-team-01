import React, { useState } from 'react'
import './App.css'

import Editor from './Editor'
import Preview from './Preview'
import Header from './Header'
import Footer from './Footer'

function App() {
  const [content, setContent] = useState('')

  const onChange = (nextState) => {
    console.log(nextState)
    setContent(nextState)
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
        <div className="flex-item">
          <Preview
            content={content}
          />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default App
