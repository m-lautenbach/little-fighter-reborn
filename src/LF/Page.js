import React, { useEffect } from 'react'
import { Typography } from 'antd'
import start from './start'

const { Title } = Typography

export default () => {
  useEffect(() => {
    const ignored = start()
  }, [])

  return <>
    <Title style={{ margin: '2rem' }}>
      LF2 Migration
    </Title>
    <canvas id="image-manipulation" width="100" height="200" style={{ position: 'absolute', left: -200, top: 0 }} />
  </>
}
