import inputState from './inputState'
import channels from './netcode/channels'

export default () => {
  document.onkeydown = ({ code, repeat }) => {
    if (repeat) return
    inputState[code] = Date.now()
    channels.forEach(channel => channel.send(JSON.stringify({ code, down: true })))
  }
  document.onkeyup = ({ code, repeat }) => {
    if (repeat) return
    delete inputState[code]
    channels.forEach(channel => channel.send(JSON.stringify({ code, up: true })))
  }
}
