import initialState from './initialState'

export default () => {
  const canvas = document.getElementById('screen')
  canvas.setAttribute('width', `${initialState.rendering.width}px`)
  canvas.setAttribute('height', `${initialState.rendering.height}px`)
  return canvas
}
