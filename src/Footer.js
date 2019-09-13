import React from 'react'

import './Footer.css'

function Footer () {
  return (
    <div className="footer">
      <span
        role="img" className="hang-loose" aria-label="Hang Loose"
      >✌️</span>
      <span>Chingu Cohorts</span><span>&nbsp;</span><span>{new Date().getFullYear()}</span>
    </div>    
  )
}

export default Footer
