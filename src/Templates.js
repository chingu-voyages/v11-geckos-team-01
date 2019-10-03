
import React from 'react'

import PropTypes from 'prop-types'

import MaterialIcon from '@material/react-material-icon'

import { Route } from "react-router-dom"

import List, {
  ListItem,
  ListItemGraphic,
  ListItemText
} from '@material/react-list'

function Templates (props) {
  return (
    <Route render={({ history }) => (
      <List singleSelection selectedIndex={props.selectedIndex}>
        {
          props.templates && 
          props.templates.length ?
          props.templates.map(({ _id, name, createdOn }) => (
            <ListItem key={_id} onClick={() => history.push(`/${_id}`)}>
              <ListItemGraphic graphic={<MaterialIcon icon='folder'/>} />
              <ListItemText primaryText={name || createdOn } />
            </ListItem>
            )
          )
          : (
            <ListItem disabled>
              <ListItemText primaryText="No Data Available" />
            </ListItem>
          )
        }
      </List>
    )} />
  )
}

Templates.propTypes = {
  selectedIndex: PropTypes.number,
  //
  // An array of objects
  //
  // "templates" prop should be sourced from the the users collection.
  //
  templates: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.name,
      createdOn: PropTypes.string
    })
  )
}
export default Templates
