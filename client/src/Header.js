import React from 'react'

import PropTypes from 'prop-types'

import Button from '@material/react-button'
import MaterialIcon from '@material/react-material-icon'

import '@material/react-button/dist/button.css'
import '@material/react-material-icon/dist/material-icon.css';

import './Header.css'

const Codegen = <MaterialIcon icon="cloud_upload" />
const LoginIcon = <MaterialIcon icon="open_in_new" />
const DeleteIcon = <MaterialIcon icon="delete" /> 

function Header(props) {
  const Logout = () => (
    <Button
      dense
      outlined
      href="/auth/logout"
      className="logout"
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
    >
      Login with Github
    </Button>
  )

  return (
    <>
      <Button
        className="codegen"
        icon={Codegen}
        onClick={props.callback}
        raised
      >
        <div>Generate</div>
      </Button>
      {props.templateId &&
        <Button
          icon={DeleteIcon}
          color="red"
          onClick={props.deleteOne}
          outlined
        >
          Delete
        </Button>
      }
      {props.user ? <Logout /> : <Login />}
    </>
  )
}

Header.propTypes = {
  callback: PropTypes.func,
  deleteOne: PropTypes.func,
  templateId: PropTypes.string
}
export default Header
