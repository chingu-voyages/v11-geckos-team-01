import React from 'react'

import PropTypes from 'prop-types'

import MaterialIcon from '@material/react-material-icon'

import '@material/react-button/dist/button.css'
import '@material/react-material-icon/dist/material-icon.css';

import './Header.css'

import { TextField, Button, ButtonGroup, AppBar, Toolbar, IconButton, Grid } from '@material-ui/core';

import { purple } from '@material-ui/core/colors';

import { fade, makeStyles, withStyles } from '@material-ui/core/styles';

import MenuIcon from '@material-ui/icons/Menu';

const OpenInNew = <MaterialIcon icon="open_in_new" />
const DeleteIcon = <MaterialIcon icon="delete" />

const useStyles = makeStyles(theme => ({
  appBar: {
    backgroundColor: theme.palette.common.white
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  quantity: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  quantityIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
  },
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
}));

const GenerateButton = withStyles(theme => ({
  root: {
    color: theme.palette.getContrastText(purple[800]),
    backgroundColor: purple[800],
    '&:hover': {
      backgroundColor: purple[900],
    },
  },
}))(Button);

function Header(props) {
  const classes = useStyles

  const Logout = () => (
    <Button
      href="/auth/logout"
      className="auth-btn"
    >
      Logout
    </Button>
  )

  const Login = () => (
    <Button
      variant="outlined"
      href="/auth/github"
      className="auth-btn"
    >
      {OpenInNew}
      Login with Github
    </Button>
  )

  return (
    <AppBar
      position="static"
      color="transparent"
    >
      <Toolbar>
        <Grid
          container
          alignItems="center"
          justify="space-between"
          spacing={1}
        >
          <Grid item xs={8}>
            <Grid
              container
              alignItems="center"
              spacing={1}
            >
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                onClick={props.toggleDrawer}
                aria-label="open drawer"
              >
                <MenuIcon />
              </IconButton>

              <Grid item>
                <GenerateButton
                  onClick={props.generateData}
                  variant="contained"
                >
                  Generate
                </GenerateButton>
              </Grid>

              <Grid item>
                <TextField
                  placeholder="Repeats"
                  onChange={props.setDataQuantity}
                  id="standard-number"
                  label="Number"
                  type="number"
                  size="small"
                  variant="outlined"
                  inputProps={{ 'aria-label': 'quantity' }}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item>
            <ButtonGroup
              variant="text"
              color="primary"
              aria-label="text primary button group"
            >
              {props.schemaId &&
                <Button
                  className="header-btn"
                  onClick={props.deleteOne}
                >
                  {DeleteIcon}
                  Delete
                </Button>
              }
              {props.schemaId &&
                <Button
                  target="_blank"
                  className="header-btn"
                  href={`/api/json/${props.schemaId}`}
                >
                  {OpenInNew}
                  JSON
                </Button>
              }
              {props.user ? <Logout /> : <Login />}
            </ButtonGroup>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  )
}

Header.propTypes = {
  toggleDrawer: PropTypes.func,
  callback: PropTypes.func,
  deleteOne: PropTypes.func,
  schemaId: PropTypes.string,
  onTextInput: PropTypes.func
}
export default Header
