import React, { createElement } from 'react'
import ReactDOM from 'react-dom'

import LF2Page from './Page'

ReactDOM.render(
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      width: '100%',
      alignItems: 'center',
    }}
  >
    {createElement(LF2Page)}
  </div>,
  document.getElementById('react'),
)
