import React, { useEffect } from 'react'
import start from './start'

export default () => {
  useEffect(() => {
    const ignored = start()
  }, [])

  return <>
    <canvas id="image-manipulation" width="100" height="200" style={{ position: 'absolute', left: -200, top: 0 }} />
  </>
}
