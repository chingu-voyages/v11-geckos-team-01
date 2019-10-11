
import React from 'react'

import PropTypes from 'prop-types'
import moment from 'moment'

import MaterialIcon from '@material/react-material-icon'

import { Route } from "react-router-dom"

import List, {
  ListItem,
  ListGroup,
  ListItemGraphic,
  ListGroupSubheader,
  ListDivider,
  ListItemText
} from '@material/react-list'

function Templates (props) {
  return (
    <Route render={({ history }) => (
      <>
        <ListGroup>
          <ListGroupSubheader tag='h1'>My Templates</ListGroupSubheader>
          <List singleSelection selectedIndex={props.selectedIndex}>
            {
              props.templates && 
              props.templates.length ?
              props.templates.map(({ _id, name, createdOn }) => (
                <ListItem key={_id} onClick={() => history.push(`/${_id}`)}>
                  <ListItemGraphic graphic={<MaterialIcon icon='folder'/>} />
                  <ListItemText primaryText={name || moment(createdOn).format('MMMM Do YYYY, h:mm:ss a')} />
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
          <ListDivider tag="div" />
        </ListGroup>
      </>      
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
