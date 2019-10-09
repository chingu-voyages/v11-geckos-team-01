import React from 'react'

import PropTypes from 'prop-types'

import Button from '@material/react-button'
import MaterialIcon from '@material/react-material-icon'

import '@material/react-button/dist/button.css'
import '@material/react-material-icon/dist/material-icon.css';

import './Header.css'

const Codegen = <MaterialIcon icon="cached" />

const LoginIcon = <MaterialIcon icon="open_in_new" />

function Header(props) {
  const isAuthenticated = () => !!props.user

  const Logout = () => (
    <Button
      dense
      outlined
      href="/auth/logout"
      className="logout btn"
    >
      Logout
      </Button>
  )

  const Login = () => (
    <Button
      href="/auth/github"
      className="login"
      icon={LoginIcon}
      outlined
      dense
    >
      Login with Github
    </Button>
  )

  return (
    <div className="header">
      {/* CONTENT HERE */}
      <Button
        className="codegen"
        icon={Codegen}
        onClick={props.callback}
        raised
        dense
      >
        Generate
      </Button>
      {isAuthenticated() ? <Logout /> : <Login />}
    </div>
  )
}

Header.propTypes = {
  callback: PropTypes.func
}
export default Header
