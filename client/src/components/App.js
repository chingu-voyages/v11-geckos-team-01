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
      result: [],
      templates: [],
      tab: 'templates',
      helpers,
      initial,
      selectedIndex: 0,
      templateId: '',
      open: false
    }
  }

  async componentDidMount() {
    if (localStorage.getItem('drawer')) {
      this.setState({ open: localStorage.getItem('drawer') === 'true' })
    }
    template.get('/').then(({ data }) => {
      this.setState({ templates: data });
    });
    const response = await auth.get('/current_user', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })

    if (response.status === 200 && response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user))
      this.setState({ user: response.data.user })
    }
  }

  onChange = (nextState) => {
    this.setState({ value: nextState })
  }

  createOne = () => {
    const { templates } = this.props

    // const payload = { template: formatJSONfromString(initial) }
    const payload = { template: null }

    template.post('/', payload).then(({ data }) => {
      const nextState = [...templates, data]
      this.setState({
        templateId: data._id,
        templates: nextState,
        selectedIndex: nextState.length - 1,
        value: JSON.parse(data.template),
        result: []
      })
    }).catch((error) => {
      console.error(error)
    })
  }

  deleteOne = () => {
    const { templates, templateId } = this.props

    const url = `/${templateId}`

    template.delete(url).then((data) => {
      const nextState = templates.filter(({ _id }) => _id !== templateId)

      if (nextState.length) {
        const selectedIndex = nextState.length - 1
        const last = nextState[selectedIndex]
        this.setState({
          templateId: last._id,
          value: JSON.parse(last.template),
          result: [],
          templates: nextState,
          selectedIndex })
      } else {
        this.setState({
          templateId: '',
          templates: [],
          value: []
        })
      }
    }).catch((error) => {
      console.error(error)
    })
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

  setSelectedIndex = (selectedIndex) => {
    this.setState({ selectedIndex })
  }

  onSelect = (nextState) => {
    this.setState({
      templateId: nextState._id,
      result: [],
      value: JSON.parse(nextState.template)
    })
  }

  render() {
    const { open, selectedIndex, templates, user, result, value, templateId, helpers, tab } = this.state;

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
            {tab === 'templates' &&
              <>
                <Templates
                  setSelectedIndex={this.setSelectedIndex}
                  selectedIndex={selectedIndex}
                  callback={this.props.onSelect}
                  createOne={this.props.createOne}
                  templates={templates}
                  user={user}
                />
              </>
            }
            {tab === 'templates' &&
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
                  <ListItem onClick={() => this.setState({ tab: 'templates' })}>
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
          <TopAppBar title="Inbox" className="top-app-bar">
            <TopAppBarRow
              className={`header ${this.state.open ? 'right-pad' : ''}`}
            >
              <TopAppBarSection align="start" role="toolbar">
                <TopAppBarIcon navIcon onClick={this.toggleDrawer}>
                  <i className="material-icons">menu</i>
                </TopAppBarIcon>
                <Header
                  className="topbar-actions"
                  user={user}
                  templateId={templateId}
                  deleteOne={this.deleteOne}
                  generateData={this.props.generateData}
                  setDataQuantity={this.props.setDataQuantity}
                />
              </TopAppBarSection>
            </TopAppBarRow>
          </TopAppBar>
          <TopAppBarFixedAdjust>
            <div className="editor-wrapper">
              <div className="flex-container">
                <div className="flex-item">
                  <Editor
                    onChange={this.props.generateSchema}
                    viewPortMargin={Infinity}
                    newTemplateId={templateId}
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
          </TopAppBarFixedAdjust>
        </DrawerAppContent>
      </div>
    )
  }
}
const Wrapped = new Provider(App);

export default Wrapped
