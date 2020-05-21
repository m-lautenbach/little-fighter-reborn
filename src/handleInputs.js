import inputState from './inputState'
import updatePlayer from './updatePlayer'
import state from './state'

let isFullscreen = false

export default (canvas) => {
  const { rendering } = state
  document.onkeydown = async ({ code, repeat }) => {
    if (repeat) return
    if (rendering.fullscreen && !isFullscreen) {
      await canvas.requestFullscreen()
      isFullscreen = true
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
