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
  }
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
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
  }
}
