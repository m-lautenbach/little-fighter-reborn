import inputState from './inputState'
import updatePlayer from './updatePlayer'

export default () => {
  document.onkeydown = ({ code, repeat }) => {
    if (repeat) return
    inputState[code] = Date.now()
    updatePlayer()
  }
  document.onkeyup = ({ code, repeat }) => {
    if (repeat) return
    delete inputState[code]
    updatePlayer()
  }
}
