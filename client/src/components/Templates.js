
import React from 'react'
import debounce from 'lodash.debounce'

import PropTypes from 'prop-types'
import moment from 'moment'

import MaterialIcon from '@material/react-material-icon'

import { makeStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

const CreateIcon = (
  <MaterialIcon
    style={{ color: 'green' }}
    icon="add"
  />
)

function Templates (props) {
  const focusSchema = (schema) => {

    if (schema._id !== props.schemaId) {
      props.callback(schema)
    }
  }

  const createOne = debounce(props.createOne, 1000, {
    leading: true,
    trailing: false
  })

  return (
    <>
      {props.user
      ? <>
          <List>
            <ListItem
              button
              onClick={createOne}
            >
              <ListItemIcon>
                {CreateIcon}
              </ListItemIcon>
              <ListItemText primary="Create New Template" />
            </ListItem>
          </List>

          <List component="nav">
            {
              props.jsonSchemas &&
              props.jsonSchemas.length ?
              props.jsonSchemas.map((template) => (
                <ListItem
                  button
                  selected={props.schemaId === template._id}
                  key={template._id} onClick={() => focusSchema(template)}
                >
                  <ListItemIcon>
                    <MaterialIcon icon="folder"/>
                  </ListItemIcon>
                  <ListItemText
                    primary={template.name || moment(template.createdOn).format('MMMM Do YYYY, h:mm:ss a')}
                  />
                </ListItem>
                )
              )
              : (
                <ListItem disabled>
                  <ListItemText primary="No Data Available" />
                </ListItem>
              )
            }
          </List>
          <Divider />
        </>

      : <List>
          <ListSubheader
            style={{ paddingBottom: 15 }}
            tag="h1"
          >
            Please Login
          </ListSubheader>
          <Divider />
        </List>
      }
    </>
  )
}

Templates.propTypes = {
  selectedIndex: PropTypes.number,
  setSelectedIndex: PropTypes.func,
  schemaId: PropTypes.string,
  createOne: PropTypes.func,
  callback: PropTypes.func,
  //
  // An array of objects
  //
  // "jsonSchemas" prop should be sourced from the the users collection.
  //
  jsonSchemas: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.name,
      createdOn: PropTypes.string
    })
  )
}
export default Templates
