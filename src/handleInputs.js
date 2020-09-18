import { once } from 'lodash'

import inputState from './inputState'
import updatePlayer from './updatePlayer'
import assetCache from './assetCache'

let isFullscreen = false

const fullscreenContainer = document.getElementById('fullscreen-container')

let audio

const playBackgroundAudio = once(
  () => {
    audio = assetCache.sounds.forrest
    audio.addEventListener('ended', () => {
      audio.currentTime = 0
      audio.play()
    })
    audio.play()
  },
)

export default () => {
  document.onkeydown = async ({ code, repeat }) => {
    playBackgroundAudio()

    if (repeat) return
    if (code === 'KeyF') {
      if (isFullscreen) {
        closeFullscreen()
        isFullscreen = false
      } else {
        openFullscreen(fullscreenContainer)
        isFullscreen = true
      }
      return
    }
    inputState[code] = Date.now()
    updatePlayer()
  }
  document.onkeyup = ({ code, repeat }) => {
    if (repeat) return
    delete inputState[code]
    updatePlayer()
  }
  window.addEventListener('blur', () => {
    audio?.pause()
    for (const code in inputState) delete inputState[code]
    updatePlayer()
  })
  window.addEventListener('focus', () => audio?.play())
}

function openFullscreen(elem) {
  const requestFullScreen = elem.requestFullscreen || elem.mozRequestFullScreen || elem.webkitRequestFullscreen || elem.msRequestFullscreen
  requestFullScreen()
}

function closeFullscreen() {
  const exitFullScreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen

  exitFullScreen()
}
