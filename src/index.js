import React from 'react'
import ReactDOM from 'react-dom'
import 'antd/dist/antd.css'
import { Typography, Button } from 'antd'

import { start } from './breakout'

const { Title } = Typography

ReactDOM.render(
  <div
    style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', alignItems: 'center' }}
  >
    <Title style={{ margin: '2rem' }}>Hello World</Title>
    <Button style={{ margin: '2rem' }} type="primary" onClick={start}>Start Game</Button>
  </div>,
  document.getElementById('react'),
)
