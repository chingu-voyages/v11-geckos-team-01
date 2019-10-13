
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

const CreateIcon = (
  <MaterialIcon
    style={{ color: 'green' }}
    icon="add"
  />
)

function Templates (props) {

  const focusTemplate = (template, history) => {
    history.push(`/${template._id}`)
    props.callback(template)
  }

  return (
    <Route render={({ history }) => (
      <>
        <ListGroup>
          <ListItem>
            <ListItemGraphic graphic={CreateIcon}/>
            <ListItemText primaryText="Create New Template" />
          </ListItem>
          <ListDivider tag="div" />
          <ListGroupSubheader tag='h1'>My Templates</ListGroupSubheader>
          <List singleSelection selectedIndex={props.selectedIndex}>
            {
              props.templates && 
              props.templates.length ?
              props.templates.map((template) => (
                <ListItem key={template._id} onClick={() => focusTemplate(template, history)}>
                  <ListItemGraphic graphic={<MaterialIcon icon='folder'/>} />
                  <ListItemText
                    primaryText={template.name || moment(template.createdOn).format('MMMM Do YYYY, h:mm:ss a')}
                  />
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
  callback: PropTypes.func,
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
