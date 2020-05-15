import inputState from './inputState'
import channels from './netcode/channels'
import updatePlayer from './updatePlayer'

export default () => {
  document.onkeydown = ({ code, repeat }) => {
    if (repeat) return
    inputState[code] = Date.now()
    updatePlayer()
    channels.forEach(channel => channel.send(JSON.stringify({ code, down: true })))
  }
  document.onkeyup = ({ code, repeat }) => {
    if (repeat) return
    delete inputState[code]
    updatePlayer()
    channels.forEach(channel => channel.send(JSON.stringify({ code, up: true })))
  }
}
