import React from 'react'
import ReactDOM from 'react-dom'
import 'antd/dist/antd.css'
import { Typography } from 'antd'

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
  </div>,
  document.getElementById('react'),
)

phaser.start()
