import React from 'react'

import PropTypes from 'prop-types'

import MaterialIcon from '@material/react-material-icon'

import '@material/react-button/dist/button.css'
import '@material/react-material-icon/dist/material-icon.css';

import './Header.css'

import { TextField, Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

import { makeStyles } from '@material-ui/core/styles';

const Codegen = <MaterialIcon icon="cloud_upload" />
const OpenInNew = <MaterialIcon icon="open_in_new" />
const DeleteIcon = <MaterialIcon icon="delete" />

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
}));

function Header(props) {
  const Logout = () => (
    <Button
      variant="outlined"
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
      variant="outlined"
    >
      Login with Github
    </Button>
  )

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Grid container spacing={1} justify="space-between">
          <div>
            <Button
              color="primary"
              onClick={props.generateData}
              variant="contained"
            >
              {Codegen}
              Generate
            </Button>
            <TextField
              onChange={props.setDataQuantity}
              style={{ margin: '0 8px 0 8px' }}
              variant="outlined"
              size="small"
            />
          </div>
          {props.templateId &&
            <>
              <Button
                icon={DeleteIcon}
                color="red"
                className="header-btn"
                onClick={props.deleteOne}
                variant="contained"
              >
                Delete
              </Button>
              <Button
                target="_blank"
                icon={OpenInNew}
                className="header-btn"
                variant="contained"
                href={`/api/json/${props.templateId}`}
              >
                JSON
              </Button>
            </>
          }
          {props.user ? <Logout /> : <Login />}
        </Grid>
      </Grid>
    </Grid>
  )
}

Header.propTypes = {
  callback: PropTypes.func,
  deleteOne: PropTypes.func,
  templateId: PropTypes.string,
  onTextInput: PropTypes.func
}
export default Header
