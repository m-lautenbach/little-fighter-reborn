import inputState from '../inputState'

const xor = (a, b) => !!a !== !!b

const getUpdatedAnimation = () => {
  const { KeyW, KeyA, KeyS, KeyD, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } = inputState
  const left = KeyA || ArrowLeft
  const right = KeyD || ArrowRight
  const up = KeyW || ArrowUp
  const down = KeyS || ArrowDown
  return (xor(left, right) || xor(up, down)) ? 'walking' : 'standing'
}

export default animation => {
  const { id } = animation
  const updatedAnimation = getUpdatedAnimation()
  if (updatedAnimation !== id) {
    animation.frame = 0
    animation.start = Date.now()
    animation.bounced = false
    animation.id = updatedAnimation
  }
}
