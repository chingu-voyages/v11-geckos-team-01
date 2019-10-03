
import React, { Fragment } from 'react'

import axios from 'axios'

import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from "react-router-dom"

import PropTypes from 'prop-types'

import Button from '@material/react-button'
import MaterialIcon from '@material/react-material-icon'

import '@material/react-button/dist/button.css'
import '@material/react-material-icon/dist/material-icon.css'


import styles from './Header.css'

const Codegen = <MaterialIcon icon="cached" />

const LoginIcon  = <MaterialIcon icon="open_in_new"/>

function Header (props) {
  const Logout = () => (
    <Route render={({ history }) => (
      <Button
        dense
        outlined
        onClick={() => {
          history.push('/logout')
          localStorage.removeItem('user')
          window.location.reload()
        }}
        className={styles.logout}
      >
        Logout
      </Button>  
    )} />
  )

  const Login = withRouter(({ history }) => (
    <Button
      href="/login/github"
      className={styles.login}
      icon={LoginIcon}
      outlined
      dense
    >
      Login with Github
    </Button>      
  ))

  return (
    <Fragment>
      <Button
        className={styles.codegen}
        icon={Codegen}
        onClick={props.callback}
        raised
        dense
      >
        Generate
      </Button>
      {props.user ?  <Logout /> : <Login />}
    </Fragment>
  )
}

Header.propTypes = {
  callback: PropTypes.func
}
export default Header
