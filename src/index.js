import React, { createElement } from 'react'
import ReactDOM from 'react-dom'
import 'antd/dist/antd.css'
import { Menu } from 'antd'

import BreakoutPhaserPage from './BreakoutPhaser/Page'
import BreakoutVanillaPage from './BreakoutVanilla/Page'
import BouncyBombs from './BouncyBombs/Page'
import TopScrollerPage from './TopScroller/Page'
import NativeExperimentsPage from './NativeExperiments/Page'

const TABS = {
  NATIVE_EXPERIMENTS: '#native-experiments',
  TOP_SCROLLER: '#top-scroller',
  BREAKOUT_PHASER: '#breakout-phaser',
  BREAKOUT_VANILLA_JS: '#breakout-vanilla-js',
  BOUNCY_BOMBS: '#bouncy-bombs',
}

const PageForTab = {
  [TABS.NATIVE_EXPERIMENTS]: NativeExperimentsPage,
  [TABS.TOP_SCROLLER]: TopScrollerPage,
  [TABS.BREAKOUT_PHASER]: BreakoutPhaserPage,
  [TABS.BREAKOUT_VANILLA_JS]: BreakoutVanillaPage,
  [TABS.BOUNCY_BOMBS]: BouncyBombs,
}

const activeTab =
  Object.values(TABS).includes(location.hash) ?
    location.hash : TABS.BOUNCY_BOMBS

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
      <Menu.Item key={TABS.NATIVE_EXPERIMENTS}>
        Native Experiments
      </Menu.Item>
      <Menu.Item key={TABS.TOP_SCROLLER}>
        TopScroller 3000
      </Menu.Item>
      <Menu.Item key={TABS.BOUNCY_BOMBS}>
        Bouncy Bombs
      </Menu.Item>
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
