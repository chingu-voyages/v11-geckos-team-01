import React from 'react'

import PropTypes from 'prop-types'

import Button from '@material/react-button'
import MaterialIcon from '@material/react-material-icon'

import '@material/react-button/dist/button.css'
import '@material/react-material-icon/dist/material-icon.css';

import './Header.css'

const Codegen = <MaterialIcon icon="cloud_upload" />
const OpenInNew = <MaterialIcon icon="open_in_new" />
const DeleteIcon = <MaterialIcon icon="delete" /> 

function Header(props) {
  const Logout = () => (
    <Button
      outlined
      href="/auth/logout"
      className="auth-btn"
    >
      Logout
      </Button>
  )

  const Login = () => (
    <Button
      href="/auth/github"
      className="auth-btn"
      icon={OpenInNew}
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
        <>
          <Button
            icon={DeleteIcon}
            color="red"
            className="header-btn"
            onClick={props.deleteOne}
            outlined
          >
            Delete
          </Button>
          <Button
            target="_blank"
            outlined
            icon={OpenInNew}
            className="header-btn"
            href={`/api/json/${props.templateId}`}
          >
            JSON
          </Button>        
        </>
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
