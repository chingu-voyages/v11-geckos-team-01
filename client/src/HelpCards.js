import React from 'react'

import PropTypes from 'prop-types'

import List, {
  ListGroup,
  ListDivider,
} from '@material/react-list'

import '@material/react-card/dist/card.css'

import './HelpCards.css'

function HelpCards(props) {
  return (
    <ListGroup>
      <ListDivider tag="div" />
      <List>
        {props.items.map(({ name, usage, desc, returns }) => (
          <div className="help-card">
            <div className="help-name">
              <h2>{name}</h2>
            </div>
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
          </div>       
        ))}         
      </List>       
    </ListGroup>
  )
}

HelpCards.propTypes = {
  items: PropTypes.array
}

export default HelpCards
