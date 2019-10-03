
import React, { Fragment } from 'react'

import PropTypes from 'prop-types'

import MaterialIcon from '@material/react-material-icon'

import {
  BrowserRouter as Router,
  // Route,
  Link,
  // Redirect,
  // withRouter
} from "react-router-dom"

import List, {
  ListItem,
  ListItemGraphic,
  ListItemText
} from '@material/react-list'

function Templates (props) {
  return (
    <Fragment>
      <List singleSelection selectedIndex={props.selectedIndex}>
        {
          props.templates.map(({ _id, name, createdOn }, index) => (
            // onClick={() => router.push(_id)}
            <ListItem to={_id}>
              <ListItemGraphic graphic={<MaterialIcon icon='folder'/>} />
              <ListItemText primaryText={name || createdOn } />
            </ListItem>
            )
          )
        }
      </List>      
    </Fragment>
  )
}

Templates.propTypes = {
  selectedIndex: PropTypes.number,
  //
  // An array of objects
  //
  // This should be sourced from the the users collection.
  templates: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.name,
      createdOn: PropTypes.string
    })
  )
}
export default Templates
