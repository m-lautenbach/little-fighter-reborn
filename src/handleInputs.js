import inputState from './inputState'
import updatePlayer from './updatePlayer'

let isFullscreen = false

const fullscreenContainer = document.getElementById('fullscreen-container')

export default () => {
  document.onkeydown = async ({ code, repeat }) => {
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
    for (const code in inputState) delete inputState[code]
    updatePlayer()
  })
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
