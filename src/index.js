import React, { createElement } from 'react'
import ReactDOM from 'react-dom'
import 'antd/dist/antd.css'
import { Menu } from 'antd'

import BreakoutPhaserPage from './BreakoutPhaserPage'
import BreakoutVanillaPage from './BreakoutVanillaPage'

const TABS = {
  BREAKOUT_PHASER: '#breakout-phaser',
  BREAKOUT_VANILLA_JS: '#breakout-vanilla-js',
}

const PageForTab = {
  [TABS.BREAKOUT_PHASER]: BreakoutPhaserPage,
  [TABS.BREAKOUT_VANILLA_JS]: BreakoutVanillaPage,
}

const activeTab = Object.values(TABS).includes(location.hash) ? location.hash : TABS.BREAKOUT_PHASER

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
    <Menu
      mode="horizontal"
      selectedKeys={[activeTab]}
      onClick={({ key }) => {
        window.location.href = key
        window.location.reload()
      }}
    >
      <Menu.Item key={TABS.BREAKOUT_PHASER}>
        Breakout - Phaser Version
      </Menu.Item>
      <Menu.Item key={TABS.BREAKOUT_VANILLA_JS}>
        Breakout - Vanilla JS Version
      </Menu.Item>
    </Menu>
    {createElement(PageForTab[activeTab])}
  </div>,
  document.getElementById('react'),
)
