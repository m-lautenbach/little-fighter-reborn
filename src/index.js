import React from 'react'
import ReactDOM from 'react-dom'
import 'antd/dist/antd.css'
import { Typography, Button } from 'antd'

import * as vanilla from './breakout-vanilla'
import * as phaser from './breakout-phaser'
import logo from './favicon.png'

const { Title } = Typography

ReactDOM.render(
  <div
    style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', alignItems: 'center' }}
  >
    <Title style={{ margin: '2rem' }}>
      <img src={logo} alt="logo" /> BREAKOUT <img src={logo} alt="logo" />
    </Title>
    <div style={{ margin: '2rem' }}>
      <Button
        type="primary"
        style={{ marginRight: '.5rem' }}
        onClick={() => {
          phaser.stop()
          vanilla.start()
        }}
      >
        Start Vanilla JS version
      </Button>
      <Button
        type="primary"
        onClick={() => {
          vanilla.stop()
          phaser.start()
        }}
      >
        Start Phaser version
      </Button>
    </div>
  </div>,
  document.getElementById('react'),
)

phaser.start()
