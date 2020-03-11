import React from 'react'
import MaterialIcon from '@material/react-material-icon'

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

import {
  ListItem,
  ListGroup,
  ListDivider,
  ListItemGraphic,
  ListItemText
} from '@material/react-list'

import Editor from './Editor'
import Preview from './Preview'
import Header from './Header'
import Templates from './Templates'
import HelpCards from './HelpCards'
import Provider from './Provider'

import auth from '../config/auth'
import template from '../config/template'

import '@material/react-list/dist/list.css'
import '@material/react-button/dist/button.css'
import '@material/react-drawer/dist/drawer.css'
import '@material/react-snackbar/dist/snackbar.css'
import '@material/react-top-app-bar/dist/top-app-bar.css'
import '@material/react-material-icon/dist/material-icon.css'

import './App.css'

import helpers from '../helpers.json'
import initial from '../initial.json'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      value: [],
      tab: 'jsonSchemas',
      helpers,
      initial,
      open: false
    }
  }

  componentDidMount () {
    if (localStorage.getItem('drawer')) {
      this.setState({ open: localStorage.getItem('drawer') === 'true' })
    }
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
    const { jsonSchemas, user, schemaId } = this.props

    const { open, helpers, tab } = this.state;

    return (
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
            {tab === 'jsonSchemas' &&
              <>
                <Templates
                  callback={this.props.onSelect}
                  createOne={this.props.createOne}
                  schemaId={this.props.schemaId}
                  jsonSchemas={jsonSchemas}
                  user={user}
                />
              </>
            }
            {tab === 'jsonSchemas' &&
              <ListGroup>
                <ListItem onClick={() => this.setState({ tab: 'help' })}>
                  <ListItemGraphic graphic={<MaterialIcon icon="navigate_next"/>}/>
                  <ListItemText primaryText="View Cheatsheet" />
                </ListItem>
                <ListDivider tag="div" />
              </ListGroup>
            }
            {tab === "help" &&
              <>
                <ListGroup>
                  <ListItem onClick={() => this.setState({ tab: 'jsonSchemas' })}>
                    <ListItemGraphic graphic={<MaterialIcon icon="navigate_before"/>}/>
                    <ListItemText primaryText="Cheatsheet" />
                  </ListItem>
                </ListGroup>
                <HelpCards items={helpers} />
              </>
            }
          </DrawerContent>
        </Drawer>

        <DrawerAppContent className="drawer-app-content">
          <Header
            className={`topbar-actions header ${this.state.open ? 'right-pad' : ''}`}
            user={this.props.user}
            toggleDrawer={this.toggleDrawer}
            schemaId={this.props.schemaId}
            deleteOne={this.props.deleteOne}
            generateData={this.props.generateData}
            setDataQuantity={this.props.setDataQuantity}
          />
          <div className="editor-wrapper">
            <div className="flex-container">
              <div className="flex-item">
                <Editor
                  onChange={this.props.generateSchema}
                  defaultValue={this.props.jsonRaw}
                  viewPortMargin={Infinity}
                  newSchemaId={schemaId}
                  readOnly={false}
                />
              </div>
              <div className="flex-item">
                <Preview
                  defaultValue={this.props.items}
                />
              </div>
            </div>
          </div>
        </DrawerAppContent>
      </div>
    )
  }
}
const Wrapped = new Provider(App);

export default Wrapped
