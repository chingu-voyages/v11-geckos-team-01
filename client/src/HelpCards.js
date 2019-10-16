import React from 'react'

import PropTypes from 'prop-types'

import List, {
  ListItem,
  ListGroup,
  ListItemGraphic,
  ListGroupSubheader,
  ListDivider,
  ListItemText
} from '@material/react-list'

import Card, {
  CardPrimaryContent
} from "@material/react-card"

import '@material/react-card/dist/card.css'

import './HelpCards.css'

function HelpCards(props) {
  return (
    <ListGroup>
      <ListGroupSubheader className="help-cards-header" tag="h1">My Templates</ListGroupSubheader>
      
      <List>
        {props.items.map(({ name, usage, desc, returns }) => (
          <Card>
            <CardPrimaryContent className="help-card">
              <h2>{name}</h2>
              <h5>Description</h5>
              {desc}
              <h5>Usage</h5>
              <pre
                className="code code-usage"
              >{usage}</pre>
              <h5>Returns</h5>
              <pre
                className="code code-returns"
              >{returns}</pre>
            </CardPrimaryContent>
          </Card>        
        ))}         
      </List>       
    </ListGroup>
  )
}

HelpCards.propTypes = {
  items: PropTypes.array
}

export default HelpCards
