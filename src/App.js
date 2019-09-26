import React, { useState } from 'react'
import './App.css'

// import Resizable from 'react-resizable'
import './Resizable.css'

import Editor from './Editor'
import Preview from './Preview'
import Header from './Header'
import Footer from './Footer'

const ResizableBox = require('react-resizable').ResizableBox
// const Resizable = require('react-resizable').Resizable

class App extends React.Component {
  // const [content, setContent] = useState('')
  constructor(props) {
    super(props)
    this.state = {
      clientWidth: 0,
      height: 0,
      content: '',
      boxHeight: 0,
      boxWidth: 0
    }
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
  }
  
  componentDidMount() {
    this.updateWindowDimensions()
    window.addEventListener('resize', this.updateWindowDimensions)

    const boxHeight = this.resizableBox.clientHeight
    const boxWidth = this.resizableBox.clientWidth
    console.log('Box Height', this.resizableBox.clientHeight)
    console.log('Window', window.innerHeight)
    this.setState({ boxWidth, boxHeight })
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions)
  }
  
  updateWindowDimensions() {
    this.setState({ clientWidth: window.innerWidth, height: window.innerHeight })
  }

  onChange (nextState) {
    this.setState({ content: nextState })
  }
  render () {
    return (
      <div className="app">
        <Header />
        <div className="flex-container"
          ref={(resizableBox) => this.resizableBox = resizableBox}
        >
          <ResizableBox
            className="box flex-item"
            width={this.state.clientWidth / 2}
            height={this.state.boxHeight}
            axis="x"
          >
            <Preview content={this.content} />

          </ResizableBox>
          <div className="flex-item"
            style={{ width: this.state.clientWidth - this.state.boxWidth }}
          >
            <Editor
              onChange={() => {}}
            />
          </div>
          {/* {this.state.boxHeight} */}
        </div>
        <Footer />
      </div>
    )
  }
}

export default App
